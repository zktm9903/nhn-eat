import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { MealType } from '../enum/meal-type.enum';
import { MenuStats } from './menu-stats.entity';

@Entity()
export class Menu extends BaseEntity {
  @PrimaryGeneratedColumn()
  menuId: number;

  @Column('varchar', { length: 255 })
  name: string;

  @Column('text')
  description: string;

  @Column('int')
  calories: number;

  @Column({
    type: 'enum',
    enum: MealType,
    default: MealType.LUNCH, // 기본값 설정
  })
  mealType: MealType;

  @Column('text', { nullable: true })
  imageUrl: string;

  @OneToOne(() => MenuStats, (menuStats) => menuStats.menu, { cascade: true })
  @JoinColumn({ name: 'menuId' })
  stats: MenuStats;
}
