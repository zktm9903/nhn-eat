import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MenuStats extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { default: 0 })
  liked: number;
}
