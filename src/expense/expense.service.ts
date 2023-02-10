import { Injectable } from '@nestjs/common';
import { MailService } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpenseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async create(createExpenseDto: CreateExpenseDto) {
    const result = await this.prisma.expenses.create({
      data: { ...createExpenseDto },
      select: {
        id: true,
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

    return result;
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
