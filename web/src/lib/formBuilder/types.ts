/**
 * Type definitions for the dynamic form builder
 * 
 * This module defines the structure for form responses and tradeoff data
 * that will be collected from users and sent to the backend.
 */

/**
 * Represents a single form response from a regular question
 */
export interface FormResponse {
  /** The user's selected answer (can be string, number, or boolean) */
  choice: string | number | boolean;
  /** The label/description of the question */
  label: string;
}

/**
 * Represents a single tradeoff response
 */
export interface TradeoffResponse {
  /** The scenario presented to the user */
  scenario: string;
  /** The side/option chosen in the tradeoff (e.g., "A" or "B") */
  side: string;
  /** The variable value associated with the choice */
  valueVar: number;
  /** The tradeoff question text */
  question: string;
  /** The fixed value for comparison */
  valueFixed: number;
}

/**
 * Complete form data structure containing both regular responses and tradeoffs
 */
export interface FormData {
  /** Array of regular form responses */
  responses: FormResponse[];
  /** Array of tradeoff responses */
  tradeoffs: TradeoffResponse[];
}

/**
 * Validation result for form data
 */
export interface ValidationResult {
  /** Whether the validation passed */
  valid: boolean;
  /** Error message if validation failed */
  error?: string;
}
