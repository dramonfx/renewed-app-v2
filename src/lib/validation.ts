/**
 * Comprehensive Input Validation and Sanitization Utilities
 * 
 * Provides secure, reusable validation patterns for the Sacred Journey application.
 * Focuses on preventing XSS, injection attacks, and ensuring data integrity.
 */

import { z } from 'zod';

// Email validation regex (RFC 5322 compliant)
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Password strength validation
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

// URL validation regex
const URL_REGEX = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

// HTML/XSS prevention patterns
const HTML_TAGS_REGEX = /<[^>]*>/g;
const SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
const JAVASCRIPT_PROTOCOL_REGEX = /javascript:/gi;

/**
 * Validation error types
 */
export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
}

export interface ValidationResult<T = any> {
  isValid: boolean;
  data?: T;
  errors: ValidationError[];
}

/**
 * Input sanitization options
 */
export interface SanitizeOptions {
  allowHtml?: boolean;
  allowLinks?: boolean;
  maxLength?: number;
  trim?: boolean;
  removeExtraSpaces?: boolean;
}

/**
 * Core validation functions
 */
export class Validator {
  /**
   * Validate email address
   */
  static email(email: string): ValidationResult<string> {
    const trimmed = email.trim().toLowerCase();
    
    if (!trimmed) {
      return {
        isValid: false,
        errors: [{ field: 'email', message: 'Email is required', code: 'REQUIRED' }]
      };
    }

    if (!EMAIL_REGEX.test(trimmed)) {
      return {
        isValid: false,
        errors: [{ field: 'email', message: 'Please enter a valid email address', code: 'INVALID_FORMAT' }]
      };
    }

    if (trimmed.length > 254) {
      return {
        isValid: false,
        errors: [{ field: 'email', message: 'Email address is too long', code: 'TOO_LONG' }]
      };
    }

    return { isValid: true, data: trimmed, errors: [] };
  }

  /**
   * Validate password strength
   */
  static password(password: string): ValidationResult<string> {
    const errors: ValidationError[] = [];

    if (!password) {
      return {
        isValid: false,
        errors: [{ field: 'password', message: 'Password is required', code: 'REQUIRED' }]
      };
    }

    if (password.length < PASSWORD_MIN_LENGTH) {
      errors.push({
        field: 'password',
        message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`,
        code: 'TOO_SHORT'
      });
    }

    if (password.length > 128) {
      errors.push({
        field: 'password',
        message: 'Password is too long (max 128 characters)',
        code: 'TOO_LONG'
      });
    }

    if (!/[a-z]/.test(password)) {
      errors.push({
        field: 'password',
        message: 'Password must contain at least one lowercase letter',
        code: 'MISSING_LOWERCASE'
      });
    }

    if (!/[A-Z]/.test(password)) {
      errors.push({
        field: 'password',
        message: 'Password must contain at least one uppercase letter',
        code: 'MISSING_UPPERCASE'
      });
    }

    if (!/\d/.test(password)) {
      errors.push({
        field: 'password',
        message: 'Password must contain at least one number',
        code: 'MISSING_NUMBER'
      });
    }

    if (!/[@$!%*?&]/.test(password)) {
      errors.push({
        field: 'password',
        message: 'Password must contain at least one special character (@$!%*?&)',
        code: 'MISSING_SPECIAL'
      });
    }

    // Check for common weak patterns
    const commonPasswords = ['password', '123456', 'qwerty', 'abc123', 'password123'];
    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push({
        field: 'password',
        message: 'This password is too common. Please choose a stronger password.',
        code: 'TOO_COMMON'
      });
    }

    return {
      isValid: errors.length === 0,
      data: errors.length === 0 ? password : undefined,
      errors
    };
  }

  /**
   * Validate URL
   */
  static url(url: string): ValidationResult<string> {
    const trimmed = url.trim();

    if (!trimmed) {
      return {
        isValid: false,
        errors: [{ field: 'url', message: 'URL is required', code: 'REQUIRED' }]
      };
    }

    if (!URL_REGEX.test(trimmed)) {
      return {
        isValid: false,
        errors: [{ field: 'url', message: 'Please enter a valid URL', code: 'INVALID_FORMAT' }]
      };
    }

    return { isValid: true, data: trimmed, errors: [] };
  }

  /**
   * Validate text input with length constraints
   */
  static text(
    text: string, 
    options: { 
      minLength?: number; 
      maxLength?: number; 
      required?: boolean;
      fieldName?: string;
    } = {}
  ): ValidationResult<string> {
    const { minLength = 0, maxLength = 1000, required = false, fieldName = 'text' } = options;
    const trimmed = text?.trim() || '';

    if (required && !trimmed) {
      return {
        isValid: false,
        errors: [{ field: fieldName, message: `${fieldName} is required`, code: 'REQUIRED' }]
      };
    }

    if (trimmed.length < minLength) {
      return {
        isValid: false,
        errors: [{
          field: fieldName,
          message: `${fieldName} must be at least ${minLength} characters long`,
          code: 'TOO_SHORT'
        }]
      };
    }

    if (trimmed.length > maxLength) {
      return {
        isValid: false,
        errors: [{
          field: fieldName,
          message: `${fieldName} must be no more than ${maxLength} characters long`,
          code: 'TOO_LONG'
        }]
      };
    }

    return { isValid: true, data: trimmed, errors: [] };
  }

  /**
   * Validate numeric input
   */
  static number(
    value: any,
    options: {
      min?: number;
      max?: number;
      integer?: boolean;
      required?: boolean;
      fieldName?: string;
    } = {}
  ): ValidationResult<number> {
    const { min, max, integer = false, required = false, fieldName = 'number' } = options;

    if (required && (value === null || value === undefined || value === '')) {
      return {
        isValid: false,
        errors: [{ field: fieldName, message: `${fieldName} is required`, code: 'REQUIRED' }]
      };
    }

    const num = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(num)) {
      return {
        isValid: false,
        errors: [{ field: fieldName, message: `${fieldName} must be a valid number`, code: 'INVALID_NUMBER' }]
      };
    }

    if (integer && !Number.isInteger(num)) {
      return {
        isValid: false,
        errors: [{ field: fieldName, message: `${fieldName} must be a whole number`, code: 'NOT_INTEGER' }]
      };
    }

    if (min !== undefined && num < min) {
      return {
        isValid: false,
        errors: [{
          field: fieldName,
          message: `${fieldName} must be at least ${min}`,
          code: 'TOO_SMALL'
        }]
      };
    }

    if (max !== undefined && num > max) {
      return {
        isValid: false,
        errors: [{
          field: fieldName,
          message: `${fieldName} must be no more than ${max}`,
          code: 'TOO_LARGE'
        }]
      };
    }

    return { isValid: true, data: num, errors: [] };
  }
}

/**
 * Input sanitization functions
 */
export class Sanitizer {
  /**
   * Remove HTML tags and potential XSS vectors
   */
  static removeHtml(input: string): string {
    return input
      .replace(HTML_TAGS_REGEX, '')
      .replace(SCRIPT_REGEX, '')
      .replace(JAVASCRIPT_PROTOCOL_REGEX, '');
  }

  /**
   * Sanitize text input with various options
   */
  static text(input: string, options: SanitizeOptions = {}): string {
    const {
      allowHtml = false,
      allowLinks = false,
      maxLength,
      trim = true,
      removeExtraSpaces = true
    } = options;

    let sanitized = input;

    // Basic trimming
    if (trim) {
      sanitized = sanitized.trim();
    }

    // Remove extra whitespace
    if (removeExtraSpaces) {
      sanitized = sanitized.replace(/\s+/g, ' ');
    }

    // Remove HTML if not allowed
    if (!allowHtml) {
      sanitized = this.removeHtml(sanitized);
    }

    // Remove links if not allowed
    if (!allowLinks) {
      sanitized = sanitized.replace(URL_REGEX, '[URL removed]');
    }

    // Truncate if max length specified
    if (maxLength && sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength);
    }

    return sanitized;
  }

  /**
   * Sanitize HTML content (for rich text editors)
   */
  static html(input: string): string {
    // Allow only safe HTML tags
    const allowedTags = ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    const allowedAttributes = ['href', 'target', 'rel'];

    // This is a simplified sanitizer - in production, consider using DOMPurify
    let sanitized = input;

    // Remove script tags
    sanitized = sanitized.replace(SCRIPT_REGEX, '');

    // Remove javascript: protocols
    sanitized = sanitized.replace(JAVASCRIPT_PROTOCOL_REGEX, '');

    // Remove event handlers (onclick, onload, etc.)
    sanitized = sanitized.replace(/\son\w+\s*=\s*"[^"]*"/gi, '');
    sanitized = sanitized.replace(/\son\w+\s*=\s*'[^']*'/gi, '');

    return sanitized;
  }

  /**
   * Sanitize filename for safe storage
   */
  static filename(filename: string): string {
    return filename
      .trim()
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/_{2,}/g, '_')
      .substring(0, 255);
  }

  /**
   * Sanitize database input to prevent SQL injection
   */
  static sqlString(input: string): string {
    return input
      .replace(/'/g, "''")
      .replace(/;/g, '')
      .replace(/--/g, '')
      .replace(/\/\*/g, '')
      .replace(/\*\//g, '');
  }
}

/**
 * Zod schemas for common validation patterns
 */
export const schemas = {
  email: z.string().email('Please enter a valid email address').max(254, 'Email is too long'),
  
  password: z.string()
    .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`)
    .max(128, 'Password is too long')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[@$!%*?&]/, 'Password must contain at least one special character'),

  url: z.string().url('Please enter a valid URL'),

  journalTitle: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title is too long')
    .transform(val => Sanitizer.text(val, { maxLength: 200 })),

  journalContent: z.string()
    .min(1, 'Content is required')
    .max(10000, 'Content is too long')
    .transform(val => Sanitizer.text(val, { maxLength: 10000 })),

  mindset: z.enum(['natural', 'transition', 'spiritual'], {
    errorMap: () => ({ message: 'Please select a valid mindset' })
  }),

  tags: z.array(z.string().max(50, 'Tag is too long')).max(10, 'Too many tags'),

  userProfile: z.object({
    fullName: z.string()
      .min(1, 'Name is required')
      .max(100, 'Name is too long')
      .transform(val => Sanitizer.text(val, { maxLength: 100 })),
    email: z.string().email('Please enter a valid email address'),
    spiritualJourneyStage: z.enum(['seeker', 'learner', 'practitioner', 'teacher']).optional()
  }),

  apiKey: z.string()
    .min(10, 'API key is too short')
    .max(200, 'API key is too long')
    .regex(/^[a-zA-Z0-9_-]+$/, 'API key contains invalid characters')
};

/**
 * Form validation utilities
 */
export class FormValidator {
  /**
   * Validate an entire form object
   */
  static validateForm<T extends Record<string, any>>(
    data: T,
    schema: z.ZodSchema<T>
  ): ValidationResult<T> {
    try {
      const validatedData = schema.parse(data);
      return {
        isValid: true,
        data: validatedData,
        errors: []
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: ValidationError[] = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
          value: err.path.reduce((obj, key) => obj?.[key], data)
        }));

        return {
          isValid: false,
          errors
        };
      }

      return {
        isValid: false,
        errors: [{
          field: 'form',
          message: 'Validation failed',
          code: 'VALIDATION_ERROR'
        }]
      };
    }
  }

  /**
   * Validate individual field with real-time feedback
   */
  static validateField<T>(
    value: T,
    schema: z.ZodSchema<T>,
    fieldName: string
  ): ValidationResult<T> {
    try {
      const validatedValue = schema.parse(value);
      return {
        isValid: true,
        data: validatedValue,
        errors: []
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: ValidationError[] = error.errors.map(err => ({
          field: fieldName,
          message: err.message,
          code: err.code,
          value
        }));

        return {
          isValid: false,
          errors
        };
      }

      return {
        isValid: false,
        errors: [{
          field: fieldName,
          message: 'Validation failed',
          code: 'VALIDATION_ERROR'
        }]
      };
    }
  }
}

/**
 * Security utilities
 */
export class SecurityUtils {
  /**
   * Generate a secure random token
   */
  static generateToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  }

  /**
   * Check if string contains potential XSS vectors
   */
  static containsXSS(input: string): boolean {
    const xssPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe/i,
      /<object/i,
      /<embed/i,
      /expression\s*\(/i
    ];

    return xssPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Check if string contains potential SQL injection vectors
   */
  static containsSQLInjection(input: string): boolean {
    const sqlPatterns = [
      /('|(\\'))|(;|\\;)|(--)|\(\*\)|(\/\*)|\(\*\/\)/i,
      /(union|select|insert|update|delete|drop|create|alter|exec|execute)\s/i,
      /\b(or|and)\s+(1=1|true|false)\b/i
    ];

    return sqlPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Rate limiting check (simple in-memory implementation)
   */
  private static rateLimitStore = new Map<string, { count: number; resetTime: number }>();

  static checkRateLimit(identifier: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now();
    const record = this.rateLimitStore.get(identifier);

    if (!record || now > record.resetTime) {
      this.rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (record.count >= maxRequests) {
      return false;
    }

    record.count++;
    return true;
  }
}

// Export convenience functions
export const validate = Validator;
export const sanitize = Sanitizer;
export const security = SecurityUtils;

// Export additional types for external use
export type {
  ValidationError as ValidError,
  ValidationResult as ValidResult,
  SanitizeOptions as SanitizeOpts
};