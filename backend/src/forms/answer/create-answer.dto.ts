import { IsArray, IsJSON, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class FormAnswerDto {
  @IsString()
  questionId: string;

  @IsString()
  answer: string;

  @IsNumber()
  weight: number;
}

class TradOffAnswerDto {
  @IsString()
  scenario: string;

  @IsString()
  side: string;

  @IsNumber()
  median: number;

  @IsNumber()
  selectedValue: number;

  @IsNumber()
  amount: number;
}

class AnswersDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormAnswerDto)
  form: FormAnswerDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TradOffAnswerDto)
  tradOff: TradOffAnswerDto[];
}

export class AnswerDto {
  @IsJSON()
  @ValidateNested()
  @Type(() => AnswersDto)
  answers: AnswersDto;
}
