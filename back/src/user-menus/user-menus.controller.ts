import { Controller, Get, Query } from '@nestjs/common';
import { Menu, UserMenusService } from './user-menus.service';

@Controller({ version: '2' })
export class UserMenusController {
  constructor(private readonly userMenusService: UserMenusService) {}

  @Get('/today')
  getMenus(@Query('date') date: string): Menu[] {
    return this.userMenusService.getMenus(date);
  }
}
