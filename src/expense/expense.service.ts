import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { MailService } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class ExpenseService {
  constructor(
    @Inject(REQUEST) private request: Request,
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async create(createExpenseDto: CreateExpenseDto) {
    const result = await this.prisma.expenses.create({
      data: { ...createExpenseDto },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    this.mailService.sendMail({
      to: result.user.email,
      subject: 'Registered expense',
      text: `Hey ${result.user.name}, a new expense was registered.`,
    });

    delete result.user;

    return result;
  }

  async findAll() {
    return await this.prisma.expenses.findMany({
      where: { id_user: this.request.user.id },
    });
  }

  async findOne(id: number) {
    const data = await this.prisma.expenses.findFirst({
      where: { id, id_user: this.request.user.id },
    });

    if (!data) throw new NotFoundException('Expense not found');

    return data;
  }

  async update(id: number, updateExpenseDto: UpdateExpenseDto) {
    await this.findOne(id);

    return this.prisma.expenses.update({
      where: { id },
      data: { ...updateExpenseDto },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.expenses.delete({ where: { id } });
  }
}
