/**
 * Concrete Validator: Content Required
 * Validates that content exists and is not empty
 */

import { ValidationHandler } from '../ValidationHandler';
import { ValidationContext, ValidationResult } from '../types';

export class ContentRequiredValidator extends ValidationHandler {
  protected validate(context: ValidationContext): ValidationResult {
    if (!context.content || context.content.trim().length === 0) {
      return {
        isValid: false,
        error: 'El contenido del post es requerido',
        statusCode: 400,
      };
    }

    return { isValid: true };
  }
}
