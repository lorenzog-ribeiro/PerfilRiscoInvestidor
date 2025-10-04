/**
 * Unit tests for FormBuilder class
 */

import { FormBuilder } from '../FormBuilder';
import { FormData } from '../types';

describe('FormBuilder', () => {
  let formBuilder: FormBuilder;

  beforeEach(() => {
    formBuilder = new FormBuilder();
  });

  describe('Initialization', () => {
    it('should initialize with empty form data', () => {
      const formData = formBuilder.getFormData();
      expect(formData.responses).toEqual([]);
      expect(formData.tradeoffs).toEqual([]);
    });

    it('should return false for hasData() when initialized', () => {
      expect(formBuilder.hasData()).toBe(false);
    });

    it('should return 0 for response and tradeoff counts when initialized', () => {
      expect(formBuilder.getResponseCount()).toBe(0);
      expect(formBuilder.getTradeoffCount()).toBe(0);
    });
  });

  describe('addResponse', () => {
    it('should add a response with string choice', () => {
      formBuilder.addResponse('yes', 'Do you agree?');
      const formData = formBuilder.getFormData();
      
      expect(formData.responses).toHaveLength(1);
      expect(formData.responses[0]).toEqual({
        choice: 'yes',
        label: 'Do you agree?',
      });
    });

    it('should add a response with number choice', () => {
      formBuilder.addResponse(25, 'What is your age?');
      const formData = formBuilder.getFormData();
      
      expect(formData.responses).toHaveLength(1);
      expect(formData.responses[0]).toEqual({
        choice: 25,
        label: 'What is your age?',
      });
    });

    it('should add a response with boolean choice', () => {
      formBuilder.addResponse(true, 'Do you accept?');
      const formData = formBuilder.getFormData();
      
      expect(formData.responses).toHaveLength(1);
      expect(formData.responses[0]).toEqual({
        choice: true,
        label: 'Do you accept?',
      });
    });

    it('should add multiple responses without losing previous data', () => {
      formBuilder.addResponse('yes', 'Question 1');
      formBuilder.addResponse(42, 'Question 2');
      formBuilder.addResponse(false, 'Question 3');
      
      const formData = formBuilder.getFormData();
      expect(formData.responses).toHaveLength(3);
      expect(formData.responses[0].label).toBe('Question 1');
      expect(formData.responses[1].label).toBe('Question 2');
      expect(formData.responses[2].label).toBe('Question 3');
    });

    it('should throw error for null choice', () => {
      expect(() => {
        formBuilder.addResponse(null as any, 'Question');
      }).toThrow('Invalid response: Choice cannot be null or undefined');
    });

    it('should throw error for undefined choice', () => {
      expect(() => {
        formBuilder.addResponse(undefined as any, 'Question');
      }).toThrow('Invalid response: Choice cannot be null or undefined');
    });

    it('should throw error for empty label', () => {
      expect(() => {
        formBuilder.addResponse('yes', '');
      }).toThrow('Invalid response: Label must be a non-empty string');
    });

    it('should throw error for whitespace-only label', () => {
      expect(() => {
        formBuilder.addResponse('yes', '   ');
      }).toThrow('Invalid response: Label must be a non-empty string');
    });

    it('should support method chaining', () => {
      const result = formBuilder
        .addResponse('yes', 'Question 1')
        .addResponse(42, 'Question 2');
      
      expect(result).toBe(formBuilder);
      expect(formBuilder.getResponseCount()).toBe(2);
    });
  });

  describe('addTradeoff', () => {
    it('should add a tradeoff response', () => {
      formBuilder.addTradeoff('Scenario A vs B', 'A', 100, 'Which do you prefer?', 50);
      const formData = formBuilder.getFormData();
      
      expect(formData.tradeoffs).toHaveLength(1);
      expect(formData.tradeoffs[0]).toEqual({
        scenario: 'Scenario A vs B',
        side: 'A',
        valueVar: 100,
        question: 'Which do you prefer?',
        valueFixed: 50,
      });
    });

    it('should add multiple tradeoffs without losing previous data', () => {
      formBuilder.addTradeoff('Scenario 1', 'A', 100, 'Question 1', 50);
      formBuilder.addTradeoff('Scenario 2', 'B', 200, 'Question 2', 75);
      
      const formData = formBuilder.getFormData();
      expect(formData.tradeoffs).toHaveLength(2);
      expect(formData.tradeoffs[0].scenario).toBe('Scenario 1');
      expect(formData.tradeoffs[1].scenario).toBe('Scenario 2');
    });

    it('should throw error for empty scenario', () => {
      expect(() => {
        formBuilder.addTradeoff('', 'A', 100, 'Question', 50);
      }).toThrow('Invalid tradeoff: Scenario must be a non-empty string');
    });

    it('should throw error for empty side', () => {
      expect(() => {
        formBuilder.addTradeoff('Scenario', '', 100, 'Question', 50);
      }).toThrow('Invalid tradeoff: Side must be a non-empty string');
    });

    it('should throw error for invalid valueVar', () => {
      expect(() => {
        formBuilder.addTradeoff('Scenario', 'A', NaN, 'Question', 50);
      }).toThrow('Invalid tradeoff: ValueVar must be a valid number');
    });

    it('should throw error for empty question', () => {
      expect(() => {
        formBuilder.addTradeoff('Scenario', 'A', 100, '', 50);
      }).toThrow('Invalid tradeoff: Question must be a non-empty string');
    });

    it('should throw error for invalid valueFixed', () => {
      expect(() => {
        formBuilder.addTradeoff('Scenario', 'A', 100, 'Question', NaN);
      }).toThrow('Invalid tradeoff: ValueFixed must be a valid number');
    });

    it('should support method chaining', () => {
      const result = formBuilder
        .addTradeoff('Scenario 1', 'A', 100, 'Question 1', 50)
        .addTradeoff('Scenario 2', 'B', 200, 'Question 2', 75);
      
      expect(result).toBe(formBuilder);
      expect(formBuilder.getTradeoffCount()).toBe(2);
    });
  });

  describe('Mixed operations', () => {
    it('should maintain both responses and tradeoffs', () => {
      formBuilder.addResponse('yes', 'Question 1');
      formBuilder.addTradeoff('Scenario A', 'A', 100, 'Tradeoff 1', 50);
      formBuilder.addResponse(42, 'Question 2');
      formBuilder.addTradeoff('Scenario B', 'B', 200, 'Tradeoff 2', 75);
      
      const formData = formBuilder.getFormData();
      expect(formData.responses).toHaveLength(2);
      expect(formData.tradeoffs).toHaveLength(2);
    });

    it('should support chaining mixed operations', () => {
      formBuilder
        .addResponse('yes', 'Question')
        .addTradeoff('Scenario', 'A', 100, 'Tradeoff', 50)
        .addResponse(42, 'Another question');
      
      expect(formBuilder.getResponseCount()).toBe(2);
      expect(formBuilder.getTradeoffCount()).toBe(1);
    });
  });

  describe('getFormData', () => {
    it('should return a copy of the form data', () => {
      formBuilder.addResponse('yes', 'Question');
      const formData1 = formBuilder.getFormData();
      const formData2 = formBuilder.getFormData();
      
      expect(formData1).toEqual(formData2);
      expect(formData1).not.toBe(formData2);
    });

    it('should prevent external mutations', () => {
      formBuilder.addResponse('yes', 'Question');
      const formData = formBuilder.getFormData();
      
      formData.responses.push({ choice: 'no', label: 'Hacked' });
      
      const newFormData = formBuilder.getFormData();
      expect(newFormData.responses).toHaveLength(1);
    });
  });

  describe('resetForm', () => {
    it('should clear all data', () => {
      formBuilder.addResponse('yes', 'Question');
      formBuilder.addTradeoff('Scenario', 'A', 100, 'Tradeoff', 50);
      
      formBuilder.resetForm();
      
      const formData = formBuilder.getFormData();
      expect(formData.responses).toEqual([]);
      expect(formData.tradeoffs).toEqual([]);
    });

    it('should support method chaining', () => {
      const result = formBuilder.resetForm();
      expect(result).toBe(formBuilder);
    });

    it('should allow adding data after reset', () => {
      formBuilder.addResponse('yes', 'Question 1');
      formBuilder.resetForm();
      formBuilder.addResponse('no', 'Question 2');
      
      const formData = formBuilder.getFormData();
      expect(formData.responses).toHaveLength(1);
      expect(formData.responses[0].choice).toBe('no');
    });
  });

  describe('hasData', () => {
    it('should return true when has responses', () => {
      formBuilder.addResponse('yes', 'Question');
      expect(formBuilder.hasData()).toBe(true);
    });

    it('should return true when has tradeoffs', () => {
      formBuilder.addTradeoff('Scenario', 'A', 100, 'Tradeoff', 50);
      expect(formBuilder.hasData()).toBe(true);
    });

    it('should return false after reset', () => {
      formBuilder.addResponse('yes', 'Question');
      formBuilder.resetForm();
      expect(formBuilder.hasData()).toBe(false);
    });
  });

  describe('Immutability', () => {
    it('should not mutate the original data when adding responses', () => {
      const formData1 = formBuilder.getFormData();
      formBuilder.addResponse('yes', 'Question');
      
      expect(formData1.responses).toEqual([]);
    });

    it('should maintain immutability across multiple operations', () => {
      const snapshots: FormData[] = [];
      
      snapshots.push(formBuilder.getFormData());
      formBuilder.addResponse('yes', 'Q1');
      
      snapshots.push(formBuilder.getFormData());
      formBuilder.addResponse('no', 'Q2');
      
      snapshots.push(formBuilder.getFormData());
      
      expect(snapshots[0].responses).toHaveLength(0);
      expect(snapshots[1].responses).toHaveLength(1);
      expect(snapshots[2].responses).toHaveLength(2);
    });
  });
});
