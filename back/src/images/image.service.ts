import { Injectable } from '@nestjs/common';
import { ImageType } from './enum/image-type.enum';

@Injectable()
export class ImageService {
  async getRandomImages(type: ImageType) {
    const response = await fetch(
      `https://tenor.googleapis.com/v2/search?q=${type}&key=${process.env.TENOR_API_KEY}&client_key=nm-eat&limit=40&random=true&media_filter=webp`
    );
    const data = await response.json();
    return data.results.map((result) => result.media_formats.webp.url);
  }
}
