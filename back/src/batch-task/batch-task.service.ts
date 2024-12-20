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
      await this.batchCrawling();
    }, 3000);
  }

  @Cron('0 0-10 * * 1-5', {
    timeZone: 'Asia/Seoul',
  })
  async nightJob() {
    await this.batchCrawling();
  }

  @Cron('*/3 10-13 * * 1-5', {
    timeZone: 'Asia/Seoul',
  })
  async lunchJob() {
    await this.batchCrawling();
  }

  @Cron('*/3 17-18 * * 1-5', {
    timeZone: 'Asia/Seoul',
  })
  async dinnerJob() {
    await this.batchCrawling();
  }

  async batchCrawling() {
    const lunch = await this.menuService.getTodayMenus(MealType.LUNCH);
    const dinner = await this.menuService.getTodayMenus(MealType.DINNER);
    const menus = [...lunch, ...dinner];

    if (menus.length && menus.every((menu) => menu.imageUrl)) {
      this.logger.debug(
        '메뉴가 이미 적재되어 있고, 모든 메뉴의 이미지가 적재되어 있습니다.',
      );
      return;
    }
    this.logger.debug(
      '메뉴가 적재되어 있지 않거나, 특정 메뉴의 이미지가 적재되어 있지 않습니다. 크롤링을 시작합니다.',
    );

    const crawlingMenus = await this.crawlingService.scrape();
    // const crawlingMenus = [
    //   {
    //     name: '치즈부대전골1&라면사리',
    //     description: '잡곡밥, 계란말이, 브로콜리두부무침, 오이생채',
    //     calories: 1096,
    //     mealType: MealType.LUNCH,
    //     date: new Date(),
    //     imageUrl:
    //       'http://image.toast.com/aaaaac/shopmenu/202412/menu_29_20241211182433667.jpg?750x500',
    //   },
    //   {
    //     name: '치즈부대전골2&라면사리',
    //     description: '잡곡밥, 계란말이, 브로콜리두부무침, 오이생채',
    //     calories: 1096,
    //     mealType: MealType.LUNCH,
    //     date: new Date(),
    //     imageUrl:
    //       'http://image.toast.com/aaaaac/shopmenu/202412/menu_29_20241211182433667.jpg?750x500',
    //   },
    //   {
    //     name: '치즈부대전골3&라면사리',
    //     description: '잡곡밥, 계란말이, 브로콜리두부무침, 오이생채',
    //     calories: 1096,
    //     mealType: MealType.LUNCH,
    //     date: new Date(),
    //     imageUrl:
    //       'http://image.toast.com/aaaaac/shopmenu/202412/menu_29_20241211182433667.jpg?750x500',
    //   },
    //   {
    //     name: '치즈부대전골4&라면사리',
    //     description: '잡곡밥, 계란말이, 브로콜리두부무침, 오이생채',
    //     calories: 1096,
    //     mealType: MealType.LUNCH,
    //     date: new Date(),
    //     imageUrl:
    //       'http://image.toast.com/aaaaac/shopmenu/202412/menu_29_20241211182433667.jpg?750x500',
    //   },
    // ] as Menu[];
    this.logger.debug('크롤링한 메뉴들 :', crawlingMenus);

    for (const menu of crawlingMenus) {
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
        });
        continue;
      }
      this.logger.debug('존재하지 않는 메뉴 :', menu.name);
      await this.menuService.createMenu(menu);
    }

    this.logger.debug('메뉴를 업데이트 하였습니다.');

    return 'success';
  }
}
