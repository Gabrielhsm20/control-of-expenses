import { Type } from 'class-transformer';
import {
  IsDate,
  IsNumber,
  IsPositive,
  IsString,
  MaxDate,
  MaxLength,
  Validate,
} from 'class-validator';
import { UserExistsValidator } from 'src/user/decorators/user-exists-validator.decorator';

export class CreateExpenseDto {
  @IsNumber()
  @Validate(UserExistsValidator)
  id_user: number;

  @IsString()
  @MaxLength(191)
  description: string;

  @IsNumber()
  @IsPositive()
  value: number;

  @IsDate()
  @Type(() => Date)
  @MaxDate(new Date())
  date: Date;
}
