# FormBuilder Module

A TypeScript module for building dynamic form data objects with support for regular responses and tradeoff data collection.

## Features

- ✅ **Type-safe**: Full TypeScript support with comprehensive type definitions
- ✅ **Immutable**: All operations maintain immutability using spread operators
- ✅ **Validated**: Built-in validation for all inputs
- ✅ **React-friendly**: Provides both class-based and hook-based implementations
- ✅ **Tested**: Comprehensive unit test coverage
- ✅ **Documented**: Extensive JSDoc documentation

## Installation

The FormBuilder module is part of the application. Import it from:

```typescript
import { FormBuilder, useFormBuilder } from '@/lib/formBuilder';
```

## Usage

### Class-based Usage

```typescript
import { FormBuilder } from '@/lib/formBuilder';

// Create a new instance
const formBuilder = new FormBuilder();

// Add regular responses
formBuilder.addResponse('yes', 'Do you agree?');
formBuilder.addResponse(25, 'What is your age?');
formBuilder.addResponse(true, 'Accept terms?');

// Add tradeoff responses
formBuilder.addTradeoff(
  'Scenario A vs B',
  'A',
  100,
  'Which option do you prefer?',
  50
);

// Get the complete form data
const formData = formBuilder.getFormData();

// Send to backend
await api.submitForm(formData);
```

### React Hook Usage

```typescript
'use client';

import { useFormBuilder } from '@/lib/formBuilder';

function MyQuizComponent() {
  const { 
    formData, 
    addResponse, 
    addTradeoff, 
    resetForm,
    hasData 
  } = useFormBuilder();

  const handleAnswer = (choice: string, label: string) => {
    addResponse(choice, label);
  };

  const handleTradeoff = () => {
    addTradeoff('Scenario 1', 'A', 100, 'Question 1', 50);
  };

  const handleSubmit = async () => {
    if (hasData()) {
      await api.submitForm(formData);
      resetForm();
    }
  };

  return (
    <div>
      <button onClick={() => handleAnswer('yes', 'Do you agree?')}>
        Submit Answer
      </button>
      <button onClick={handleSubmit}>Submit Form</button>
    </div>
  );
}
```

## API Reference

### FormBuilder Class

#### Methods

##### `addResponse(choice: string | number | boolean, label: string): FormBuilder`

Adds a regular form response.

- **Parameters:**
  - `choice`: The user's selected answer
  - `label`: The question label/description
- **Returns:** The FormBuilder instance for method chaining
- **Throws:** Error if validation fails

##### `addTradeoff(scenario: string, side: string, valueVar: number, question: string, valueFixed: number): FormBuilder`

Adds a tradeoff response.

- **Parameters:**
  - `scenario`: The scenario presented to the user
  - `side`: The side/option chosen (e.g., "A" or "B")
  - `valueVar`: The variable value associated with the choice
  - `question`: The tradeoff question text
  - `valueFixed`: The fixed value for comparison
- **Returns:** The FormBuilder instance for method chaining
- **Throws:** Error if validation fails

##### `getFormData(): FormData`

Returns a copy of the complete form data.

##### `resetForm(): FormBuilder`

Resets the form to an empty state.

##### `getResponseCount(): number`

Returns the number of regular responses.

##### `getTradeoffCount(): number`

Returns the number of tradeoff responses.

##### `hasData(): boolean`

Checks if the form has any data.

### useFormBuilder Hook

Returns an object with the following properties:

- `formData`: The current form data
- `addResponse`: Function to add a regular response
- `addTradeoff`: Function to add a tradeoff response
- `resetForm`: Function to reset the form
- `getResponseCount`: Function to get response count
- `getTradeoffCount`: Function to get tradeoff count
- `hasData`: Function to check if form has data

## Data Structures

### FormResponse

```typescript
interface FormResponse {
  choice: string | number | boolean;
  label: string;
}
```

### TradeoffResponse

```typescript
interface TradeoffResponse {
  scenario: string;
  side: string;
  valueVar: number;
  question: string;
  valueFixed: number;
}
```

### FormData

```typescript
interface FormData {
  responses: FormResponse[];
  tradeoffs: TradeoffResponse[];
}
```

## Method Chaining

The FormBuilder class supports method chaining for fluent API usage:

```typescript
const formData = new FormBuilder()
  .addResponse('yes', 'Question 1')
  .addResponse(42, 'Question 2')
  .addTradeoff('Scenario A', 'A', 100, 'Tradeoff 1', 50)
  .getFormData();
```

## Validation

The FormBuilder automatically validates all inputs:

- **Responses:**
  - Choice cannot be null or undefined
  - Label must be a non-empty string

- **Tradeoffs:**
  - Scenario must be a non-empty string
  - Side must be a non-empty string
  - ValueVar must be a valid number
  - Question must be a non-empty string
  - ValueFixed must be a valid number

## Immutability

All operations maintain immutability:

```typescript
const formBuilder = new FormBuilder();

const snapshot1 = formBuilder.getFormData(); // {}
formBuilder.addResponse('yes', 'Question');
const snapshot2 = formBuilder.getFormData(); // { responses: [{ choice: 'yes', label: 'Question' }] }

// snapshot1 remains unchanged
console.log(snapshot1); // {}
```

## Testing

Run tests with:

```bash
npm test -- FormBuilder.test.ts
```

## Best Practices

1. **Use the hook in React components**: For React components, prefer `useFormBuilder()` over the class-based approach
2. **Chain methods**: Utilize method chaining for cleaner code
3. **Handle errors**: Wrap operations in try-catch blocks to handle validation errors
4. **Reset after submission**: Always reset the form after successful submission

## Example: Integration with Quiz Component

```typescript
'use client';

import { useFormBuilder } from '@/lib/formBuilder';
import { useState } from 'react';

export default function QuizPage() {
  const { formData, addResponse, resetForm } = useFormBuilder();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  
  const questions = [
    { id: 'q1', text: 'Question 1?', choices: ['yes', 'no'] },
    { id: 'q2', text: 'Question 2?', choices: ['a', 'b', 'c'] },
  ];

  const handleAnswer = (choice: string) => {
    addResponse(choice, questions[currentQuestion].text);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Submit form
      submitForm();
    }
  };

  const submitForm = async () => {
    try {
      await fetch('/api/submit', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      resetForm();
      // Navigate to results
    } catch (error) {
      console.error('Submission failed:', error);
    }
  };

  return (
    <div>
      <h2>{questions[currentQuestion].text}</h2>
      {questions[currentQuestion].choices.map((choice) => (
        <button key={choice} onClick={() => handleAnswer(choice)}>
          {choice}
        </button>
      ))}
    </div>
  );
}
```

## License

Part of the PerfilRiscoInvestidor project.
