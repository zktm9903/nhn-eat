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

  @ManyToOne(() => User, (user) => user.userId, { eager: true })
  user: User; // 어떤 유저인지

  @ManyToOne(() => Menu, (menu) => menu.menuId, { eager: true })
  menu: Menu; // 어떤 메뉴인지

  @Column({ default: false })
  liked: boolean; // 좋아요 여부

  @Column({ default: false })
  disliked: boolean; // 싫어요 여부

  @Column({ default: false })
  hasEaten: boolean; // 먹은 여부
}
