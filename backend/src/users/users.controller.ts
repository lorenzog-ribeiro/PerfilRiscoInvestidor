import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { Prisma } from '@prisma/client';

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Post('create-user')
  async create(
    @Body() data: Prisma.UserCreateInput,
    @Res({ passthrough: true }) response: Response,
  ) {
    // createUser retorna o userId (string)
    const userId = await this.userService.createUser(data);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      domain: 'spaceorion.com.br', // ajuste para o domínio do frontend
    };

    // Salvar apenas o userId (string) no cookie, não o objeto inteiro
    response.cookie('userId', userId, cookieOptions);

    return {
      success: true,
      message: 'Usuário criado com sucesso',
      userId: userId, // Retornar o userId na resposta também
    };
  }
}
