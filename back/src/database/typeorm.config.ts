import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TypeormConfig implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      url: '', // TODO: ex) postgresql://username:password@hostname:port/database
      host: process.env.DATABASE_HOST, // TODO: 데이터베이스 서버 호스트
      port: parseInt(process.env.DATABASE_PORT), // TODO: 데이터베이스 포트
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE, // TODO: 연결할 데이터베이스 이름
      synchronize: process.env.DATABASE_SYNCHRONIZE === 'true' || false, // TODO: 스키마 자동 동기화 (production에서는 false)
      dropSchema: process.env.DATABASE_DROPSCHEMA === 'true' || false, // TODO: 애플리케이션 실행시 기존 스키마 삭제 여부
      keepConnectionAlive: true, // TODO: 애플리케이션 재시작 시 연결 유지
      logging: true, // TODO: 데이터베이스 쿼리 로깅 여부
      entities: [__dirname + '/../**/*.entity{.ts,.js}'], //TODO: 중요! 엔티티 클래스 경로
      extra: {
        max: process.env.DATABASE_MAX_CONNECTION === 'true' || false,
      },
    } as TypeOrmModuleOptions;
  }
}
