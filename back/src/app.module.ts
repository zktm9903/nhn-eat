import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormConfig } from './database/typeorm.config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { MenuModule } from './menus/menu.module';
import { UserModule } from './users/user.module';
import { UserMenusModule } from './user-menus/user-menus.module';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CrawlingModule } from './crawling/crawling.module';
import { BatchTaskModule } from './batch-task/batch-task.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ImageModule } from './images/image.module';

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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../static'),
    }),
    ScheduleModule.forRoot(),
    BatchTaskModule,
    MenuModule,
    UserModule,
    UserMenusModule,
    CrawlingModule,
    BatchTaskModule,
    ImageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
