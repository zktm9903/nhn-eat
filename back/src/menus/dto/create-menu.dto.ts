import {
  IsNotEmpty,
  IsEnum,
  IsInt,
  IsOptional,
  IsUrl,
  IsBoolean,
  Min,
} from 'class-validator';
import { MealType } from '../enum/meal-type.enum';

export class CreateMenuDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsInt()
  @Min(0)
  calories: number;

  @IsEnum(MealType)
  mealType: MealType;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  isLunchBox?: boolean;

  @IsNotEmpty()
  date: Date;
}
