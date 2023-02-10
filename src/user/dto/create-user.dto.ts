import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { UserNotExistsValidator } from '../decorators/user-not-exists-validator.decorator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  @Validate(UserNotExistsValidator)
  email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;
}
