import { Injectable } from '@nestjs/common';
import { Menu } from '../menus/entity/menu.entity';
import { MealType } from '../menus/enum/meal-type.enum';
import { DataSource } from 'typeorm';

// @Injectable()
export class SeederService {
  //   constructor(private readonly dataSource: DataSource) {}
  //   async run() {
  //     // 트랜잭션 사용 (선택 사항)
  //     const queryRunner = this.dataSource.createQueryRunner();
  //     await queryRunner.connect();
  //     await queryRunner.startTransaction();
  //     try {
  //       // 예: 메뉴 데이터 추가
  //       const menuRepository = queryRunner.manager.getRepository(Menu);
  //       const menu1 = menuRepository.create({
  //         name: 'Spaghetti',
  //         description: 'Classic Italian pasta.',
  //         calories: 400,
  //         mealType: MealType.LUNCH,
  //         isLunchBox: false,
  //       });
  //       const menu2 = menuRepository.create({
  //         name: 'Chicken Bento',
  //         description: 'Healthy chicken lunch box.',
  //         calories: 600,
  //         mealType: MealType.LUNCH,
  //         isLunchBox: true,
  //       });
  //       await menuRepository.save([menu1, menu2]);
  //       // 트랜잭션 커밋
  //       await queryRunner.commitTransaction();
  //     } catch (error) {
  //       // 트랜잭션 롤백
  //       await queryRunner.rollbackTransaction();
  //       console.error('Error during seeding:', error);
  //     } finally {
  //       // 연결 해제
  //       await queryRunner.release();
  //     }
  //   }
}
