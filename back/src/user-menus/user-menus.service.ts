import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserMenu } from './entity/user-menus.entity';
import { Menu } from 'src/menus/entity/menu.entity';
import { User } from 'src/users/entity/user.entity';

@Injectable()
export class UserMenusService {
  constructor(private dataSource: DataSource) {}

  async getUserMenu(user: User, menu: Menu) {
    const userMenuRepository = this.dataSource.getRepository(UserMenu);
    const userMenu = await userMenuRepository.findOne({
      relations: {
        menu: true,
        user: true,
      },
      where: {
        menu: { id: menu.id },
        user: { id: user.id },
      },
    });

    if (userMenu) return userMenu;

    const newtest = new UserMenu();
    newtest.user = user;
    newtest.menu = menu;
    await userMenuRepository.save(newtest);
    return newtest;
  }
}
