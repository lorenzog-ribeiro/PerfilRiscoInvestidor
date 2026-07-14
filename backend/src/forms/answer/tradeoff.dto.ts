import { IsNumber, IsString, IsOptional } from 'class-validator';

export class TradeOffRequestDto {
  @IsNumber()
  scenario: number;

  @IsString()
  side: string;

  @IsNumber()
  valueVar: number;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsNumber()
  question: number;

  @IsNumber()
  @IsOptional()
  valueFixed?: number;
}
