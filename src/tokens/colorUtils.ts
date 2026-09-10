/**
 * Perceptual Color Science & CIELab Contrast Utilities
 *
 * Implements CIE XYZ, CIE L*a*b* (perceptual lightness L* from 0 to 100),
 * CIELab delta L* (tone difference), delta E* 76, and WCAG 2.1 relative luminance
 * contrast calculations.
 *
 * Grounded in Material Design 3 Color System (HCT tone) & WCAG 2.1 specifications:
 * - ΔL* >= 40 corresponds to WCAG AA for large text & UI components (>= 3:1)
 * - ΔL* >= 50 corresponds to WCAG AA for normal text (>= 4.5:1)
 * - ΔL* >= 70 corresponds to WCAG AAA for normal text (>= 7:1)
 */

export interface RgbColor {
  r: number; // 0..255
  g: number; // 0..255
  b: number; // 0..255
}

export interface LabColor {
  l: number; // 0..100 (perceptual lightness / tone)
  a: number; // -128..127 (green - red)
  b: number; // -128..127 (blue - yellow)
}

export interface WcagComplianceResult {
  contrastRatio: number;
  deltaLStar: number;
  isAANormal: boolean;
  isAALarge: boolean;
  isAAANormal: boolean;
  isAAALarge: boolean;
}

/**
 * Standard D65 CIE Reference White Point
 */
const D65_XN = 0.95047;
const D65_YN = 1.0;
const D65_ZN = 1.08883;

/**
 * Parses hex string (3, 4, 6, or 8 characters with optional #) to RGB components.
 */
export function hexToRgb(hex: string): RgbColor {
  const cleanHex = hex.replace(/^#/, '').trim();

  let r: number;
  let g: number;
  let b: number;

  if (cleanHex.length === 3 || cleanHex.length === 4) {
    const c0 = cleanHex.charAt(0);
    const c1 = cleanHex.charAt(1);
    const c2 = cleanHex.charAt(2);
    r = parseInt(c0 + c0, 16);
    g = parseInt(c1 + c1, 16);
    b = parseInt(c2 + c2, 16);
  } else if (cleanHex.length === 6 || cleanHex.length === 8) {
    r = parseInt(cleanHex.slice(0, 2), 16);
    g = parseInt(cleanHex.slice(2, 4), 16);
    b = parseInt(cleanHex.slice(4, 6), 16);
  } else {
    throw new Error(`Invalid hex color string: "${hex}"`);
  }

  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
    throw new Error(`Invalid hex color characters in: "${hex}"`);
  }

  return { r, g, b };
}

/**
 * Converts sRGB channel (0..255) to linear sRGB (0..1).
 */
export function sRgbChannelToLinear(channel: number): number {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/**
 * Computes WCAG 2.1 relative luminance Y (0..1) from an RGB color.
 * Standard formula: Y = 0.2126 * R_lin + 0.7152 * G_lin + 0.0722 * B_lin
 */
export function getRelativeLuminance(color: string | RgbColor): number {
  const rgb = typeof color === 'string' ? hexToRgb(color) : color;
  const rLin = sRgbChannelToLinear(rgb.r);
  const gLin = sRgbChannelToLinear(rgb.g);
  const bLin = sRgbChannelToLinear(rgb.b);

  return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
}

/**
 * Computes WCAG 2.1 contrast ratio between two colors (1:1 to 21:1).
 */
export function getContrastRatio(
  foreground: string | RgbColor,
  background: string | RgbColor,
): number {
  const y1 = getRelativeLuminance(foreground);
  const y2 = getRelativeLuminance(background);

  const lighter = Math.max(y1, y2);
  const darker = Math.min(y1, y2);

  const ratio = (lighter + 0.05) / (darker + 0.05);
  return Math.round(ratio * 100) / 100;
}

/**
 * Converts sRGB color to CIE XYZ (standard D65 illuminant).
 */
export function rgbToXyz(rgb: RgbColor): { x: number; y: number; z: number } {
  const rLin = sRgbChannelToLinear(rgb.r);
  const gLin = sRgbChannelToLinear(rgb.g);
  const bLin = sRgbChannelToLinear(rgb.b);

  const x = rLin * 0.4124564 + gLin * 0.3575761 + bLin * 0.1804375;
  const y = rLin * 0.2126729 + gLin * 0.7151522 + bLin * 0.072175;
  const z = rLin * 0.0193339 + gLin * 0.119192 + bLin * 0.9503041;

  return { x, y, z };
}

function fLab(t: number): number {
  const delta = 6 / 29;
  return t > delta * delta * delta ? Math.cbrt(t) : t / (3 * delta * delta) + 4 / 29;
}

/**
 * Converts sRGB or hex string to CIE L*a*b* coordinates.
 * L* represents perceptual lightness (0 = darkest black, 100 = brightest white).
 */
export function hexToLab(color: string | RgbColor): LabColor {
  const rgb = typeof color === 'string' ? hexToRgb(color) : color;
  const { x, y, z } = rgbToXyz(rgb);

  const xr = x / D65_XN;
  const yr = y / D65_YN;
  const zr = z / D65_ZN;

  const fx = fLab(xr);
  const fy = fLab(yr);
  const fz = fLab(zr);

  const l = 116 * fy - 16;
  const a = 500 * (fx - fy);
  const b = 200 * (fy - fz);

  return {
    l: Math.max(0, Math.min(100, Math.round(l * 100) / 100)),
    a: Math.round(a * 100) / 100,
    b: Math.round(b * 100) / 100,
  };
}

/**
 * Returns CIELab perceptual lightness L* (Tone 0 to 100).
 */
export function getLStar(color: string | RgbColor): number {
  return hexToLab(color).l;
}

/**
 * Returns absolute difference in CIELab lightness (|L*1 - L*2|).
 */
export function getDeltaLStar(color1: string | RgbColor, color2: string | RgbColor): number {
  const l1 = getLStar(color1);
  const l2 = getLStar(color2);
  return Math.round(Math.abs(l1 - l2) * 100) / 100;
}

/**
 * Computes CIE ΔE* 76 color difference between two colors.
 */
export function getDeltaE(color1: string | RgbColor, color2: string | RgbColor): number {
  const lab1 = hexToLab(color1);
  const lab2 = hexToLab(color2);

  const dl = lab1.l - lab2.l;
  const da = lab1.a - lab2.a;
  const db = lab1.b - lab2.b;

  return Math.round(Math.sqrt(dl * dl + da * da + db * db) * 100) / 100;
}

/**
 * Evaluates WCAG 2.1 compliance along with CIELab tone delta metrics.
 */
export function checkWcagCompliance(
  foreground: string | RgbColor,
  background: string | RgbColor,
): WcagComplianceResult {
  const contrastRatio = getContrastRatio(foreground, background);
  const deltaLStar = getDeltaLStar(foreground, background);

  return {
    contrastRatio,
    deltaLStar,
    isAANormal: contrastRatio >= 4.5,
    isAALarge: contrastRatio >= 3.0,
    isAAANormal: contrastRatio >= 7.0,
    isAAALarge: contrastRatio >= 4.5,
  };
}
