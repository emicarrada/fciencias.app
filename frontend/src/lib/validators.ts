import { VALIDATION } from '@/lib/constants';

/**
 * Validates email format
 */
export function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email || !email.trim()) {
    return { valid: false, error: 'Email is required' };
  }

  if (!VALIDATION.EMAIL_REGEX.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }

  return { valid: true };
}

/**
 * Validates password strength
 */
export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password) {
    return { valid: false, error: 'Password is required' };
  }

  if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
    return {
      valid: false,
      error: `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`,
    };
  }

  if (password.length > VALIDATION.PASSWORD_MAX_LENGTH) {
    return {
      valid: false,
      error: `Password must be less than ${VALIDATION.PASSWORD_MAX_LENGTH} characters`,
    };
  }

  return { valid: true };
}

/**
 * Validates username format
 */
export function validateUsername(username: string): { valid: boolean; error?: string } {
  if (!username || !username.trim()) {
    return { valid: false, error: 'Username is required' };
  }

  if (username.length < VALIDATION.USERNAME_MIN_LENGTH) {
    return {
      valid: false,
      error: `Username must be at least ${VALIDATION.USERNAME_MIN_LENGTH} characters`,
    };
  }

  if (username.length > VALIDATION.USERNAME_MAX_LENGTH) {
    return {
      valid: false,
      error: `Username must be less than ${VALIDATION.USERNAME_MAX_LENGTH} characters`,
    };
  }

  if (!VALIDATION.USERNAME_REGEX.test(username)) {
    return {
      valid: false,
      error: 'Username can only contain letters, numbers, underscores and hyphens',
    };
  }

  return { valid: true };
}

/**
 * Validates post content
 */
export function validatePostContent(content: string): { valid: boolean; error?: string } {
  if (!content || !content.trim()) {
    return { valid: false, error: 'Post content cannot be empty' };
  }

  if (content.length < VALIDATION.POST_MIN_LENGTH) {
    return {
      valid: false,
      error: `Post must be at least ${VALIDATION.POST_MIN_LENGTH} character`,
    };
  }

  if (content.length > VALIDATION.POST_MAX_LENGTH) {
    return {
      valid: false,
      error: `Post cannot exceed ${VALIDATION.POST_MAX_LENGTH} characters`,
    };
  }

  return { valid: true };
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}
