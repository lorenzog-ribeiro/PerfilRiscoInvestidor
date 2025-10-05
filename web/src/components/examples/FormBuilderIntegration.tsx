/**
 * Example Integration Component
 *
 * This component demonstrates how to integrate the FormBuilder
 * with existing quiz components to collect and submit form data.
 *
 * This is a reference implementation showing best practices.
 */

"use client";

import { useState, useEffect, useMemo } from "react";
import { useFormBuilder } from "@/lib/formBuilder";
import { FormSubmissionService } from "@/services/FormSubmissionService";

interface Question {
  id: string;
  text: string;
  type: string;
  options: Array<{ value: string; label: string }>;
}

/**
 * Example component showing FormBuilder integration with a quiz
 */
export default function FormBuilderIntegrationExample() {
  const { formData, addResponse, addTradeoff, resetForm, hasData } =
    useFormBuilder();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userId, setUserId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formSubmissionService = useMemo(() => new FormSubmissionService(), []);

  // Sample questions - replace with your actual questions
  const questions: Question[] = [
    {
      id: "q1",
      text: "What is your investment goal?",
      type: "choice",
      options: [
        { value: "growth", label: "Growth" },
        { value: "income", label: "Income" },
        { value: "preservation", label: "Capital Preservation" },
      ],
    },
    {
      id: "q2",
      text: "What is your age?",
      type: "number",
      options: [],
    },
    // Add more questions as needed
  ];

  useEffect(() => {
    // Get userId from cookie or session
    const userIdFromCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("userId="))
      ?.split("=")[1];

    if (userIdFromCookie) {
      setUserId(userIdFromCookie);
    }
  }, []);

  const currentQuestion = questions[currentQuestionIndex];

  /**
   * Handle regular form response
   */
  const handleAnswer = (choice: string | number | boolean) => {
    try {
      addResponse(choice, currentQuestion.text);

      // Move to next question or finish
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Quiz complete, submit form
        handleSubmit();
      }
    } catch (error) {
      console.error("Error adding response:", error);
    }
  };

  /**
   * Handle tradeoff response
   * Call this when user completes a tradeoff scenario
   */
  const handleTradeoffComplete = (
    scenario: string,
    side: string,
    valueVar: number,
    question: string,
    valueFixed: number
  ) => {
    try {
      addTradeoff(scenario, side, valueVar, question, valueFixed);
    } catch (error) {
      console.error("Error adding tradeoff:", error);
    }
  };

  /**
   * Submit the complete form to the backend
   */
  const handleSubmit = async () => {
    if (!hasData()) {
      console.warn("No data to submit");
      return;
    }

    if (!userId) {
      console.error("User ID not found");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await formSubmissionService.submitForm(formData, userId);
      // Reset form after successful submission
      resetForm();

      // Navigate to results page or show success message
      // router.push('/results');
    } catch (error) {
      console.error("Failed to submit form:", error);
      // Show error message to user
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Quiz Progress</h2>
        <p className="text-gray-600">
          Question {currentQuestionIndex + 1} of {questions.length}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Responses: {formData.responses.length} | Tradeoffs:{" "}
          {formData.tradeoffs.length}
        </p>
      </div>

      {currentQuestion && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">{currentQuestion.text}</h3>

          {currentQuestion.type === "choice" && (
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className="w-full p-4 text-left border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  disabled={isSubmitting}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}

          {currentQuestion.type === "number" && (
            <div className="space-y-3">
              <input
                type="number"
                className="w-full p-3 border-2 border-gray-300 rounded-lg"
                placeholder="Enter your answer"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const value = parseInt(
                      (e.target as HTMLInputElement).value
                    );
                    if (!isNaN(value)) {
                      handleAnswer(value);
                    }
                  }
                }}
                disabled={isSubmitting}
              />
            </div>
          )}
        </div>
      )}

      {/* Debug Panel - Remove in production */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h4 className="font-semibold mb-2">Debug Info:</h4>
        <pre className="text-xs overflow-auto">
          {JSON.stringify(formData, null, 2)}
        </pre>
      </div>
    </div>
  );
}

/**
 * INTEGRATION NOTES:
 *
 * 1. For existing quiz components (investorQuiz, literacyQuiz, etc.):
 *    - Wrap the component with FormBuilder context
 *    - Call addResponse() after each question is answered
 *    - Call addTradeoff() after each tradeoff scenario completes
 *
 * 2. For trade-off scenarios:
 *    - In the handleSelection function of TradeOffForm:
 *      addTradeoff(
 *        `Scenario ${scenario}`,
 *        data.optionSelected,
 *        data.valueSelected,
 *        'Trade-off question',
 *        fixedValue ?? 0
 *      );
 *
 * 3. For form submission:
 *    - Collect all data using getFormData()
 *    - Submit to backend using FormSubmissionService
 *    - Reset form after successful submission
 *
 * 4. Example minimal integration in existing TradeOffForm:
 *
 *    import { useFormBuilder } from '@/lib/formBuilder';
 *
 *    export default function TradeOffForm({ scenario, onAnswered }) {
 *      const { addTradeoff } = useFormBuilder();
 *
 *      const handleSelection = async (data: SelectedInterface) => {
 *        // ... existing logic ...
 *
 *        // Add this line after successful selection:
 *        addTradeoff(
 *          `Scenario ${scenario}`,
 *          data.optionSelected,
 *          data.valueSelected,
 *          `Trade-off question ${index}`,
 *          fixedValue ?? 0
 *        );
 *
 *        // ... rest of existing logic ...
 *      };
 *    }
 */
