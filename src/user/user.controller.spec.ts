import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserController } from './user.controller';
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

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn().mockResolvedValue(newUserEntity),
            findAll: jest.fn().mockResolvedValue(userEntityList),
            findOne: jest.fn().mockResolvedValue(userEntityList[0]),
            update: jest.fn().mockResolvedValue(updatedUserEntity),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return the list of users', async () => {
      const result = await userController.findAll();

      expect(typeof result).toEqual('object');
      expect(result).toEqual(userEntityList);
      expect(userService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', () => {
      jest.spyOn(userService, 'findAll').mockRejectedValueOnce(new Error());
      expect(userController.findAll()).rejects.toThrowError();
    });
  });

  describe('create', () => {
    const body: CreateUserDto = {
      name: 'Emanuelle',
      email: 'emanuelle@test.com',
      password: 'Manu@123',
    };

    it('should successfully create a new user', async () => {
      const result = await userController.create(body);

      expect(result).toEqual(newUserEntity);
      expect(userService.create).toHaveBeenCalledTimes(1);
      expect(userService.create).toHaveBeenCalledWith(body);
    });

    it('should throw an exception', () => {
      jest.spyOn(userService, 'create').mockRejectedValueOnce(new Error());
      expect(userController.create(body)).rejects.toThrowError();
    });
  });

  describe('findOne', () => {
    it('should successfully get a user', async () => {
      const result = await userController.findOne('1');

      expect(result).toEqual(userEntityList[0]);
      expect(userService.findOne).toHaveBeenCalledTimes(1);
      expect(userService.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw an exception', () => {
      jest.spyOn(userService, 'findOne').mockRejectedValueOnce(new Error());
      expect(userController.findOne('1')).rejects.toThrowError();
    });
  });

  describe('update', () => {
    const body: UpdateUserDto = { name: 'Gabriel' };

    it('should successfully update a user', async () => {
      const result = await userController.update('1', body);

      expect(result).toEqual(updatedUserEntity);
      expect(userService.update).toHaveBeenCalledTimes(1);
      expect(userService.update).toHaveBeenCalledWith(1, body);
    });

    it('should throw an exception', () => {
      jest.spyOn(userService, 'update').mockRejectedValueOnce(new Error());
      expect(userController.update('1', body)).rejects.toThrowError();
    });
  });

  describe('remove', () => {
    it('should successfully remove a user', async () => {
      const result = await userController.remove('1');
      expect(result).toBeUndefined();
    });

    it('should throw an exception', () => {
      jest.spyOn(userService, 'remove').mockRejectedValueOnce(new Error());
      expect(userController.remove('1')).rejects.toThrowError();
    });
  });
});
