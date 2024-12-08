import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserMenu } from './entity/user-menus.entity';
import { Menu } from 'src/menus/entity/menu.entity';
import { User } from 'src/users/entity/user.entity';
import { MenuStats } from 'src/menus/entity/menu-stats.entity';

@Injectable()
export class UserMenusService {
  constructor(private dataSource: DataSource) {}

  async getUserMenu(uid: User['id'], menuId: Menu['id']) {
    const userMenuRepository = this.dataSource.getRepository(UserMenu);
    const userMenu = await userMenuRepository.findOne({
      where: {
        menu: { id: menuId },
        user: { id: uid },
      },
    });
    return userMenu;
  }

  async insertUserMenu(user: User, menu: Menu) {
    const userMenuRepository = this.dataSource.getRepository(UserMenu);
    const newUserMenu = new UserMenu();
    newUserMenu.user = user;
    newUserMenu.menu = menu;
    await userMenuRepository.save(newUserMenu);
    return newUserMenu;
  }

  async updateUserMenu(userMenu: UserMenu, content: Pick<UserMenu, 'liked'>) {
    const userMenuRepository = this.dataSource.getRepository(UserMenu);

    await userMenuRepository.update({ id: userMenu.id }, { ...content });
    return userMenu;
  }

  async likeMenu(userMenu: UserMenu, menuId: number, liked: UserMenu['liked']) {
    const MenuRepository = this.dataSource.getRepository(Menu);

    await this.dataSource.transaction(async (manager) => {
      await manager.save(UserMenu, { ...userMenu, liked: liked });
      const menu = await MenuRepository.findOne({
        relations: {
          stats: true,
        },
        where: { id: menuId },
      });
      await manager.increment(
        MenuStats,
        { id: menu.stats.id },
        'liked',
        liked ? 1 : -1,
      );
    });
    return 'success';
  }
}
