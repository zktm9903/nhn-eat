import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
} from 'typeorm';
import { Menu } from './menu.entity';

@Entity()
export class MenuStats extends BaseEntity {
  @PrimaryGeneratedColumn()
  statsId: number;

  @Column('int', { default: 0 })
  selectedCount: number;

  @Column('int', { default: 0 })
  likes: number;

  @Column('int', { default: 0 })
  dislikes: number;

  @OneToOne(() => Menu, (menu) => menu.stats)
  menu: Menu;
}
