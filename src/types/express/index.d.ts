import { UserEntity } from 'src/user/entities/user.entity';

declare module 'express' {
  export interface Request {
    user?: UserEntity;
  }
}
