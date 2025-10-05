import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AnswerService } from './answer.service';
import { AnswerDto } from './create-answer.dto';
import { TradeOffRequestDto } from './tradeoff.dto';
import { UserCookieGuard } from '../../guards/user-cookie.guard';
import { Request } from 'express';

// Interface customizada para Request com userId
interface RequestWithUser extends Request {
  userId?: string;
}

@Controller('answers')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Post('create')
  create(@Body() createAnswerDto: AnswerDto, @Body('userId') userId: string) {
    return this.answerService.create(userId, createAnswerDto);
  }

  @Post('submit')
  @UseGuards(UserCookieGuard)
  submitForm(@Body() answerDto: AnswerDto, @Req() request: RequestWithUser) {
    // O UserCookieGuard já validou e processou o userId
    const userId = request.userId;

    if (!userId) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    return this.answerService.createFormSubmission(userId, answerDto);
  }

  @Get('all')
  findAllUserAnswers() {
    return this.answerService.findAllUserAnswers();
  }

  @Post('tradeOff')
  tradeOff(@Body() data: TradeOffRequestDto) {
    return this.answerService.tradeOff(data);
  }
}
