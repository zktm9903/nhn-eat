import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

@Controller({ version: '1', path: '/auth' })
export class AuthController {
  @Get('/test')
  @UseGuards(AuthGuard)
  test() {
    return 'test';
  }
}
