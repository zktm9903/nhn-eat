import { Module } from '@nestjs/common';
import { UserMenusController } from './user-menus.controller';
import { UserMenusService } from './user-menus.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserMenu } from './entity/user-menus.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserMenu])],
  controllers: [UserMenusController],
  providers: [UserMenusService],
})
export class UserMenusModule {}
