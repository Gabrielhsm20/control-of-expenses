import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UserService } from '../user.service';

@ValidatorConstraint({ name: 'UserExists', async: true })
@Injectable()
export class UserExistsValidator implements ValidatorConstraintInterface {
  constructor(private readonly userService: UserService) {}

  async validate(value: number | string, args: any) {
    try {
      const result =
        typeof value === 'number'
          ? await this.userService.findOne(value)
          : await this.userService.findByEmail(value);
      if (!result) return false;
    } catch (e) {
      return false;
    }

    return true;
  }

  defaultMessage() {
    return `User not exist`;
  }
}
