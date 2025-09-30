import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { Prisma } from '@prisma/client';

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Post('create-user')
  async create(@Body() data: Prisma.UserCreateInput) {
    return this.userService.createUser(data);
  }
}
