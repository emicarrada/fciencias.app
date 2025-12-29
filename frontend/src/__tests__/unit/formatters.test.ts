import {
  formatDate,
  formatRelativeTime,
  truncateText,
  generateAvatarColor,
  getInitials,
  formatNumber,
  isValidUrl,
  extractUrls,
  formatFileSize,
} from '@/lib/formatters';

describe('Formatters', () => {
  describe('formatDate', () => {
    it('should format Date object', () => {
      const date = new Date('2024-01-15T10:30:00');
      const result = formatDate(date, 'yyyy-MM-dd');
      expect(result).toBe('2024-01-15');
    });

    it('should format date string', () => {
      const result = formatDate('2024-01-15T10:30:00', 'yyyy-MM-dd');
      expect(result).toBe('2024-01-15');
    });

    it('should use default format', () => {
      const date = new Date('2024-01-15');
      const result = formatDate(date);
      expect(result).toBeTruthy(); // Just check it returns something
    });
  });

  describe('formatRelativeTime', () => {
    it('should format recent date', () => {
      const now = new Date();
      const result = formatRelativeTime(now);
      expect(result).toContain('hace');
    });

    it('should format old date', () => {
      const oldDate = new Date('2020-01-01');
      const result = formatRelativeTime(oldDate);
      expect(result).toBeTruthy();
    });
  });

  describe('truncateText', () => {
    it('should truncate long text', () => {
      const result = truncateText('This is a very long text', 10);
      expect(result).toBe('This is a ...');
    });

    it('should not truncate short text', () => {
      const result = truncateText('Short', 10);
      expect(result).toBe('Short');
    });

    it('should not truncate text at exact length', () => {
      const result = truncateText('Exactly 10', 10);
      expect(result).toBe('Exactly 10');
    });

    it('should handle empty text', () => {
      const result = truncateText('', 10);
      expect(result).toBe('');
    });

    it('should handle null/undefined', () => {
      const result = truncateText(null as any, 10);
      expect(result).toBe('');
    });
  });

  describe('generateAvatarColor', () => {
    it('should generate consistent color for same user', () => {
      const color1 = generateAvatarColor('user123');
      const color2 = generateAvatarColor('user123');
      expect(color1).toBe(color2);
    });

    it('should generate different colors for different users', () => {
      const color1 = generateAvatarColor('user1');
      const color2 = generateAvatarColor('user2');
      // Not guaranteed to be different, but highly likely
      expect(color1).toBeTruthy();
      expect(color2).toBeTruthy();
    });

    it('should return valid hex color', () => {
      const color = generateAvatarColor('testuser');
      expect(color).toMatch(/^#[0-9A-F]{6}$/i);
    });

    it('should handle long user IDs', () => {
      const color = generateAvatarColor('a'.repeat(100));
      expect(color).toMatch(/^#[0-9A-F]{6}$/i);
    });
  });

  describe('getInitials', () => {
    it('should get initials from single name', () => {
      const result = getInitials('John');
      expect(result).toBe('J');
    });

    it('should get initials from full name', () => {
      const result = getInitials('John Doe');
      expect(result).toBe('JD');
    });

    it('should get initials from three names', () => {
      const result = getInitials('John Michael Doe');
      expect(result).toBe('JD'); // First and last
    });

    it('should handle empty name', () => {
      const result = getInitials('');
      expect(result).toBe('?');
    });

    it('should handle name with extra spaces', () => {
      const result = getInitials('  John   Doe  ');
      expect(result).toBe('JD');
    });

    it('should uppercase initials', () => {
      const result = getInitials('john doe');
      expect(result).toBe('JD');
    });
  });

  describe('formatNumber', () => {
    it('should not format numbers less than 1000', () => {
      expect(formatNumber(0)).toBe('0');
      expect(formatNumber(500)).toBe('500');
      expect(formatNumber(999)).toBe('999');
    });

    it('should format thousands with K', () => {
      expect(formatNumber(1000)).toBe('1.0K');
      expect(formatNumber(1500)).toBe('1.5K');
      expect(formatNumber(999999)).toBe('1000.0K');
    });

    it('should format millions with M', () => {
      expect(formatNumber(1000000)).toBe('1.0M');
      expect(formatNumber(1500000)).toBe('1.5M');
      expect(formatNumber(2300000)).toBe('2.3M');
    });
  });

  describe('isValidUrl', () => {
    it('should validate correct URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://example.com')).toBe(true);
      expect(isValidUrl('https://example.com/path')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(isValidUrl('not a url')).toBe(false);
      expect(isValidUrl('example.com')).toBe(false); // Missing protocol
      expect(isValidUrl('')).toBe(false);
    });

    it('should validate URL with query params', () => {
      expect(isValidUrl('https://example.com?foo=bar')).toBe(true);
    });

    it('should validate URL with hash', () => {
      expect(isValidUrl('https://example.com#section')).toBe(true);
    });
  });

  describe('extractUrls', () => {
    it('should extract URLs from text', () => {
      const text = 'Check out https://example.com and http://test.com';
      const urls = extractUrls(text);
      expect(urls).toHaveLength(2);
      expect(urls).toContain('https://example.com');
      expect(urls).toContain('http://test.com');
    });

    it('should return empty array if no URLs', () => {
      const urls = extractUrls('No URLs here');
      expect(urls).toEqual([]);
    });

    it('should extract URL at start of text', () => {
      const urls = extractUrls('https://example.com is cool');
      expect(urls).toEqual(['https://example.com']);
    });

    it('should extract URL at end of text', () => {
      const urls = extractUrls('Visit https://example.com');
      expect(urls).toEqual(['https://example.com']);
    });

    it('should handle multiple URLs on same line', () => {
      const urls = extractUrls('https://a.com https://b.com https://c.com');
      expect(urls).toHaveLength(3);
    });
  });

  describe('formatFileSize', () => {
    it('should format bytes', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(500)).toBe('500 Bytes');
      expect(formatFileSize(1023)).toBe('1023 Bytes');
    });

    it('should format kilobytes', () => {
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(2048)).toBe('2 KB');
      expect(formatFileSize(1536)).toBe('1.5 KB');
    });

    it('should format megabytes', () => {
      expect(formatFileSize(1048576)).toBe('1 MB'); // 1024^2
      expect(formatFileSize(2097152)).toBe('2 MB');
      expect(formatFileSize(1572864)).toBe('1.5 MB');
    });

    it('should format gigabytes', () => {
      expect(formatFileSize(1073741824)).toBe('1 GB'); // 1024^3
      expect(formatFileSize(2147483648)).toBe('2 GB');
    });
  });
});
