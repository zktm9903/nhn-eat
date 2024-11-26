import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from 'src/menus/entity/menu.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Menu])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
