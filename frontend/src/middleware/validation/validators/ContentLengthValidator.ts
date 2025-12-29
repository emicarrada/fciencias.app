/**
 * Concrete Validator: Content Length
 * Validates that content does not exceed maximum length
 */

import { ValidationHandler } from '../ValidationHandler';
import { ValidationContext, ValidationResult } from '../types';

const MAX_CONTENT_LENGTH = 5000;

export class ContentLengthValidator extends ValidationHandler {
  protected validate(context: ValidationContext): ValidationResult {
    if (context.content && context.content.length > MAX_CONTENT_LENGTH) {
      return {
        isValid: false,
        error: `El contenido no puede exceder ${MAX_CONTENT_LENGTH} caracteres`,
        statusCode: 400,
      };
    }

    return { isValid: true };
  }
}
