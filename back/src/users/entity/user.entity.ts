import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BaseEntity,
} from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string; // UUID로 된 유저 ID

  @CreateDateColumn()
  createdAt: Date; // 생성 날짜, 자동 설정

  @Column({ default: false })
  isBanned: boolean; // 유저가 밴되었는지 여부
}
