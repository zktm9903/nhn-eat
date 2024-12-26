import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { ImageService } from './image.service';
import { ImageType } from './enum/image-type.enum';
import { Request } from 'express';

@Controller({ version: '1', path: '/images' })
@UseGuards(AuthGuard)
export class ImageController {
  constructor(private readonly imagesService: ImageService) {}

  @Get('')
  async getImages(@Req() request: Request) {
    const imageType = request.query['type'] as ImageType;
    const images = await this.imagesService.find(imageType);

    return images.map((image) => image.imageUrl);
  }
}
