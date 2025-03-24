import { Injectable } from '@nestjs/common';
import { ImageType } from './enum/image-type.enum';

@Injectable()
export class ImageService {
  async getRandomImages(type: ImageType) {
    // const response = await fetch(
    //   `https://tenor.googleapis.com/v2/search?q=${type}&key=${process.env.TENOR_API_KEY}&client_key=nm-eat&limit=40&random=true&media_filter=webp`,
    // );
    // const data = await response.json();
    // return data.results.map((result) => result.media_formats.webp.url);

    if (type === ImageType.CAT) {
      return [
        'https://i.giphy.com/lJNoBCvQYp7nq.webp',
        'https://i.giphy.com/MDJ9IbxxvDUQM.webp',
        'https://i.giphy.com/zZMTVkTeEfeEg.webp',
        'https://i.giphy.com/GeimqsH0TLDt4tScGw.webp',
        'https://i.giphy.com/nR4L10XlJcSeQ.webp',
        'https://i.giphy.com/yFQ0ywscgobJK.webp',
      ];
    }

    if (type === ImageType.DOG) {
      return [
        'https://i.giphy.com/gfl7CKcgs6exW.webp',
        'https://i.giphy.com/kiBcwEXegBTACmVOnE.webp',
        'https://i.giphy.com/TJxrHj7AurjqljHSv2.webp',
        'https://i.giphy.com/9s8Jq3Sc1ZnZS.webp',
        'https://i.giphy.com/4MixZy6L7nBW8.webp',
        'https://i.giphy.com/LInA5UAAIWMIE.webp',
      ];
    }

    if (type === ImageType.CAPYBARA) {
      return [
        'https://i.giphy.com/AQpUsaKCRD9gA.webp',
        'https://i.giphy.com/l4Ki01RIvdIQVFhqE.webp',
        'https://i.giphy.com/VCma6o7KQ4H4Y.webp',
        'https://i.giphy.com/2WdGnOk4slkyIo6DUW.webp',
        'https://i.giphy.com/hbB8efOHAezRK.webp',
        'https://i.giphy.com/MET6PM2XeYabe.webp',
      ];
    }

    if (type === ImageType.HYRAX) {
      return [
        'https://i.giphy.com/87V4yI4D9vZKM.webp',
        'https://i.giphy.com/xT9IgpRMMLG7Akftv2.webp',
        'https://i.giphy.com/3o7aD8KjoQOPw6NwEU.webp',
        'https://i.giphy.com/3o7aD0VBiLojHZnnOg.webp',
        'https://i.giphy.com/3o7aDfDwGt9Ds2HitG.webp',
        'https://i.giphy.com/xT9IgNArIL9hlXVEGI.webp',
      ];
    }
  }
}
