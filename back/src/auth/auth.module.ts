import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/users/user.module';
import { UserService } from 'src/users/user.service';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, UserService],
})
export class AuthModule {}
