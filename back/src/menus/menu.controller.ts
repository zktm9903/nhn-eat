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

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

@Controller({ version: '1', path: '/menu' })
@UseGuards(AuthGuard)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  getTest(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.createMenu(createMenuDto);
  }

  @Get('/today')
  async getMenus(@Req() request: Request) {
    const uid = request.headers['authorization'];
    console.log('uid', uid);
    // 3초 기다리기
    await delay(3000);
    return this.menuService.getTodayMenus(uid);
  }

  @Post('/:id/like')
  async likeMenu(@Req() request: Request) {
    const menuId = request.params.id;
    // const
    // console.log(menuId);

    return 'success';
  }

  @Post('/crawling/velog')
  async insertMenusFromVelog(@Req() request: Request) {
    const date = request.query.date as string;
    const menus = await this.menuService.crawlingVelog(date);
    if (!menus.length)
      throw new HttpException('Forbidden', HttpStatus.FAILED_DEPENDENCY);

    for (let i = 0; i < menus.length; i++) {
      await this.menuService.createMenu(menus[i]);
      console.log(menus[i]);
    }

    return 'success';
  }
}
