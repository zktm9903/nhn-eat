import { Controller, Get, Query, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';

@Controller({ version: '1', path: '/user' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/signup')
  async signup(@Res({ passthrough: true }) response: Response) {
    const user = await this.userService.signUp();
    response.cookie('nhn-eat-uid', user.userId);
    return 'success';
  }
}
