import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { AnswerDto } from './create-answer.dto';
import { TradeOffRequestDto } from './tradeoff.dto';
import { AdminGuard } from '../../guards/admin.guard';

@Controller('answers')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Post('create')
  create(@Body() createAnswerDto: AnswerDto, @Body('userId') userId: string) {
    return this.answerService.create(userId, createAnswerDto);
  }

  @Get('all')
  @UseGuards(AdminGuard)
  findAllUserAnswers() {
    return this.answerService.findAllUserAnswers();
  }

  @Post('tradeOff')
  TradeOff(@Body() data: TradeOffRequestDto) {
    return this.answerService.tradeOff(data);
  }
}
