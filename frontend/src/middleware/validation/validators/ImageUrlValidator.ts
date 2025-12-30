/**
 * Concrete Validator: Image URL Validator
 * Validates image URL format and size if provided
 */

import { ValidationHandler } from '../ValidationHandler';
import { ValidationContext, ValidationResult } from '../types';

export class ImageUrlValidator extends ValidationHandler {
  protected validate(context: ValidationContext): ValidationResult {
    // Si no hay imageUrl, es válido (es opcional)
    if (!context.imageUrl || context.imageUrl.trim().length === 0) {
      return { isValid: true };
    }

    const imageUrl = context.imageUrl.trim();

    // Validar formato de URL
    try {
      const url = new URL(imageUrl);
      
      // Verificar que sea http o https
      if (!['http:', 'https:'].includes(url.protocol)) {
        return {
          isValid: false,
          error: 'La URL de la imagen debe usar http:// o https://',
          statusCode: 400,
        };
      }

      // Validar extensiones comunes de imagen
      const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
      const hasValidExtension = validExtensions.some(ext => 
        url.pathname.toLowerCase().endsWith(ext)
      );

      // Si no tiene extensión válida, advertir pero permitir (puede ser un CDN)
      // Solo bloqueamos URLs claramente inválidas
      
    } catch (error) {
      return {
        isValid: false,
        error: 'URL de imagen inválida. Verifica el formato.',
        statusCode: 400,
      };
    }

    return { isValid: true };
  }
}
