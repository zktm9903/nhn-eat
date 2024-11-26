import { IsOptional, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsBoolean()
  isBanned?: boolean = false; // 기본값으로 false
}
