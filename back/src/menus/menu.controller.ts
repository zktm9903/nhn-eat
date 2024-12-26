import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { MenuService } from './menu.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { UserMenusService } from 'src/user-menus/user-menus.service';
import { UserService } from 'src/users/user.service';
import { Menu } from './entity/menu.entity';
import { UserMenu } from 'src/user-menus/entity/user-menus.entity';
import { MealType } from './enum/meal-type.enum';

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

  @Get('')
  async getMenus(@Req() request: Request) {
    const uid = request.headers['authorization'];
    const date = request.query['date'] as string;
    const mealType = request.query['mealType'] as MealType;

    const menus: MenuWithUserStatus[] = await this.menuService.getMenus(
      mealType,
      date,
    );

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

  @Get('/dates')
  async getDates() {
    const dates = await this.menuService.getAvailableDates();
    return dates;
  }

  @Post('/:menuId/like')
  async likeMenu(@Req() request: Request) {
    const menuId = request.params.menuId;
    const uid = request.headers['authorization'];

    await this.userMenusService.likeMenu(uid, +menuId);

    return 'success';
  }

  @Post('/:menuId/dislike')
  async dislikeMenu(@Req() request: Request) {
    const menuId = request.params.menuId;
    const uid = request.headers['authorization'];

    await this.userMenusService.dislikeMenu(uid, +menuId);

    return 'success';
  }
}
