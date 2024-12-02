import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormConfig } from './database/typeorm.config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { MenuModule } from './menus/menu.module';
import { UserModule } from './users/user.module';
import { UserMenusModule } from './user-menus/user-menus.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeormConfig,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    MenuModule,
    UserModule,
    UserMenusModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
