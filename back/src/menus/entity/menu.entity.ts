import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MealType } from '../enum/meal-type.enum';
import { MenuStats } from './menu-stats.entity';

@Entity()
export class Menu extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255 })
  name: string;

  @Column('text')
  description: string;

  @Column('int')
  calories: number;

  @Column({
    type: 'enum',
    enum: MealType,
    default: MealType.LUNCH,
  })
  mealType: MealType;

  @Column('text', { nullable: true })
  imageUrl: string;

  @Column({ type: 'boolean', default: false })
  isLunchBox: boolean;

  @Column({ type: 'date' })
  date: Date;

  @OneToOne(() => MenuStats)
  @JoinColumn()
  stats: MenuStats;
}
