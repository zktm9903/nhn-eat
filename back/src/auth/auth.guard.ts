import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/users/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const uid = request.cookies['nhn-eat-uid'];
    if (!uid) {
      throw new UnauthorizedException();
    }
    try {
      await this.userService.findOne(uid);
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
