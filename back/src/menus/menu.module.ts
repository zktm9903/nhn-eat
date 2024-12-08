import { Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from './entity/menu.entity';
import { UserMenusService } from 'src/user-menus/user-menus.service';
import { UserService } from 'src/users/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Menu])],
  controllers: [MenuController],
  providers: [MenuService, UserService, UserMenusService],
})
export class MenuModule {}
