import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from '../menus/entity/menu.entity';

// @Module({
//   imports: [],
//   providers: [SeederService],
//   exports: [SeederService],
// })
export class SeederModule {}
