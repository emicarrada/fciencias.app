import {
  validateEmail,
  validatePassword,
  validateUsername,
  validatePostContent,
  sanitizeInput,
} from '@/lib/validators';

describe('Validators', () => {
  describe('validateEmail', () => {
    it('should validate correct email', () => {
      const result = validateEmail('test@example.com');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject empty email', () => {
      const result = validateEmail('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Email is required');
    });

    it('should reject email without @', () => {
      const result = validateEmail('testexample.com');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid email format');
    });

    it('should reject email without domain', () => {
      const result = validateEmail('test@');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid email format');
    });

    it('should reject email without TLD', () => {
      const result = validateEmail('test@example');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid email format');
    });

    it('should accept email with subdomain', () => {
      const result = validateEmail('test@mail.example.com');
      expect(result.valid).toBe(true);
    });

    it('should accept email with plus sign', () => {
      const result = validateEmail('test+tag@example.com');
      expect(result.valid).toBe(true);
    });
  });

  describe('validatePassword', () => {
    it('should validate correct password', () => {
      const result = validatePassword('password123');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject empty password', () => {
      const result = validatePassword('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Password is required');
    });

    it('should reject password shorter than 6 characters', () => {
      const result = validatePassword('12345');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('at least 6 characters');
    });

    it('should accept password exactly 6 characters', () => {
      const result = validatePassword('123456');
      expect(result.valid).toBe(true);
    });

    it('should reject password longer than 100 characters', () => {
      const result = validatePassword('a'.repeat(101));
      expect(result.valid).toBe(false);
      expect(result.error).toContain('less than 100 characters');
    });

    it('should accept password with special characters', () => {
      const result = validatePassword('P@ssw0rd!');
      expect(result.valid).toBe(true);
    });
  });

  describe('validateUsername', () => {
    it('should validate correct username', () => {
      const result = validateUsername('john_doe');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject empty username', () => {
      const result = validateUsername('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Username is required');
    });

    it('should reject username shorter than 3 characters', () => {
      const result = validateUsername('ab');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('at least 3 characters');
    });

    it('should reject username longer than 20 characters', () => {
      const result = validateUsername('a'.repeat(21));
      expect(result.valid).toBe(false);
      expect(result.error).toContain('less than 20 characters');
    });

    it('should reject username with spaces', () => {
      const result = validateUsername('john doe');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('letters, numbers, underscores and hyphens');
    });

    it('should reject username with special characters', () => {
      const result = validateUsername('john@doe');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('letters, numbers, underscores and hyphens');
    });

    it('should accept username with underscores', () => {
      const result = validateUsername('john_doe');
      expect(result.valid).toBe(true);
    });

    it('should accept username with hyphens', () => {
      const result = validateUsername('john-doe');
      expect(result.valid).toBe(true);
    });

    it('should accept username with numbers', () => {
      const result = validateUsername('john123');
      expect(result.valid).toBe(true);
    });

    it('should accept alphanumeric username', () => {
      const result = validateUsername('JohnDoe123');
      expect(result.valid).toBe(true);
    });
  });

  describe('validatePostContent', () => {
    it('should validate correct post content', () => {
      const result = validatePostContent('This is a valid post');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject empty content', () => {
      const result = validatePostContent('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Post content cannot be empty');
    });

    it('should reject content with only whitespace', () => {
      const result = validatePostContent('   ');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Post content cannot be empty');
    });

    it('should accept content with exactly 1 character', () => {
      const result = validatePostContent('a');
      expect(result.valid).toBe(true);
    });

    it('should reject content exceeding 5000 characters', () => {
      const result = validatePostContent('a'.repeat(5001));
      expect(result.valid).toBe(false);
      expect(result.error).toContain('cannot exceed 5000 characters');
    });

    it('should accept content with exactly 5000 characters', () => {
      const result = validatePostContent('a'.repeat(5000));
      expect(result.valid).toBe(true);
    });

    it('should accept content with newlines', () => {
      const result = validatePostContent('Line 1\nLine 2\nLine 3');
      expect(result.valid).toBe(true);
    });

    it('should accept content with emojis', () => {
      const result = validatePostContent('Hello 👋 World 🌍');
      expect(result.valid).toBe(true);
    });
  });

  describe('sanitizeInput', () => {
    it('should sanitize HTML tags', () => {
      const result = sanitizeInput('<script>alert("XSS")</script>');
      expect(result).not.toContain('<script>');
      expect(result).toContain('&lt;script&gt;');
    });

    it('should sanitize quotes', () => {
      const result = sanitizeInput('He said "Hello"');
      expect(result).toContain('&quot;');
    });

    it('should sanitize single quotes', () => {
      const result = sanitizeInput("It's");
      expect(result).toContain('&#x27;');
    });

    it('should sanitize forward slashes', () => {
      const result = sanitizeInput('</div>');
      expect(result).toContain('&#x2F;');
    });

    it('should return empty string for empty input', () => {
      const result = sanitizeInput('');
      expect(result).toBe('');
    });

    it('should not modify safe text', () => {
      const result = sanitizeInput('This is safe text');
      expect(result).toBe('This is safe text');
    });

    it('should handle complex XSS attempts', () => {
      const result = sanitizeInput('<img src="x" onerror="alert(1)">');
      expect(result).not.toContain('<img');
      expect(result).toContain('&lt;img');
      expect(result).toContain('&quot;');
      // Note: attribute names like "onerror" are not sanitized, only special chars
    });
  });
});
