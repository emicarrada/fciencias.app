/**
 * Abstract Handler for Chain of Responsibility pattern
 * Follows OCP: Open for extension, closed for modification
 */

import { ValidationContext, ValidationResult } from './types';

export abstract class ValidationHandler {
  protected nextHandler: ValidationHandler | null = null;

  /**
   * Set the next handler in the chain
   */
  public setNext(handler: ValidationHandler): ValidationHandler {
    this.nextHandler = handler;
    return handler;
  }

  /**
   * Handle the validation request
   * If this handler passes, delegate to next handler in chain
   */
  public handle(context: ValidationContext): ValidationResult {
    const result = this.validate(context);
    
    if (!result.isValid) {
      return result;
    }

    // If valid and there's a next handler, continue the chain
    if (this.nextHandler) {
      return this.nextHandler.handle(context);
    }

    // All validations passed
    return { isValid: true };
  }

  /**
   * Abstract method to be implemented by concrete validators
   */
  protected abstract validate(context: ValidationContext): ValidationResult;
}
