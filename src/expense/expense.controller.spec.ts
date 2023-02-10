import { Test, TestingModule } from '@nestjs/testing';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpenseEntity } from './entities/expense.entity';
import { ExpenseController } from './expense.controller';
import { ExpenseService } from './expense.service';

const expenseEntityList: ExpenseEntity[] = [
  new ExpenseEntity({
    id_user: 1,
    description: 'Buy a new phone',
    value: 1000,
    date: new Date('2023-01-20'),
  }),
  new ExpenseEntity({
    id_user: 1,
    description: 'Buy a new car',
    value: 90000,
    date: new Date('2022-12-25'),
  }),
];

const newExpenseEntity = new ExpenseEntity({
  id_user: 1,
  description: 'Buy a new shirt',
});

const updatedExpenseEntity = new ExpenseEntity({
  description: 'Buy a new shoes',
  value: 100,
});

describe('ExpenseController', () => {
  let expenseController: ExpenseController;
  let expenseService: ExpenseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpenseController],
      providers: [
        {
          provide: ExpenseService,
          useValue: {
            create: jest.fn().mockResolvedValue(newExpenseEntity),
            findAll: jest.fn().mockResolvedValue(expenseEntityList),
            findOne: jest.fn().mockResolvedValue(expenseEntityList[0]),
            update: jest.fn().mockResolvedValue(updatedExpenseEntity),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    expenseController = module.get<ExpenseController>(ExpenseController);
    expenseService = module.get<ExpenseService>(ExpenseService);
  });

  it('should be defined', () => {
    expect(expenseController).toBeDefined();
    expect(expenseService).toBeDefined();
  });

  describe('create', () => {
    const body: CreateExpenseDto = {
      id_user: 1,
      description: 'Buy a new hat',
      value: 100,
      date: new Date('2023-01-20'),
    };

    it('should successfully create a new expense', async () => {
      const result = await expenseController.create(body);

      expect(result).toEqual(newExpenseEntity);
      expect(expenseService.create).toHaveBeenCalledTimes(1);
      expect(expenseService.create).toHaveBeenCalledWith(body);
    });

    it('should throw an exception', () => {
      jest.spyOn(expenseService, 'create').mockRejectedValueOnce(new Error());
      expect(expenseController.create(body)).rejects.toThrowError();
    });
  });

  describe('findAll', () => {
    it('should return the list of expenses', async () => {
      const result = await expenseController.findAll();

      expect(typeof result).toEqual('object');
      expect(result).toEqual(expenseEntityList);
      expect(expenseService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', () => {
      jest.spyOn(expenseService, 'findAll').mockRejectedValueOnce(new Error());
      expect(expenseController.findAll()).rejects.toThrowError();
    });
  });

  describe('findOne', () => {
    it('should successfully get a expense', async () => {
      const result = await expenseController.findOne('1');

      expect(result).toEqual(expenseEntityList[0]);
      expect(expenseService.findOne).toHaveBeenCalledTimes(1);
      expect(expenseService.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw an exception', () => {
      jest.spyOn(expenseService, 'findOne').mockRejectedValueOnce(new Error());
      expect(expenseController.findOne('1')).rejects.toThrowError();
    });
  });

  describe('update', () => {
    const body: UpdateExpenseDto = { description: 'Buy a new pants' };

    it('should successfully update a expense', async () => {
      const result = await expenseController.update('1', body);

      expect(result).toEqual(updatedExpenseEntity);
      expect(expenseService.update).toHaveBeenCalledTimes(1);
      expect(expenseService.update).toHaveBeenCalledWith(1, body);
    });

    it('should throw an exception', () => {
      jest.spyOn(expenseService, 'update').mockRejectedValueOnce(new Error());
      expect(expenseController.update('1', body)).rejects.toThrowError();
    });
  });

  describe('remove', () => {
    it('should successfully remove a expense', async () => {
      const result = await expenseController.remove('1');
      expect(result).toBeUndefined();
    });

    it('should throw an exception', () => {
      jest.spyOn(expenseService, 'remove').mockRejectedValueOnce(new Error());
      expect(expenseController.remove('1')).rejects.toThrowError();
    });
  });
});
