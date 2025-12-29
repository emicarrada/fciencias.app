/**
 * Concrete Validator: Authentication
 * Validates that user is authenticated and exists
 */

import { ValidationHandler } from '../ValidationHandler';
import { ValidationContext, ValidationResult } from '../types';

export class AuthenticationValidator extends ValidationHandler {
  protected validate(context: ValidationContext): ValidationResult {
    if (!context.authToken) {
      return {
        isValid: false,
        error: 'No autenticado',
        statusCode: 401,
      };
    }

    if (!context.user) {
      return {
        isValid: false,
        error: 'Usuario no encontrado',
        statusCode: 404,
      };
    }

    return { isValid: true };
  }
}
