import { Injectable } from '@nestjs/common';

export interface Menu {
  id: string;
  date: string;
  name: string;
  detail: string;
  kcal: number;
  previewImgSrc: string;
  eat: number;
  good: number;
  bad: number;
}

@Injectable()
export class AppService {
  getMenus(date: string): Menu[] {
    return [
      {
        id: '1',
        date: '2024/11/24',
        name: '첫번째 메뉴',
        detail: '첫번째 메뉴의 디테일',
        kcal: 500,
        previewImgSrc:
          'https://www.alleycat.org/wp-content/uploads/2019/03/FELV-cat.jpg',
        eat: 300,
        good: 100,
        bad: 50,
      },
      {
        id: '2',
        date: '2024/11/24',
        name: '첫번째 메뉴',
        detail: '첫번째 메뉴의 디테일',
        kcal: 500,
        previewImgSrc:
          'https://www.alleycat.org/wp-content/uploads/2019/03/FELV-cat.jpg',
        eat: 300,
        good: 100,
        bad: 50,
      },
      {
        id: '3',
        date: '2024/11/24',
        name: '첫번째 메뉴',
        detail: '첫번째 메뉴의 디테일',
        kcal: 500,
        previewImgSrc:
          'https://www.alleycat.org/wp-content/uploads/2019/03/FELV-cat.jpg',
        eat: 300,
        good: 100,
        bad: 50,
      },
    ];
  }
}
