import { Injectable } from '@nestjs/common';

@Injectable()
export class QuestionService {
  findAll() {
    return `This action returns all questions`;
  }
}
