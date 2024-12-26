import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ImageType } from './enum/image-type.enum';
import { Image } from './entity/image.entity';

@Injectable()
export class ImageService {
  constructor(private dataSource: DataSource) {}

  async find(type: ImageType) {
    console.log('000000', type);
    const imageRepository = this.dataSource.getRepository(Image);
    const images = await imageRepository.find({
      select: {
        imageUrl: true,
      },
      where: {
        imageType: type,
      },
    });

    console.log(images);

    return images;
  }
}
