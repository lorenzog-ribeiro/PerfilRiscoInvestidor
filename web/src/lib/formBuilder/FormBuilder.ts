/**
 * FormBuilder - A class for building form data objects dynamically
 * 
 * This class provides methods to build a form data object by iterating through
 * user responses. It maintains immutability and ensures data integrity through
 * validation.
 * 
 * @example
 * ```typescript
 * const formBuilder = new FormBuilder();
 * 
 * // Add regular responses
 * formBuilder.addResponse('yes', 'Do you agree?');
 * formBuilder.addResponse(25, 'What is your age?');
 * 
 * // Add tradeoff
 * formBuilder.addTradeoff({
 *   scenario: 'Scenario A vs B',
 *   side: 'A',
 *   valueVar: 100,
 *   question: 'Which option do you prefer?',
 *   valueFixed: 50
 * });
 * 
 * const finalData = formBuilder.getFormData();
 * ```
 */

import { FormData, FormResponse, TradeoffResponse, ValidationResult } from './types';

export class FormBuilder {
  private formData: FormData;

  /**
   * Initializes a new FormBuilder with empty data
   */
  constructor() {
    this.formData = this.initializeForm();
  }

  /**
   * Initializes an empty form data structure
   * @returns An empty FormData object
   */
  private initializeForm(): FormData {
    return {
      responses: [],
      tradeoffs: [],
    };
  }

  /**
   * Validates a form response before adding it
   * @param choice - The user's choice
   * @param label - The question label
   * @returns ValidationResult indicating if the response is valid
   */
  private validateResponse(choice: string | number | boolean, label: string): ValidationResult {
    if (choice === null || choice === undefined) {
      return { valid: false, error: 'Choice cannot be null or undefined' };
    }

    if (typeof label !== 'string' || label.trim() === '') {
      return { valid: false, error: 'Label must be a non-empty string' };
    }

    return { valid: true };
  }

  /**
   * Validates a tradeoff response before adding it
   * @param tradeoff - The tradeoff response to validate
   * @returns ValidationResult indicating if the tradeoff is valid
   */
  private validateTradeoff(tradeoff: TradeoffResponse): ValidationResult {
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
   * Adds a regular form response to the form data
   * Uses immutable operations to ensure data integrity
   * 
   * @param choice - The user's selected answer
   * @param label - The question label/description
   * @throws Error if validation fails
   * @returns The FormBuilder instance for method chaining
   */
  addResponse(choice: string | number | boolean, label: string): FormBuilder {
    const validation = this.validateResponse(choice, label);
    if (!validation.valid) {
      throw new Error(`Invalid response: ${validation.error}`);
    }

    const newResponse: FormResponse = {
      choice,
      label,
    };

    // Immutable update using spread operator
    this.formData = {
      ...this.formData,
      responses: [...this.formData.responses, newResponse],
    };

    return this;
  }

  /**
   * Adds a tradeoff response to the form data
   * Uses immutable operations to ensure data integrity
   * 
   * @param scenario - The scenario presented
   * @param side - The side/option chosen
   * @param valueVar - The variable value
   * @param question - The tradeoff question
   * @param valueFixed - The fixed comparison value
   * @throws Error if validation fails
   * @returns The FormBuilder instance for method chaining
   */
  addTradeoff(
    scenario: string,
    side: string,
    valueVar: number,
    question: string,
    valueFixed: number
  ): FormBuilder {
    const tradeoff: TradeoffResponse = {
      scenario,
      side,
      valueVar,
      question,
      valueFixed,
    };

    const validation = this.validateTradeoff(tradeoff);
    if (!validation.valid) {
      throw new Error(`Invalid tradeoff: ${validation.error}`);
    }

    // Immutable update using spread operator
    this.formData = {
      ...this.formData,
      tradeoffs: [...this.formData.tradeoffs, tradeoff],
    };

    return this;
  }

  /**
   * Retrieves the complete form data
   * Returns a deep copy to prevent external mutations
   * 
   * @returns A copy of the complete FormData object
   */
  getFormData(): FormData {
    return {
      responses: [...this.formData.responses],
      tradeoffs: [...this.formData.tradeoffs],
    };
  }

  /**
   * Resets the form data to an empty state
   * 
   * @returns The FormBuilder instance for method chaining
   */
  resetForm(): FormBuilder {
    this.formData = this.initializeForm();
    return this;
  }

  /**
   * Gets the number of regular responses
   * 
   * @returns The count of regular responses
   */
  getResponseCount(): number {
    return this.formData.responses.length;
  }

  /**
   * Gets the number of tradeoff responses
   * 
   * @returns The count of tradeoff responses
   */
  getTradeoffCount(): number {
    return this.formData.tradeoffs.length;
  }

  /**
   * Checks if the form has any data
   * 
   * @returns True if the form has any responses or tradeoffs
   */
  hasData(): boolean {
    return this.formData.responses.length > 0 || this.formData.tradeoffs.length > 0;
  }
}
