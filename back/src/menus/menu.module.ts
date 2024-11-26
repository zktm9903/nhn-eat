import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from './entity/menu.entity';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserService } from 'src/users/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Menu])],
  controllers: [MenuController],
  providers: [
    MenuService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    UserService,
  ],
})
export class MenuModule {}
