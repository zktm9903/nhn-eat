import { Controller, Get, Query } from '@nestjs/common';
import { AppService, Menu } from './app.service';

@Controller({ version: '2' })
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/today')
  getMenus(@Query('date') date: string): Menu[] {
    return this.appService.getMenus(date);
  }
}
