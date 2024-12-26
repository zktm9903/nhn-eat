import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ImageType } from '../enum/image-type.enum';

@Entity()
export class Image extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ImageType,
    default: ImageType.CAT,
  })
  imageType: ImageType;

  @Column('text')
  imageUrl: string;
}
