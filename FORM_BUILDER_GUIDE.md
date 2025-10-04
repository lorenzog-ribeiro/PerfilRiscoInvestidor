# Dynamic Form Object Builder - Complete Implementation Guide

## Overview

This implementation provides a complete system for building, validating, and submitting dynamic form data with special support for tradeoff scenarios. The system spans both frontend (Next.js/React) and backend (NestJS), maintaining type safety and immutability throughout.

## Architecture

```
Frontend (Next.js)              Backend (NestJS)
┌─────────────────────┐         ┌──────────────────────┐
│  useFormBuilder()   │         │   AnswerController   │
│  (React Hook)       │         │                      │
│         │           │         │   /answers/submit    │
│         ▼           │  HTTP   │          │           │
│  FormBuilder Class  │───────▶│   AnswerService      │
│         │           │  POST   │          │           │
│         ▼           │         │          ▼           │
│ FormSubmission      │         │   Prisma/Database    │
│     Service         │         │                      │
└─────────────────────┘         └──────────────────────┘
```

## Data Structure

### FormResponse
Represents a single answer to a regular question:
```typescript
{
  choice: string | number | boolean,  // User's answer
  label: string                        // Question text
}
```

### TradeoffResponse
Represents a single tradeoff decision with 5 required fields:
```typescript
{
  scenario: string,    // The scenario presented
  side: string,        // Choice made (e.g., "A" or "B")
  valueVar: number,    // Variable value associated with choice
  question: string,    // The tradeoff question
  valueFixed: number   // Fixed comparison value
}
```

### FormData
Complete form submission:
```typescript
{
  responses: FormResponse[],    // Array of regular responses
  tradeoffs: TradeoffResponse[] // Array of tradeoff responses
}
```

## Quick Start Guide

### 1. Basic Usage in a Component

```typescript
'use client';

import { useFormBuilder } from '@/lib/formBuilder';
import { FormSubmissionService } from '@/services/FormSubmissionService';

function MyQuiz() {
  const { formData, addResponse, addTradeoff, resetForm } = useFormBuilder();
  const formService = new FormSubmissionService();
  
  // Add a regular response
  const handleAnswer = (answer: string, question: string) => {
    addResponse(answer, question);
  };
  
  // Add a tradeoff response
  const handleTradeoff = () => {
    addTradeoff(
      'Scenario 1',      // scenario
      'A',               // side
      100,               // valueVar
      'Question text',   // question
      50                 // valueFixed
    );
  };
  
  // Submit to backend
  const handleSubmit = async () => {
    const userId = getUserIdFromCookie();
    await formService.submitForm(formData, userId);
    resetForm();
  };
  
  return <div>/* Your component UI */</div>;
}
```

### 2. Integration with Existing Quiz Components

#### Example: InvestorQuiz Integration

```typescript
// In your existing investorQuiz.tsx
import { useFormBuilder } from '@/lib/formBuilder';

export default function InvestorQuiz({ onComplete }) {
  const { addResponse, formData } = useFormBuilder();
  const [responses, setResponses] = useState<Record<string, string>>({});
  
  const handleNext = () => {
    // Existing logic
    const currentQuestion = investorQuestions[currentStep];
    const currentResponse = responses[currentQuestion.id];
    
    // ADD THIS: Record the response in FormBuilder
    addResponse(currentResponse, currentQuestion.text);
    
    // Continue with existing logic
    if (currentStep < investorQuestions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete({ responses, formData }); // Pass formData too
    }
  };
  
  // Rest of your existing code...
}
```

#### Example: TradeOffForm Integration

```typescript
// In your existing trade-off-form/page.tsx
import { useFormBuilder } from '@/lib/formBuilder';

export default function TradeOffForm({ scenario, onAnswered }) {
  const { addTradeoff } = useFormBuilder();
  
  const handleSelection = async (data: SelectedInterface) => {
    // Existing logic...
    setSelected(data);
    setLoading(true);
    
    // ADD THIS: Record the tradeoff in FormBuilder
    addTradeoff(
      `Scenario ${scenario}`,           // scenario
      data.optionSelected,               // side
      data.valueSelected,                // valueVar
      `Trade-off question ${index + 1}`, // question
      fixedValue ?? 0                    // valueFixed
    );
    
    // Continue with existing API call...
    const response = await tradeOffService.tradeOff({
      scenario: scenario,
      optionSelected: data.optionSelected,
      valueVar: data.valueSelected,
      valueFixed: fixedValue ?? 0,
      question: index,
    });
    
    // Rest of your existing code...
  };
  
  // Rest of your existing code...
}
```

### 3. Submitting Data at the End

Create a wrapper component that manages the entire quiz flow:

```typescript
'use client';

import { useFormBuilder } from '@/lib/formBuilder';
import { FormSubmissionService } from '@/services/FormSubmissionService';
import { useState } from 'react';
import InvestorQuiz from '@/components/quiz/investorQuiz';
import TradeOffForm from '@/components/trade-off-form/page';

export default function QuizFlowManager() {
  const formBuilder = useFormBuilder();
  const [currentScreen, setCurrentScreen] = useState('investor');
  const formService = new FormSubmissionService();
  
  const handleInvestorComplete = () => {
    setCurrentScreen('tradeoff');
  };
  
  const handleTradeoffComplete = async () => {
    // Get userId from cookie
    const userId = document.cookie
      .split('; ')
      .find(row => row.startsWith('userId='))
      ?.split('=')[1];
    
    if (!userId) {
      console.error('User ID not found');
      return;
    }
    
    try {
      // Submit all collected data
      await formService.submitForm(formBuilder.formData, userId);
      
      // Reset form
      formBuilder.resetForm();
      
      // Navigate to results
      // router.push('/results');
    } catch (error) {
      console.error('Failed to submit form:', error);
    }
  };
  
  return (
    <div>
      {currentScreen === 'investor' && (
        <InvestorQuiz onComplete={handleInvestorComplete} />
      )}
      {currentScreen === 'tradeoff' && (
        <TradeOffForm onAnswered={handleTradeoffComplete} />
      )}
    </div>
  );
}
```

## Backend API

### Endpoint: POST /answers/submit

**Request Body:**
```json
{
  "formData": {
    "responses": [
      {
        "choice": "yes",
        "label": "Do you agree?"
      },
      {
        "choice": 25,
        "label": "What is your age?"
      }
    ],
    "tradeoffs": [
      {
        "scenario": "Scenario 1",
        "side": "A",
        "valueVar": 100,
        "question": "Which option do you prefer?",
        "valueFixed": 50
      }
    ]
  },
  "userId": "user-123"
}
```

**Response:**
```json
{
  "id": "result-id",
  "userId": "user-123",
  "answers": { /* formData */ },
  "createdAt": "2024-01-01T00:00:00Z"
}
```

## Validation

### Frontend Validation

The FormBuilder automatically validates:

**For Responses:**
- ✅ `choice` cannot be null or undefined
- ✅ `label` must be a non-empty string

**For Tradeoffs:**
- ✅ `scenario` must be a non-empty string
- ✅ `side` must be a non-empty string
- ✅ `valueVar` must be a valid number
- ✅ `question` must be a non-empty string
- ✅ `valueFixed` must be a valid number

### Backend Validation

NestJS DTOs validate:
- All required fields are present
- Types match expected types
- No malformed data

## Best Practices

### 1. Error Handling

Always wrap FormBuilder operations in try-catch:

```typescript
try {
  addResponse(answer, question);
} catch (error) {
  console.error('Failed to add response:', error);
  // Show user-friendly error message
}
```

### 2. User ID Management

Ensure user ID is available before submission:

```typescript
const userId = document.cookie
  .split('; ')
  .find(row => row.startsWith('userId='))
  ?.split('=')[1];

if (!userId) {
  console.error('User ID not found');
  return;
}
```

### 3. Progressive Data Collection

Don't wait until the end to start collecting data. Add responses as they happen:

```typescript
// ✅ Good: Add immediately after user answers
const handleAnswer = (answer) => {
  addResponse(answer, currentQuestion.text);
  moveToNextQuestion();
};

// ❌ Bad: Trying to add all at once at the end
const handleSubmit = () => {
  allAnswers.forEach(a => addResponse(a.choice, a.label));
};
```

### 4. Reset After Submission

Always reset the form after successful submission:

```typescript
try {
  await formService.submitForm(formData, userId);
  resetForm(); // ✅ Clear the data
  router.push('/results');
} catch (error) {
  // Don't reset on error so user can retry
  console.error(error);
}
```

### 5. Debug During Development

Use the formData directly to see what's been collected:

```typescript
console.log('Current form data:', formData);
console.log('Response count:', formData.responses.length);
console.log('Tradeoff count:', formData.tradeoffs.length);
```

## Testing

### Unit Tests

Run the FormBuilder tests:

```bash
cd web
npm test -- FormBuilder.test.ts
```

### Integration Testing

Test the complete flow:

1. Start the backend:
```bash
cd backend
npm run start:dev
```

2. Start the frontend:
```bash
cd web
npm run dev
```

3. Navigate through the quiz and verify:
   - Data is collected at each step
   - Submission succeeds
   - Data is stored in database

## Troubleshooting

### Issue: "Invalid response" error

**Cause:** Trying to add null/undefined choice or empty label
**Solution:** Validate inputs before calling addResponse()

```typescript
if (answer && questionText) {
  addResponse(answer, questionText);
}
```

### Issue: "User ID not found" error

**Cause:** User ID cookie is not set
**Solution:** Ensure user ID is created and stored in cookie during registration

### Issue: Data not persisting

**Cause:** Form is being reset before submission
**Solution:** Only call resetForm() after successful submission

### Issue: Backend validation errors

**Cause:** Data structure doesn't match DTOs
**Solution:** Ensure you're using FormSubmissionService which formats data correctly

## Migration Guide

If you have existing code, migrate gradually:

1. **Phase 1:** Add FormBuilder alongside existing code
2. **Phase 2:** Start collecting data with FormBuilder (don't submit yet)
3. **Phase 3:** Test data collection in development
4. **Phase 4:** Switch submission to use FormBuilder data
5. **Phase 5:** Remove old data collection code

## Support

For issues or questions:
1. Check the FormBuilder README: `web/src/lib/formBuilder/README.md`
2. Review the example integration: `web/src/components/examples/FormBuilderIntegration.tsx`
3. Check the unit tests for usage examples: `web/src/lib/formBuilder/__tests__/FormBuilder.test.ts`

## License

Part of the PerfilRiscoInvestidor project.
