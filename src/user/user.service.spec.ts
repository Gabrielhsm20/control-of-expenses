import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

const userEntityList: UserEntity[] = [
  new UserEntity({ id: 1, name: 'Gabriel', email: 'gabriel@test.com' }),
  new UserEntity({ id: 2, name: 'Henrique', email: 'henrique@test.com' }),
];

const newUserEntity = new UserEntity({ name: 'Emanuelle' });

const updatedUserEntity = new UserEntity({
  name: 'Gabriella',
  email: 'gabriella@test.com',
});

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            users: {
              create: jest.fn().mockResolvedValue(newUserEntity),
              findMany: jest.fn().mockResolvedValue(userEntityList),
              findFirst: jest.fn().mockResolvedValue(userEntityList[0]),
              update: jest.fn().mockResolvedValue(updatedUserEntity),
              delete: jest.fn().mockResolvedValue(undefined),
            },
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('create', () => {
    const data: CreateUserDto = {
      name: 'Emanuelle',
      email: 'emanuelle@test.com',
      password: 'Manu@123',
    };

    it('should successfully create a new user', async () => {
      const result = await userService.create(data);

      expect(result).toEqual(newUserEntity);
      expect(prismaService.users.create).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', () => {
      jest
        .spyOn(prismaService.users, 'create')
        .mockRejectedValueOnce(new Error());

      expect(prismaService.users.create({ data })).rejects.toThrowError();
    });
  });

  describe('findAll', () => {
    it('should return the list of users', async () => {
      const result = await userService.findAll();

      expect(result).toEqual(userEntityList);
      expect(prismaService.users.findMany).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', () => {
      jest
        .spyOn(prismaService.users, 'findMany')
        .mockRejectedValueOnce(new Error());

      expect(userService.findAll()).rejects.toThrowError();
    });
  });

  describe('findOne', () => {
    it('should successfully get a user', async () => {
      const result = await prismaService.users.findFirst({ where: { id: 1 } });

      expect(result).toEqual(userEntityList[0]);
      expect(prismaService.users.findFirst).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', () => {
      jest
        .spyOn(prismaService.users, 'findFirst')
        .mockRejectedValueOnce(new Error());

      expect(
        prismaService.users.findFirst({ where: { id: 1 } }),
      ).rejects.toThrowError();
    });
  });

  describe('update', () => {
    const data: UpdateUserDto = {
      name: 'Christine',
    };

    it('should successfully update a user', async () => {
      jest
        .spyOn(prismaService.users, 'update')
        .mockResolvedValueOnce(updatedUserEntity);

      const result = await prismaService.users.update({
        where: { id: 1 },
        data,
      });

      expect(result).toEqual(updatedUserEntity);
    });

    it('should throw an exception', () => {
      // Arrange
      jest
        .spyOn(prismaService.users, 'update')
        .mockRejectedValueOnce(new Error());

      expect(
        prismaService.users.update({
          where: { id: 1 },
          data,
        }),
      ).rejects.toThrowError();
    });
  });

  describe('remove', () => {
    it('should successfully remove a user', async () => {
      const result = await prismaService.users.delete({ where: { id: 1 } });

      expect(result).toBeUndefined();
      expect(prismaService.users.delete).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', () => {
      jest
        .spyOn(prismaService.users, 'delete')
        .mockRejectedValueOnce(new Error());

      expect(
        prismaService.users.delete({ where: { id: 1 } }),
      ).rejects.toThrowError();
    });
  });
});
