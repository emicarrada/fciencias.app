/**
 * Concrete Validator: Username Required
 * Validates that user has username when posting non-anonymously
 */

import { ValidationHandler } from '../ValidationHandler';
import { ValidationContext, ValidationResult } from '../types';

export class UsernameRequiredValidator extends ValidationHandler {
  protected validate(context: ValidationContext): ValidationResult {
    // Skip validation if posting anonymously
    if (context.isAnonymous) {
      return { isValid: true };
    }

    if (!context.user) {
      return {
        isValid: false,
        error: 'Usuario no encontrado',
        statusCode: 404,
      };
    }

    if (!context.user.username) {
      return {
        isValid: false,
        error: '👤 Configura tu nombre de usuario para publicar. Así la comunidad podrá reconocerte y seguir tus aportes.',
        statusCode: 403,
        additionalData: {
          requiresUsername: true,
        },
      };
    }

    return { isValid: true };
  }
}
