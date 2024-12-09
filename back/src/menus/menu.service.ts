import { Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { Menu } from './entity/menu.entity';
import { DataSource } from 'typeorm';
import { MenuStats } from './entity/menu-stats.entity';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class MenuService {
  constructor(private dataSource: DataSource) {}

  async getTodayMenus(): Promise<Menu[]> {
    const MenuRepository = this.dataSource.getRepository(Menu);
    const menus = await MenuRepository.find({
      where: {
        date: new Date(),
      },
      relations: {
        stats: true,
      },
      order: {
        id: 'ASC',
      },
    });

    return menus;
  }

  async createMenu(createMenuDto: CreateMenuDto): Promise<Menu> {
    const {
      name,
      description,
      calories,
      mealType,
      imageUrl,
      isLunchBox,
      date,
    } = createMenuDto;

    const MenuRepository = this.dataSource.getRepository(Menu);
    const MenuStatsRepository = this.dataSource.getRepository(MenuStats);

    const menuStats = new MenuStats();

    const menu = new Menu();
    menu.name = name;
    menu.description = description;
    menu.calories = calories;
    menu.mealType = mealType;
    menu.imageUrl = imageUrl;
    menu.isLunchBox = isLunchBox;
    menu.date = date;
    menu.stats = menuStats;

    await MenuStatsRepository.save(menuStats);
    await MenuRepository.save(menu);

    return menu;
  }

  async deleteMenuByDate(date: string) {
    const menuRepository = this.dataSource.getRepository(Menu);
    console.log(new Date(date));
    const result = await menuRepository.delete({ date: new Date(date) });
    return result.affected ? true : false;
  }

  async crawlingVelog(date: string) {
    const html = await axios.get(`${process.env.VELOG_URL}/${date}`);
    const $ = cheerio.load(html.data);
    const atomOneDiv = $('.atom-one');
    const targetTag = atomOneDiv
      .find('p')
      .filter((i, el) => $(el).text().includes('메뉴 갯수'));

    const menuCount = parseInt(targetTag.text().trim().match(/\d+$/)?.[0]);

    const menus = [];

    for (let i = 1; i <= menuCount; i++) {
      menus.push({
        name: atomOneDiv
          .find('p')
          .filter((_, el) => $(el).text().includes(`메뉴${i} 이름`))
          .text()
          .split('\n')[1],
        mealType: atomOneDiv
          .find('p')
          .filter((_, el) => $(el).text().includes(`메뉴${i} 언제`))
          .text()
          .split('\n')[1],
        description: atomOneDiv
          .find('p')
          .filter((_, el) => $(el).text().includes(`메뉴${i} 디테일`))
          .text()
          .split('\n')[1],
        calories: atomOneDiv
          .find('p')
          .filter((_, el) => $(el).text().includes(`메뉴${i} 칼로리`))
          .text()
          .split('\n')[1],
        imageUrl:
          atomOneDiv
            .find('p')
            .filter((_, el) => $(el).text().includes(`메뉴${i} 이미지`))
            .html()
            .split('\n')
            .at(-1)
            ?.split('"')[1] ?? null,
        isLunchBox:
          atomOneDiv
            .find('p')
            .filter((_, el) => $(el).text().includes(`메뉴${i} 도시락`))
            .text()
            .split('\n')[1] === 'true',
        date: date,
      });
    }

    return menus;
  }
}
