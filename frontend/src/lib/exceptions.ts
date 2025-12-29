/**
 * Custom Exception Classes for Design by Contract
 * Implementing defensive programming principles
 */

/**
 * Thrown when an argument provided to a method is invalid
 * Represents a PRECONDITION violation
 */
export class IllegalArgumentException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'IllegalArgumentException';
    
    // Maintain proper stack trace for where error was thrown (V8 only)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, IllegalArgumentException);
    }
  }
}

/**
 * Thrown when an object is in an inappropriate state for a method to be called
 * Represents an INVARIANT violation
 */
export class IllegalStateException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'IllegalStateException';
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, IllegalStateException);
    }
  }
}

/**
 * Thrown when a required operation is not supported
 * Used in abstract classes or interfaces
 */
export class UnsupportedOperationException extends Error {
  constructor(message: string = 'This operation is not supported') {
    super(message);
    this.name = 'UnsupportedOperationException';
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UnsupportedOperationException);
    }
  }
}

/**
 * Thrown when a resource is not found
 */
export class ResourceNotFoundException extends Error {
  constructor(resourceType: string, identifier: string) {
    super(`${resourceType} not found: ${identifier}`);
    this.name = 'ResourceNotFoundException';
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ResourceNotFoundException);
    }
  }
}
