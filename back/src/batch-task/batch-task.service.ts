import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CrawlingService } from 'src/crawling/crawling.service';
import { Menu } from 'src/menus/entity/menu.entity';
import { MenuService } from 'src/menus/menu.service';

const isSameMenu = (menu1: Menu, menu2: Menu) => {
  return (
    menu1.name === menu2.name &&
    new Date(menu1.date).toISOString().slice(0, 10) ===
      new Date(menu2.date).toISOString().slice(0, 10)
  );
};

@Injectable()
export class BatchTaskService implements OnModuleInit {
  constructor(
    private crawlingService: CrawlingService,
    private menuService: MenuService,
  ) {}

  async onModuleInit() {
    setTimeout(async () => {
      await this.crawingMenus();
    }, 100);
  }
  @Cron('*/1 * * * 1-5', {
    timeZone: 'Asia/Seoul',
  })
  async nightJob() {
    await this.crawingMenus();
  }

  async crawingMenus() {
    const dates = await this.crawlingService.getPossibleDates();

    for (const date of dates) {
      const duplicatedMenus = await this.crawlingService.getMenus(date);
      const menuSet = new Set(
        duplicatedMenus.map((menu) => JSON.stringify(menu)),
      );

      const menus = Array.from(menuSet).map((menu) => JSON.parse(menu));
      const previousMenus = await this.menuService.findAll({
        date: new Date(date),
      });

      const createMenus = menus.filter(
        (menu) => !previousMenus.find((m) => isSameMenu(m, menu)),
      );
      for (const menu of createMenus) {
        await this.menuService.createMenu(menu);
      }

      const updateMenus = previousMenus.filter((menu) =>
        menus.find((m) => isSameMenu(m, menu)),
      );
      for (const menu of updateMenus) {
        await this.menuService.updateMenu(menu, {
          ...menus.find((m) => isSameMenu(m, menu)),
        });
      }

      const deleteMenus = previousMenus.filter(
        (menu) => !menus.find((m) => isSameMenu(m, menu)),
      );
      for (const menu of deleteMenus) {
        await this.menuService.deleteMenuByNameAndDate(
          menu.name,
          new Date(menu.date).toString(),
        );
      }
    }
  }
}
