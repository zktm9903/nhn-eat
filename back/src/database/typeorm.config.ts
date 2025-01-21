import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TypeormConfig implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
      dropSchema: process.env.DATABASE_DROPSCHEMA === 'true',
      keepConnectionAlive: true,
      logging: true,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      timezone: 'Asia/Seoul',
      extra: {
        max: parseInt(process.env.DATABASE_MAX_CONNECTION) || 100,
      },
    } as TypeOrmModuleOptions;
  }
}
