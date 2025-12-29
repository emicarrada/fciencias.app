/**
 * ValidationChain: Orchestrator for Chain of Responsibility
 * Builds and executes the validation chain
 * Follows OCP: New validators can be added without modifying existing code
 */

import { ValidationHandler } from './ValidationHandler';
import { ValidationContext, ValidationResult } from './types';
import { ContentRequiredValidator } from './validators/ContentRequiredValidator';
import { ContentLengthValidator } from './validators/ContentLengthValidator';
import { AuthenticationValidator } from './validators/AuthenticationValidator';
import { EmailVerificationValidator } from './validators/EmailVerificationValidator';
import { UsernameRequiredValidator } from './validators/UsernameRequiredValidator';

export class ValidationChain {
  private chain: ValidationHandler;

  constructor() {
    // Build the chain: each validator is linked to the next
    const contentRequired = new ContentRequiredValidator();
    const contentLength = new ContentLengthValidator();
    const authentication = new AuthenticationValidator();
    const emailVerification = new EmailVerificationValidator();
    const usernameRequired = new UsernameRequiredValidator();

    // Chain them together
    contentRequired
      .setNext(contentLength)
      .setNext(authentication)
      .setNext(emailVerification)
      .setNext(usernameRequired);

    this.chain = contentRequired;
  }

  /**
   * Execute the validation chain
   */
  public validate(context: ValidationContext): ValidationResult {
    return this.chain.handle(context);
  }
}

/**
 * Factory function to create and execute validation chain
 */
export function validateCreatePost(context: ValidationContext): ValidationResult {
  const validationChain = new ValidationChain();
  return validationChain.validate(context);
}
