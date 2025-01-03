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

    if (request.headers['admin-token'] === process.env.ADMIN_TOKEN) return true;

    const uid = request.headers['authorization'];
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
