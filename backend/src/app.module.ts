import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { AnswerService } from './forms/answer/answer.service';
import { AnswerController } from './forms/answer/answer.controller';

@Module({
  imports: [UsersModule],
  controllers: [AppController, AnswerController],
  providers: [AppService, PrismaService, AnswerService],
})
export class AppModule {}
