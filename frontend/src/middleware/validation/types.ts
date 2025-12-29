/**
 * Types for Chain of Responsibility validation pattern
 * Extracted to follow Open/Closed Principle (OCP)
 */

import { User } from '@prisma/client';

export interface ValidationContext {
  content?: string;
  imageUrl?: string;
  isAnonymous?: boolean;
  user?: User | null;
  authToken?: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  statusCode?: number;
  additionalData?: Record<string, any>;
}
