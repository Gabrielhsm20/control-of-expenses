import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UserService } from 'src/user/user.service';

@ValidatorConstraint({ name: 'UserExists', async: true })
@Injectable()
export class UserExistsValidator implements ValidatorConstraintInterface {
  constructor(private readonly userService: UserService) {}

  async validate(value: number) {
    try {
      const result = await this.userService.findOne(value);
      if (!result) return false;
    } catch (e) {
      return false;
    }

    return true;
  }

  defaultMessage() {
    return `user doesn't exist`;
  }
}
