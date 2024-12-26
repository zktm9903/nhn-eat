import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CrawlingService } from 'src/crawling/crawling.service';
import { MealType } from 'src/menus/enum/meal-type.enum';
import { MenuService } from 'src/menus/menu.service';

@Injectable()
export class BatchTaskService implements OnModuleInit {
  constructor(
    private crawlingService: CrawlingService,
    private menuService: MenuService,
  ) {}

  private readonly logger = new Logger(BatchTaskService.name);

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
    this.logger.debug('파싱 가능할 날짜들: ', dates);

    for (const date of dates) {
      const menus = await this.crawlingService.getMenus(date);

      for (const menu of menus) {
        const alreadyMenu = await this.menuService.findOne({
          name: menu.name,
          date: menu.date,
        });
        if (alreadyMenu) {
          this.logger.debug('이미 존재하는 메뉴 :', menu.name);
          await this.menuService.updateMenu(alreadyMenu, {
            description: menu.description,
            calories: menu.calories,
            mealType: menu.mealType,
            imageUrl: menu.imageUrl,
            isLunchBox: menu.isLunchBox,
          });
          continue;
        }
        this.logger.debug('존재하지 않는 메뉴 :', menu.name);
        await this.menuService.createMenu(menu);
      }
    }
  }
}
