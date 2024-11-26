import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormConfig } from './database/typeorm.config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { MenuModule } from './menus/menu.module';
import { UserModule } from './users/user.module';
import { UserMenusModule } from './user-menus/user-menus.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeormConfig, // TODO: typeorm 설정한 클래스
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
    MenuModule,
    UserModule,
    UserMenusModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
