import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { MenuService, Menu } from './menu.service';
// import { AuthGuard } from 'src/auth/auth.guard';

@Controller({ version: '2' })
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get('/today')
  // @UseGuards(AuthGuard)
  getMenus(@Query('date') date: string): Menu[] {
    return this.menuService.getMenus(date);
  }
}
