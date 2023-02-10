import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpenseService {
  constructor(private readonly prisma: PrismaService) {}

  create(createExpenseDto: CreateExpenseDto) {
    return this.prisma.expenses.create({
      data: { ...createExpenseDto },
    });
  }

  findAll() {
    return this.prisma.expenses.findMany();
  }

  findOne(id: number) {
    return this.prisma.expenses.findUnique({
      where: { id },
    });
  }

  update(id: number, updateExpenseDto: UpdateExpenseDto) {
    return this.prisma.expenses.update({
      where: { id },
      data: { ...updateExpenseDto },
    });
  }

  remove(id: number) {
    return this.prisma.expenses.delete({
      where: { id },
    });
  }
}
