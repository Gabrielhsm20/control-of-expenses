import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UserService } from '../user.service';

@ValidatorConstraint({ name: 'UserNotExists', async: true })
@Injectable()
export class UserNotExistsValidator implements ValidatorConstraintInterface {
  constructor(private readonly userService: UserService) {}

  async validate(value: number | string, args: any) {
    console.log(args);
    try {
      const result =
        typeof value === 'number'
          ? await this.userService.findOne(value)
          : await this.userService.findByEmail(value);
      if (!result) return true;
    } catch (e) {
      return true;
    }

    return false;
  }

  defaultMessage() {
    return `User already exist`;
  }
}
