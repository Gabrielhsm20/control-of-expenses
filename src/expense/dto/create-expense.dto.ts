import { Type } from 'class-transformer';
import {
  IsDate,
  IsNumber,
  IsPositive,
  IsString,
  MaxDate,
} from 'class-validator';

export class CreateExpenseDto {
  @IsNumber()
  id_user: number;

  @IsString()
  description: string;

  @IsNumber()
  @IsPositive()
  value: number;

  @IsDate()
  @Type(() => Date)
  @MaxDate(new Date())
  date: Date;
}
