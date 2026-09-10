import { describe, it, expect } from 'vitest';
import {
  hexToRgb,
  getRelativeLuminance,
  getContrastRatio,
  hexToLab,
  getLStar,
  getDeltaLStar,
  getDeltaE,
  checkWcagCompliance,
} from './colorUtils';

describe('CIELab & WCAG Hex Parsing and Relative Luminance', () => {
  it('parses 3-digit and 6-digit hex colors correctly', () => {
    expect(hexToRgb('#fff')).toEqual({ r: 255, g: 255, b: 255 });
    expect(hexToRgb('#000')).toEqual({ r: 0, g: 0, b: 0 });
    expect(hexToRgb('#268bd2')).toEqual({ r: 38, g: 139, b: 210 });
    expect(hexToRgb('268bd2')).toEqual({ r: 38, g: 139, b: 210 });
  });

  it('parses 8-digit hex colors (ignoring alpha channel for rgb)', () => {
    expect(hexToRgb('#268bd2ff')).toEqual({ r: 38, g: 139, b: 210 });
  });

  it('throws on invalid hex formats', () => {
    expect(() => hexToRgb('#xyz')).toThrow('Invalid hex color characters');
    expect(() => hexToRgb('#12345')).toThrow('Invalid hex color string');
  });

  it('computes exact relative luminance for black and white', () => {
    expect(getRelativeLuminance('#000000')).toBe(0);
    expect(getRelativeLuminance('#ffffff')).toBe(1);
  });

  it('computes maximum 21:1 contrast for black on white', () => {
    const ratio = getContrastRatio('#000000', '#ffffff');
    expect(ratio).toBe(21);
  });

  it('computes 1:1 contrast for identical colors', () => {
    const ratio = getContrastRatio('#268bd2', '#268bd2');
    expect(ratio).toBe(1);
  });
});

describe('CIE L*a*b* Perceptual Lightness & WCAG Evaluation', () => {
  it('produces L* = 0 for black and L* = 100 for white', () => {
    expect(getLStar('#000000')).toBe(0);
    expect(getLStar('#ffffff')).toBe(100);
  });

  it('calculates accurate CIE L* for solarized colors', () => {
    const labBase03 = hexToLab('#002b36');
    expect(labBase03.l).toBeGreaterThan(15);
    expect(labBase03.l).toBeLessThan(20);

    const labBase3 = hexToLab('#fdf6e3');
    expect(labBase3.l).toBeGreaterThan(95);
    expect(labBase3.l).toBeLessThan(98);
  });

  it('computes Delta L* (perceptual lightness difference)', () => {
    const deltaL = getDeltaLStar('#000000', '#ffffff');
    expect(deltaL).toBe(100);

    // Solarized Base03 vs Base3
    const solarizedDeltaL = getDeltaLStar('#002b36', '#fdf6e3');
    expect(solarizedDeltaL).toBeGreaterThan(75);
  });

  it('computes Delta E* 76 color distance', () => {
    const deltaE = getDeltaE('#ff0000', '#00ff00');
    expect(deltaE).toBeGreaterThan(100);
  });

  it('evaluates high-contrast dark mode pairs as AA and AAA compliant', () => {
    // White text on dark base03 background (#002b36)
    const res = checkWcagCompliance('#fdf6e3', '#002b36');
    expect(res.contrastRatio).toBeGreaterThan(10);
    expect(res.deltaLStar).toBeGreaterThan(70);
    expect(res.isAANormal).toBe(true);
    expect(res.isAALarge).toBe(true);
    expect(res.isAAANormal).toBe(true);
    expect(res.isAAALarge).toBe(true);
  });

  it('flags low contrast pairs correctly', () => {
    // Low contrast: gray on slightly lighter gray
    const res = checkWcagCompliance('#657b83', '#586e75');
    expect(res.contrastRatio).toBeLessThan(3.0);
    expect(res.isAANormal).toBe(false);
    expect(res.isAALarge).toBe(false);
  });
});
