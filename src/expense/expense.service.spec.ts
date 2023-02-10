import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { ExpenseEntity } from './entities/expense.entity';
import { ExpenseService } from './expense.service';
import { REQUEST } from '@nestjs/core';
import { UpdateExpenseDto } from './dto/update-expense.dto';

const expenseEntityList: ExpenseEntity[] = [
  new ExpenseEntity({
    id: 1,
    id_user: 1,
    description: 'Buy a new phone',
    value: 1000,
    date: new Date('2023-01-20'),
  }),
  new ExpenseEntity({
    id: 2,
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

describe('ExpenseService', () => {
  let expenseService: ExpenseService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpenseService,
        {
          provide: PrismaService,
          useValue: {
            expenses: {
              create: jest.fn().mockResolvedValue(newExpenseEntity),
              findMany: jest.fn().mockResolvedValue(expenseEntityList),
              findFirst: jest.fn().mockResolvedValue(expenseEntityList[0]),
              update: jest.fn().mockResolvedValue(updatedExpenseEntity),
              delete: jest.fn().mockResolvedValue(undefined),
            },
          },
        },
        {
          provide: REQUEST,
          useValue: {
            user: {
              id: 1,
            },
          },
        },
        {
          provide: MailService,
          useValue: {
            sendMail: jest.fn().mockResolvedValue(null),
          },
        },
      ],
    }).compile();

    expenseService = module.get<ExpenseService>(ExpenseService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(expenseService).toBeDefined();
  });

  describe('create', () => {
    const data: CreateExpenseDto = {
      id_user: 1,
      description: 'Buy a new hat',
      value: 100,
      date: new Date('2023-01-20'),
    };

    it('should successfully create a new expense', async () => {
      const result = await expenseService.create(data);

      expect(result).toEqual(newExpenseEntity);
      expect(prismaService.expenses.create).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', () => {
      jest
        .spyOn(prismaService.expenses, 'create')
        .mockRejectedValueOnce(new Error());

      expect(prismaService.expenses.create({ data })).rejects.toThrowError();
    });
  });

  describe('findAll', () => {
    it('should return the list of expenses', async () => {
      const result = await expenseService.findAll();

      expect(result).toEqual(expenseEntityList);
      expect(prismaService.expenses.findMany).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', () => {
      jest
        .spyOn(prismaService.expenses, 'findMany')
        .mockRejectedValueOnce(new Error());

      expect(expenseService.findAll()).rejects.toThrowError();
    });
  });

  describe('findOne', () => {
    it('should successfully get a expense', async () => {
      const result = await prismaService.expenses.findFirst({
        where: { id: 1 },
      });

      expect(result).toEqual(expenseEntityList[0]);
      expect(prismaService.expenses.findFirst).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', () => {
      jest
        .spyOn(prismaService.expenses, 'findFirst')
        .mockRejectedValueOnce(new Error());

      expect(
        prismaService.expenses.findFirst({ where: { id: 1 } }),
      ).rejects.toThrowError();
    });
  });

  describe('update', () => {
    const data: UpdateExpenseDto = { description: 'Buy a new pants' };

    it('should successfully update a expense', async () => {
      jest
        .spyOn(prismaService.expenses, 'update')
        .mockResolvedValueOnce(updatedExpenseEntity);

      const result = await prismaService.expenses.update({
        where: { id: 1 },
        data,
      });

      expect(result).toEqual(updatedExpenseEntity);
    });

    it('should throw an exception', () => {
      jest
        .spyOn(prismaService.expenses, 'update')
        .mockRejectedValueOnce(new Error());

      expect(
        prismaService.expenses.update({
          where: { id: 1 },
          data,
        }),
      ).rejects.toThrowError();
    });
  });

  describe('remove', () => {
    it('should successfully remove a expense', async () => {
      const result = await prismaService.expenses.delete({ where: { id: 1 } });

      expect(result).toBeUndefined();
      expect(prismaService.expenses.delete).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', () => {
      jest
        .spyOn(prismaService.expenses, 'delete')
        .mockRejectedValueOnce(new Error());

      expect(
        prismaService.expenses.delete({ where: { id: 1 } }),
      ).rejects.toThrowError();
    });
  });
});
