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
      const user = User.create();
      await user.save();
      return user;
    } catch (error) {
      console.error('Error during user sign-up:', error);
      throw new InternalServerErrorException('Failed to create user.');
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const user = await User.findOneBy({ id });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found.`);
      }
      return user;
    } catch (error) {
      console.error('Error during user retrieval:', error);
      throw new InternalServerErrorException('Failed to retrieve user.');
    }
  }
}
