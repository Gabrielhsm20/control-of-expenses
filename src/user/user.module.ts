import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserExistsValidator } from './decorators/user-exists-validator.decorator';
import { UserNotExistsValidator } from './decorators/user-not-exists-validator.decorator';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService, UserExistsValidator, UserNotExistsValidator],
  exports: [UserService, UserExistsValidator, UserNotExistsValidator],
})
export class UserModule {}
