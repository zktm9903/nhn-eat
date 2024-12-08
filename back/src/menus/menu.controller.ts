import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { UserMenusService } from 'src/user-menus/user-menus.service';
import { UserService } from 'src/users/user.service';
import { Menu } from './entity/menu.entity';
import { UserMenu } from 'src/user-menus/entity/user-menus.entity';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type MenuWithUserStatus = Menu & {
  user?: Pick<UserMenu, 'id' | 'liked'>;
};

@Controller({ version: '1', path: '/menu' })
@UseGuards(AuthGuard)
export class MenuController {
  constructor(
    private readonly menuService: MenuService,
    private readonly userService: UserService,
    private readonly userMenusService: UserMenusService,
  ) {}

  @Post()
  getTest(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.createMenu(createMenuDto);
  }

  @Get('/today')
  async getMenus(@Req() request: Request) {
    const uid = request.headers['authorization'];

    const menus: MenuWithUserStatus[] = await this.menuService.getTodayMenus();

    for (const menu of menus) {
      let userMenu = await this.userMenusService.getUserMenu(uid, menu.id);
      if (!userMenu) {
        const user = await this.userService.findOne(uid);
        userMenu = await this.userMenusService.insertUserMenu(user, menu);
      }
      menu.user = {
        id: userMenu.id,
        liked: userMenu.liked,
      };
    }

    return menus;
  }

  @Post('/:menuId/like')
  async likeMenu(@Req() request: Request) {
    const menuId = request.params.menuId;
    const uid = request.headers['authorization'];

    const userMenu = await this.userMenusService.getUserMenu(
      uid,
      parseInt(menuId),
    );
    await this.userMenusService.likeMenu(userMenu, +menuId, true);

    return 'success';
  }

  @Post('/:menuId/dislike')
  async dislikeMenu(@Req() request: Request) {
    const menuId = request.params.menuId;
    const uid = request.headers['authorization'];

    const userMenu = await this.userMenusService.getUserMenu(
      uid,
      parseInt(menuId),
    );
    await this.userMenusService.likeMenu(userMenu, +menuId, false);

    return 'success';
  }

  @Post('/crawling/velog')
  async insertMenusFromVelog(@Req() request: Request) {
    const date = request.query.date as string;
    const success = await this.menuService.deleteMenuByDate(date);
    if (success) console.log('-----------delete success', date);
    const menus = await this.menuService.crawlingVelog(date);
    if (!menus.length)
      throw new HttpException('Forbidden', HttpStatus.FAILED_DEPENDENCY);

    for (let i = 0; i < menus.length; i++) {
      await this.menuService.createMenu(menus[i]);
      console.log(menus[i]);
    }

    return menus;
  }
}
