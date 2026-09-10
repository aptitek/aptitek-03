import { describe, expect, it } from 'vitest';

import { formatNumber, slugify, truncate } from './format';

describe('format utilities', () => {
  describe('slugify', () => {
    it('converts titles to url-friendly slugs', () => {
      expect(slugify('AptiTek Web Démo 2026!')).toBe('aptitek-web-demo-2026');
    });

    it('handles multiple spaces and dashes correctly', () => {
      expect(slugify('  hello --- world  ')).toBe('hello-world');
    });
  });

  describe('truncate', () => {
    it('returns original string when shorter than limit', () => {
      expect(truncate('Hello', 10)).toBe('Hello');
    });

    it('truncates and adds ellipsis when exceeding limit', () => {
      expect(truncate('Hello world this is a long text', 11)).toBe('Hello world...');
    });
  });

  describe('formatNumber', () => {
    it('formats number with space separator in fr-FR', () => {
      const formatted = formatNumber(1250000, 'fr-FR');
      // Normalize non-breaking space
      expect(formatted.replace(/\s/g, ' ')).toBe('1 250 000');
    });
  });
});
