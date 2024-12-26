import { Injectable, Logger } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { Menu } from './entity/menu.entity';
import { DataSource, FindOptionsWhere } from 'typeorm';
import { MenuStats } from './entity/menu-stats.entity';
import { MealType } from './enum/meal-type.enum';

@Injectable()
export class MenuService {
  constructor(private dataSource: DataSource) {}
  private readonly logger = new Logger(MenuService.name);

  async getMenus(mealType: MealType, date: string): Promise<Menu[]> {
    const MenuRepository = this.dataSource.getRepository(Menu);
    const menus = await MenuRepository.find({
      where: {
        mealType: mealType,
        date: new Date(date),
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

  async getAvailableDates(): Promise<string[]> {
    const MenuRepository = this.dataSource.getRepository(Menu);

    const result = await MenuRepository.createQueryBuilder('menu')
      .select('DISTINCT menu.date', 'date')
      .orderBy('menu.date', 'ASC')
      .getRawMany();

    const availableDates = result.map((row) => {
      const date = new Date(row.date);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    });

    return availableDates;
  }

  async findOne(where: FindOptionsWhere<Menu> | FindOptionsWhere<Menu>[]) {
    const MenuRepository = this.dataSource.getRepository(Menu);
    const menus = await MenuRepository.findOneBy(where);

    return menus;
  }

  // async getStatsByNameAndDate(name: string, date: Date) {
  //   const menuRepository = this.dataSource.getRepository(Menu);
  //   const menu = await menuRepository.findOne({
  //     relations: {
  //       stats: true,
  //     },
  //     where: {
  //       name: name,
  //       date: date,
  //     },
  //   });
  //   return menu?.stats || undefined;
  // }

  async createMenu(
    createMenuDto: CreateMenuDto,
    stats?: MenuStats,
  ): Promise<Menu> {
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

    const menu = new Menu();
    menu.name = name;
    menu.description = description;
    menu.calories = calories;
    menu.mealType = mealType;
    menu.imageUrl = imageUrl;
    menu.isLunchBox = isLunchBox;
    menu.date = date;

    if (stats) {
      menu.stats = stats;
      this.logger.debug('이미 스탯이 있습니다.');
    } else {
      menu.stats = new MenuStats();
      this.logger.debug('스탯을 생성합니다.');
    }

    await MenuStatsRepository.save(menu.stats);
    await MenuRepository.save(menu);

    return menu;
  }

  async updateMenu(
    menu: Menu,
    updateMenuDto: Partial<CreateMenuDto>,
  ): Promise<Menu> {
    const {
      name,
      description,
      calories,
      mealType,
      imageUrl,
      isLunchBox,
      date,
    } = updateMenuDto;

    const MenuRepository = this.dataSource.getRepository(Menu);

    if (name !== undefined) menu.name = name;
    if (description !== undefined) menu.description = description;
    if (calories !== undefined) menu.calories = calories;
    if (mealType !== undefined) menu.mealType = mealType;
    if (imageUrl !== undefined) menu.imageUrl = imageUrl;
    if (isLunchBox !== undefined) menu.isLunchBox = isLunchBox;
    if (date !== undefined) menu.date = date;

    await MenuRepository.save(menu);

    return menu;
  }

  async deleteMenuByDate(date: Date) {
    const menuRepository = this.dataSource.getRepository(Menu);
    const result = await menuRepository.delete({ date: date });
    return result.affected ? true : false;
  }

  async deleteMenuByNameAndDate(name: string, date: string) {
    const menuRepository = this.dataSource.getRepository(Menu);
    const result = await menuRepository.delete({
      name: name,
      date: new Date(date),
    });
    return result.affected ? true : false;
  }
}
