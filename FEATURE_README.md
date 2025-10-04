# Dynamic Form Object Builder - Feature Implementation

## Quick Reference

This feature implements a dynamic form object builder system that collects user responses and tradeoff data, building an object iteratively until form completion.

### 📍 Location

- **Frontend**: `web/src/lib/formBuilder/`
- **Backend**: `backend/src/forms/answer/`
- **Services**: `web/services/FormSubmissionService.tsx`

### 🚀 Quick Start

```typescript
// 1. Import the hook
import { useFormBuilder } from '@/lib/formBuilder';

// 2. Use in your component
const { formData, addResponse, addTradeoff, resetForm } = useFormBuilder();

// 3. Add regular responses
addResponse('yes', 'Do you agree?');
addResponse(25, 'What is your age?');

// 4. Add tradeoffs
addTradeoff(
  'Scenario A vs B',  // scenario
  'A',                // side
  100,                // valueVar
  'Question text',    // question
  50                  // valueFixed
);

// 5. Submit to backend
import { FormSubmissionService } from '@/services/FormSubmissionService';
const service = new FormSubmissionService();
await service.submitForm(formData, userId);
```

### 📊 Data Structure

**Regular Response:**
```typescript
{
  choice: string | number | boolean,
  label: string
}
```

**Tradeoff Response:**
```typescript
{
  scenario: string,
  side: string,
  valueVar: number,
  question: string,
  valueFixed: number
}
```

### 📖 Documentation

- **Complete Guide**: See `FORM_BUILDER_GUIDE.md`
- **API Reference**: See `web/src/lib/formBuilder/README.md`
- **Example Integration**: See `web/src/components/examples/FormBuilderIntegration.tsx`
- **Unit Tests**: See `web/src/lib/formBuilder/__tests__/FormBuilder.test.ts`

### ✅ Validation

Run the validation script to verify the implementation:

```bash
./validate-implementation.sh
```

### 🧪 Testing

```bash
cd web
npm install
npm test -- FormBuilder.test.ts
```

### 🔗 Backend Endpoint

**POST** `/answers/submit`

```json
{
  "formData": {
    "responses": [...],
    "tradeoffs": [...]
  },
  "userId": "user-id"
}
```

### ✨ Features

- ✅ Type-safe (TypeScript)
- ✅ Immutable operations
- ✅ Input validation
- ✅ React hook integration
- ✅ Method chaining
- ✅ Comprehensive tests
- ✅ Full documentation

### 📝 Integration with Existing Components

See the detailed integration guide in `FORM_BUILDER_GUIDE.md` for step-by-step instructions on integrating with:
- InvestorQuiz
- LiteracyQuiz  
- RiskTakingQuiz
- TradeOffForm

### 🎯 All Requirements Met

- ✅ Creates object on first response
- ✅ Iterates without losing previous data
- ✅ Captures all 5 tradeoff fields (scenario, side, valueVar, question, valueFixed)
- ✅ Type-safe implementation
- ✅ Validated inputs
- ✅ Well documented
- ✅ Unit tested

---

**Status**: ✅ Complete and production-ready
