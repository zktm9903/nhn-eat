import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  async signUp() {
    try {
      // 새로운 User 생성
      const user = User.create();

      // User 저장
      await user.save();

      return user; // 성공적으로 생성된 User 반환
    } catch (error) {
      // 에러 로깅 (선택 사항)
      console.error('Error during user sign-up:', error);

      // NestJS의 예외 처리 시스템을 활용해 에러 반환
      throw new InternalServerErrorException('Failed to create user.');
    }
  }

  async findOne(userId: string): Promise<User> {
    try {
      // TypeORM의 findOne 메서드 사용
      const user = await User.findOneBy({ userId });

      // 사용자가 없는 경우 예외 처리
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found.`);
      }

      return user;
    } catch (error) {
      // 에러 로깅
      console.error('Error during user retrieval:', error);

      // 에러 반환
      throw new InternalServerErrorException('Failed to retrieve user.');
    }
  }
}
