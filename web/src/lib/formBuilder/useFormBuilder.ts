/**
 * useFormBuilder - A React hook for managing form data
 * 
 * This hook provides a state-based approach to building form data objects.
 * It's designed to work with React's state management and follows React best practices.
 * 
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { addResponse, addTradeoff, formData, resetForm } = useFormBuilder();
 * 
 *   const handleSubmit = () => {
 *     addResponse('yes', 'Do you agree?');
 *     addTradeoff('Scenario A', 'A', 100, 'Which option?', 50);
 *     
 *     // Send formData to backend
 *     api.submitForm(formData);
 *   };
 * 
 *   return <button onClick={handleSubmit}>Submit</button>;
 * }
 * ```
 */

'use client';

import { useState, useCallback } from 'react';
import { FormData, FormResponse, TradeoffResponse, ValidationResult } from './types';

interface UseFormBuilderReturn {
  /** The current form data */
  formData: FormData;
  /** Add a regular form response */
  addResponse: (choice: string | number | boolean, label: string) => void;
  /** Add a tradeoff response */
  addTradeoff: (
    scenario: string,
    side: string,
    valueVar: number,
    question: string,
    valueFixed: number
  ) => void;
  /** Reset the form to empty state */
  resetForm: () => void;
  /** Get the number of regular responses */
  getResponseCount: () => number;
  /** Get the number of tradeoff responses */
  getTradeoffCount: () => number;
  /** Check if the form has any data */
  hasData: () => boolean;
}

/**
 * Validates a form response
 */
function validateResponse(choice: string | number | boolean, label: string): ValidationResult {
  if (choice === null || choice === undefined) {
    return { valid: false, error: 'Choice cannot be null or undefined' };
  }

  if (typeof label !== 'string' || label.trim() === '') {
    return { valid: false, error: 'Label must be a non-empty string' };
  }

  return { valid: true };
}

/**
 * Validates a tradeoff response
 */
function validateTradeoff(tradeoff: TradeoffResponse): ValidationResult {
  if (typeof tradeoff.scenario !== 'string' || tradeoff.scenario.trim() === '') {
    return { valid: false, error: 'Scenario must be a non-empty string' };
  }

  if (typeof tradeoff.side !== 'string' || tradeoff.side.trim() === '') {
    return { valid: false, error: 'Side must be a non-empty string' };
  }

  if (typeof tradeoff.valueVar !== 'number' || isNaN(tradeoff.valueVar)) {
    return { valid: false, error: 'ValueVar must be a valid number' };
  }

  if (typeof tradeoff.question !== 'string' || tradeoff.question.trim() === '') {
    return { valid: false, error: 'Question must be a non-empty string' };
  }

  if (typeof tradeoff.valueFixed !== 'number' || isNaN(tradeoff.valueFixed)) {
    return { valid: false, error: 'ValueFixed must be a valid number' };
  }

  return { valid: true };
}

/**
 * Custom hook for managing form data with React state
 * 
 * @returns An object containing form data and methods to manipulate it
 */
export function useFormBuilder(): UseFormBuilderReturn {
  const [formData, setFormData] = useState<FormData>({
    responses: [],
    tradeoffs: [],
  });

  /**
   * Adds a regular form response
   */
  const addResponse = useCallback((choice: string | number | boolean, label: string) => {
    const validation = validateResponse(choice, label);
    if (!validation.valid) {
      throw new Error(`Invalid response: ${validation.error}`);
    }

    const newResponse: FormResponse = {
      choice,
      label,
    };

    setFormData((prev) => ({
      ...prev,
      responses: [...prev.responses, newResponse],
    }));
  }, []);

  /**
   * Adds a tradeoff response
   */
  const addTradeoff = useCallback(
    (
      scenario: string,
      side: string,
      valueVar: number,
      question: string,
      valueFixed: number
    ) => {
      const tradeoff: TradeoffResponse = {
        scenario,
        side,
        valueVar,
        question,
        valueFixed,
      };

      const validation = validateTradeoff(tradeoff);
      if (!validation.valid) {
        throw new Error(`Invalid tradeoff: ${validation.error}`);
      }

      setFormData((prev) => ({
        ...prev,
        tradeoffs: [...prev.tradeoffs, tradeoff],
      }));
    },
    []
  );

  /**
   * Resets the form data
   */
  const resetForm = useCallback(() => {
    setFormData({
      responses: [],
      tradeoffs: [],
    });
  }, []);

  /**
   * Gets the number of regular responses
   */
  const getResponseCount = useCallback(() => {
    return formData.responses.length;
  }, [formData.responses.length]);

  /**
   * Gets the number of tradeoff responses
   */
  const getTradeoffCount = useCallback(() => {
    return formData.tradeoffs.length;
  }, [formData.tradeoffs.length]);

  /**
   * Checks if the form has any data
   */
  const hasData = useCallback(() => {
    return formData.responses.length > 0 || formData.tradeoffs.length > 0;
  }, [formData.responses.length, formData.tradeoffs.length]);

  return {
    formData,
    addResponse,
    addTradeoff,
    resetForm,
    getResponseCount,
    getTradeoffCount,
    hasData,
  };
}
