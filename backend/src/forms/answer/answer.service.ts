import { Body, Injectable, Logger } from '@nestjs/common';
import { AnswerDto } from './create-answer.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Cookies } from 'src/common/decorators/cookies.decorator';
import { TradeOffRequestDto } from './tradeoff.dto';

@Injectable()
export class AnswerService {
  private readonly logger = new Logger(AnswerService.name);
  constructor(private prisma: PrismaService) {}

  async create(
    @Cookies() userId: string,
    @Body() createAnswerDto: AnswerDto,
  ): Promise<any> {
    try {
      const result = await this.prisma.result.create({
        data: {
          userId: userId,
          answers: JSON.parse(JSON.stringify(createAnswerDto.answers)),
        },
      });
      this.logger.log(`Created answer for user ${userId}`);
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to create answer for user ${userId}`,
        error.stack,
      );
      throw error;
    }
  }

  findAllUserAnswers() {
    return this.prisma.result.findMany();
  }

  async tradeOff(data: TradeOffRequestDto) {
    try {
      let Safe = 0;
      let Risk = 0;
      console.log(data);
      switch (data.scenario) {
        case 1:
          Safe = data.valueFixed || 0;
          break;
        case 2:
          Risk = data.valueFixed || 0;
          break;
        case 3:
          Risk = data.valueFixed || 0;
          break;
      }

      let valueBase = this.base(Safe, Risk, data.scenario);

      let dataForCalc = {
        sideSelected: data.side,
        valueBase: valueBase ?? 0,
        question: data.question,
        valueSelected: data.valueSelected,
        scenario: data.scenario,
      };

      let mediana = this.calculateMedian(dataForCalc);

      // Retorna no formato esperado pelo frontend
      return {
        forecast: {
          mediana: Math.round(mediana),
          valor_fixo: Math.round(data.valueFixed ?? 0),
        },
      };
    } catch (error) {
      this.logger.error(`Failed to create answer for user`, error.stack);
      throw error;
    }
  }

  base(Safe: number, Risk: number, scenario: number) {
    switch (scenario) {
      case 1:
        return Safe * (1 / 2) + Risk * (1 / 2) - (0 * 0) / 100;
        break;
      case 2:
        return 0 * 1 + 0 * 0 - (Risk * (1 / 2)) / (1 / 2);
        break;
      case 3:
        return Risk * (1 / 2) + Safe * (1 / 2) - (0 * 0) / 100;
        break;
    }
  }

  calculateMedian(data: {
    sideSelected;
    valueBase;
    question;
    valueSelected;
    scenario;
  }) {
    switch (data.scenario) {
      case 1:
        return data.sideSelected === 'left'
          ? data.valueSelected + data.valueBase / 2 ** data.question
          : data.valueSelected - data.valueBase / 2 ** data.question;
        break;
      case 2:
        return data.sideSelected === 'left'
          ? data.valueSelected - data.valueBase / 2 ** data.question
          : data.valueSelected + data.valueBase / 2 ** data.question;
        break;
      case 3:
        return data.sideSelected === 'left'
          ? data.valueSelected - data.valueBase / 2 ** data.question
          : data.valueSelected + data.valueBase / 2 ** data.question;
        break;
    }
  }
}
