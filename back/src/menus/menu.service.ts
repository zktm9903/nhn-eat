import { Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { Menu } from './entity/menu.entity';
import { DataSource } from 'typeorm';
import { MenuStats } from './entity/menu-stats.entity';
import { UserMenusService } from 'src/user-menus/user-menus.service';
import { UserService } from 'src/users/user.service';

type MenuWithUserStatus = Menu & {
  user?: {
    id: number;
    liked: boolean;
    disliked: boolean;
    selected: boolean;
  };
};

@Injectable()
export class MenuService {
  constructor(
    private dataSource: DataSource,
    private readonly userMenusService: UserMenusService,
    private readonly userService: UserService,
  ) {}

  async getTodayMenus(uid): Promise<MenuWithUserStatus[]> {
    const MenuRepository = this.dataSource.getRepository(Menu);
    const menus = (await MenuRepository.find({
      where: {
        date: new Date(),
      },
      relations: {
        stats: true,
      },
    })) as MenuWithUserStatus[];

    const user = await this.userService.findOne(uid);

    for (const menu of menus) {
      const userMenu = await this.userMenusService.getUserMenu(user, menu);
      menu.user = {
        id: userMenu.id,
        liked: userMenu.liked,
        disliked: userMenu.disliked,
        selected: userMenu.selected,
      };
    }

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
}
