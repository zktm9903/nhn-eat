import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  BaseEntity,
} from 'typeorm';
import { User } from '../../users/entity/user.entity';
import { Menu } from '../../menus/entity/menu.entity';

@Entity()
export class UserMenu extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => Menu, (menu) => menu.id)
  menu: Menu;

  @Column({ default: false })
  liked: boolean;

  @Column({ default: false })
  disliked: boolean;

  @Column({ default: false })
  selected: boolean;
}
