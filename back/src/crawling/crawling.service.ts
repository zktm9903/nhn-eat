import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { CreateMenuDto } from 'src/menus/dto/create-menu.dto';
import { Menu } from 'src/menus/entity/menu.entity';
import { MealType } from 'src/menus/enum/meal-type.enum';

@Injectable()
export class CrawlingService {
  async getPossibleDates() {
    const url = 'https://menu.payco.com/mrc/818490';
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const dates = [];
    $('.option.btnSelSvcYmd').each((_, element) => {
      const date = $(element).text().trim();
      dates.push(date);
    });

    return dates;
  }

  async getMenus(date: string) {
    const { data } = await axios.get(
      `https://menu.payco.com/service/shopMenu/menuList.nhn?shopMenuCfgSeq=29&serviceYmd=${date.replaceAll('-', '')}`,
    );
    const $ = cheerio.load(data);
    const menus: CreateMenuDto[] = [];

    $('.list_menu .item_menu').each((_, element) => {
      const name = $(element).find('.menu_title').text().trim();
      const descriptionHtml =
        $(element).find('.menu_desc').html()?.trim() || '';

      const description = descriptionHtml
        .replaceAll('\n', '')
        .replaceAll(/&amp;/g, '&')
        .split('<br>')
        .slice(0, -2)
        .join(', ');
      const caloriesText = $(element).find('.menu_cal').text().trim();
      const calories =
        parseInt(caloriesText.replace(/[^0-9]/g, ''), 10) || null; // 칼로리가 없으면 null

      const category = $(element).find('.menu_category').text().trim();
      const imageUrl = $(element).find('.menu_img_box img').attr('src') || null; // 이미지 URL이 없으면 null

      // MealType 결정
      let mealType: MealType;
      if (category.includes('중식')) {
        mealType = MealType.LUNCH;
      } else if (category.includes('석식')) {
        mealType = MealType.DINNER;
      } else {
        mealType = MealType.LUNCH; // 기본값
      }

      // 도시락 여부 확인
      const isLunchBox = category.includes('도시락');

      // Menu 객체 생성
      const menu: CreateMenuDto = {
        name,
        description: isLunchBox ? '' : description,
        calories,
        mealType,
        imageUrl,
        isLunchBox,
        date: new Date(date), // 날짜 고정 (변경 가능)
      };

      menus.push(menu);
    });

    console.log(
      'menus',
      menus.filter(
        (item, index, self) =>
          self.findIndex((t) => t.name === item.name) === index,
      ),
    );

    return menus;
  }
}
