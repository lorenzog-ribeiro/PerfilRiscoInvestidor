import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { AnswerDto } from './create-answer.dto';

describe('AnswerDto validation', () => {
  it('valid payload should pass validation', async () => {
    const payload = {
      answers: {
        form: [
          { questionId: '1', answer: 'teste', weight: 0 },
          { questionId: '2', answer: 'another answer', weight: 5 },
        ],
        tradOff: [
          {
            scenario: '1',
            side: 'left',
            median: 0,
            selectedValue: 10,
            amount: 500,
          },
          {
            scenario: '2',
            side: 'right',
            median: 50,
            selectedValue: 70,
            amount: 1200,
          },
        ],
      },
    };

    const dto = plainToInstance(AnswerDto, payload);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('missing answers should fail validation', async () => {
    const payload = {};
    const dto = plainToInstance(AnswerDto, payload);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    // top level property 'answers' should be present in errors
    expect(errors.some((e) => e.property === 'answers')).toBeTruthy();
  });

  it('form not array should fail validation', async () => {
    const payload = {
      answers: {
        form: { questionId: '1', answer: 'x', weight: 0 }, // invalid
        tradOff: [
          {
            scenario: '1',
            side: 'left',
            median: 0,
            selectedValue: 10,
            amount: 500,
          },
        ],
      },
    };
    const dto = plainToInstance(AnswerDto, payload);
    const errors = await validate(dto);
    // should fail because form is not an array
    expect(errors.length).toBeGreaterThan(0);
    // dig to find nested errors
    const answersError = errors.find((e) => e.property === 'answers');
    expect(answersError).toBeDefined();
  });

  it('tradOff item with wrong types should fail validation', async () => {
    const payload = {
      answers: {
        form: [{ questionId: '1', answer: 'a', weight: 0 }],
        tradOff: [
          {
            scenario: '1',
            side: 'left',
            median: 'not-a-number',
            selectedValue: 'x',
            amount: '500',
          },
        ],
      },
    };
    const dto = plainToInstance(AnswerDto, payload);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const answersErr = errors.find((e) => e.property === 'answers');
    expect(answersErr).toBeDefined();
  });

  it('form item missing questionId should fail', async () => {
    const payload = {
      answers: {
        form: [{ answer: 'ok', weight: 1 }],
        tradOff: [
          {
            scenario: '1',
            side: 'left',
            median: 0,
            selectedValue: 1,
            amount: 100,
          },
        ],
      },
    };
    const dto = plainToInstance(AnswerDto, payload);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
