import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from 'src/menus/entity/menu.entity';
import { UserMenusController } from './user-menus.controller';
import { UserMenusService } from './user-menus.service';

@Module({
  imports: [TypeOrmModule.forFeature([Menu])],
  controllers: [UserMenusController],
  providers: [UserMenusService],
})
export class UserMenusModule {}
