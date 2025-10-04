import { IsArray, IsJSON, IsNumber, IsString, ValidateNested, IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Represents a single form response
 * Matches the FormResponse interface from the frontend
 */
class FormResponseDto {
  @IsOptional()
  choice: string | number | boolean;

  @IsString()
  label: string;
}

/**
 * Represents a single tradeoff response
 * Matches the TradeoffResponse interface from the frontend
 */
class TradeoffResponseDto {
  @IsString()
  scenario: string;

  @IsString()
  side: string;

  @IsNumber()
  valueVar: number;

  @IsString()
  question: string;

  @IsNumber()
  valueFixed: number;
}

/**
 * Main form data structure
 * Matches the FormData interface from the frontend
 */
class FormDataDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormResponseDto)
  responses: FormResponseDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TradeoffResponseDto)
  tradeoffs: TradeoffResponseDto[];
}

/**
 * Main DTO for form submission
 */
export class AnswerDto {
  @ValidateNested()
  @Type(() => FormDataDto)
  formData: FormDataDto;

  @IsString()
  userId: string;
}

// Legacy DTO classes for backward compatibility
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

/**
 * Legacy DTO - kept for backward compatibility
 * @deprecated Use AnswerDto instead
 */
export class LegacyAnswerDto {
  @IsJSON()
  @ValidateNested()
  @Type(() => AnswersDto)
  answers: AnswersDto;
}
