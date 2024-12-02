import { IsBoolean, IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateUserMenuDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string; // 유저 ID

  @IsNotEmpty()
  menuId: number; // 메뉴 ID

  @IsBoolean()
  liked: boolean; // 좋아요 여부

  @IsBoolean()
  disliked: boolean; // 싫어요 여부

  @IsBoolean()
  selected: boolean; // 먹은 여부
}
