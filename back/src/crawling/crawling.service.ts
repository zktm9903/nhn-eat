import { Injectable } from '@nestjs/common';
import { chromium } from 'playwright';
import { MealType } from 'src/menus/enum/meal-type.enum';

@Injectable()
export class CrawlingService {
  async scrape() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://menu.payco.com/mrc/818490', {
      waitUntil: 'domcontentloaded',
    });

    const menus = await page.$$eval('.list_menu > li', (elements) => {
      return elements.map((element) => {
        const name = element.querySelector('.menu_title')?.textContent?.trim();
        const mealType = element
          .querySelector('.menu_category')
          ?.textContent?.trim();
        const imageUrl = element
          .querySelector('.menu_img_box img')
          ?.getAttribute('src');
        const description = element
          .querySelector('.menu_desc')
          .textContent?.trim();
        const calories =
          element.querySelector('.menu_cal')?.textContent?.trim() || '0';

        return {
          name,
          mealType,
          imageUrl: imageUrl ?? null,
          description,
          calories,
        };
      });
    });

    const noLunchBoxMenus = menus
      //도시락 제외
      .filter((menu) => !menu.mealType.includes('도시락/건강식'))
      //데이터 정리
      .map((menu) => ({
        ...menu,
        mealType:
          menu.mealType.split('\n')[0] === '중식'
            ? MealType.LUNCH
            : MealType.DINNER,
        description: menu.description.replaceAll('\n', ', '),
        calories: parseInt(menu.calories.replace(' Kcal', '').replace(',', '')),
        date: new Date(),
      }))
      //중복 제거
      .filter(
        (menu, index, self) =>
          index === self.findIndex((t) => t.name === menu.name),
      );

    await page.close();
    await browser.close();
    return noLunchBoxMenus;
  }
}
