/**
 * Concrete Validator: Email Verification
 * Validates that user's email is verified before posting
 */

import { ValidationHandler } from '../ValidationHandler';
import { ValidationContext, ValidationResult } from '../types';

export class EmailVerificationValidator extends ValidationHandler {
  protected validate(context: ValidationContext): ValidationResult {
    if (!context.user) {
      return {
        isValid: false,
        error: 'Usuario no encontrado',
        statusCode: 404,
      };
    }

    if (!context.user.isEmailVerified) {
      return {
        isValid: false,
        error: '📧 Verifica tu correo para participar. Esto nos ayuda a mantener una comunidad segura y auténtica.',
        statusCode: 403,
        additionalData: {
          requiresVerification: true,
        },
      };
    }

    return { isValid: true };
  }
}
