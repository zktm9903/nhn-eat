import { Controller, Get, Query } from '@nestjs/common';
import { MenuService, Menu } from './menu.service';

@Controller({ version: '2' })
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get('/today')
  getMenus(@Query('date') date: string): Menu[] {
    return this.menuService.getMenus(date);
  }
}
