import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const data: Prisma.UsersCreateInput = {
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    };

    const createdUser = await this.prisma.users.create({ data });

    delete createdUser.password;

    return createdUser;
  }

  async findAll() {
    return await this.prisma.users.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: number) {
    const data = await this.prisma.users.findFirst({ where: { id } });

    if (!data) throw new NotFoundException('User not found');

    return data;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    return await this.prisma.users.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return await this.prisma.users.delete({ where: { id } });
  }

  async findByEmail(email: string) {
    const data = await this.prisma.users.findUnique({ where: { email } });

    if (!data) throw new NotFoundException('User not found');

    return data;
  }
}
