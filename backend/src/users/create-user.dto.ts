import { IsDateString, IsEmail, IsString, MaxLength } from 'class-validator';

/**
 * Campos aceitos na criação de usuário.
 * Com o ValidationPipe (whitelist), qualquer campo fora deste conjunto é
 * descartado — fecha o mass assignment via Prisma.UserCreateInput.
 */
export class CreateUserDto {
  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsString()
  @MaxLength(255)
  name: string;

  @IsDateString()
  birthDate: string;
}
