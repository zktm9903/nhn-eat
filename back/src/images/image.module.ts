import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { UserService } from 'src/users/user.service';

@Module({
  controllers: [ImageController],
  providers: [ImageService, UserService],
})
export class ImageModule {}
