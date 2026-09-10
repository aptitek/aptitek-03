/**
 * Material Design 3 Typography & Recursive Variable Font Tokens
 *
 * Single Source of Truth for:
 * 1. Font families (brand, mono, display, mrz, logo, icons)
 * 2. Recursive Variable Font Axes (MONO, CASL, wght, slnt, CRSV)
 * 3. Semantic Recursive Presets (casual default, linear contrast, mono, casualMono, semiMono)
 * 4. OpenType Font Features (tnum, zero, dlig, etc.)
 * 5. Material Design 3 Type Scale Tokens (15 standard roles)
 */

export const FONT_FAMILIES = {
  brand: '"Recursive", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  mono: '"Recursive", "JetBrains Mono", "Fira Code", SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  display: '"Recursive", sans-serif',
  mrz: '"OCR-B", "Recursive", "Courier New", Courier, monospace',
  logo: '"Milkshake", cursive, sans-serif',
  icons: '"Material Symbols Rounded", sans-serif',
} as const;

export type FontFamilyRole = keyof typeof FONT_FAMILIES;

export interface RecursiveAxisValues {
  mono?: number; // 0 (Sans/Proportional) -> 1 (Monospace)
  casl?: number; // 0 (Linear Sans) -> 1 (Casual Sans)
  wght?: number; // 300 (Light) -> 1000 (Black)
  slnt?: number; // -15 (Italic/Slanted) -> 0 (Upright)
  crsv?: number; // 0 (Off), 0.5 (Auto), 1 (On)
}

export const RECURSIVE_AXES = {
  MONO: { min: 0, max: 1, default: 0 },
  CASL: { min: 0, max: 1, default: 1 },
  wght: { min: 300, max: 1000, default: 400 },
  slnt: { min: -15, max: 0, default: 0 },
  CRSV: { min: 0, max: 1, default: 0.5 },
} as const;

export function formatFontVariation(axes: RecursiveAxisValues): string {
  const parts: string[] = [];
  if (axes.casl !== undefined) parts.push(`'CASL' ${axes.casl}`);
  if (axes.mono !== undefined) parts.push(`'MONO' ${axes.mono}`);
  if (axes.wght !== undefined) parts.push(`'wght' ${axes.wght}`);
  if (axes.slnt !== undefined) parts.push(`'slnt' ${axes.slnt}`);
  if (axes.crsv !== undefined) parts.push(`'CRSV' ${axes.crsv}`);
  return parts.join(', ');
}

/**
 * Pre-configured Recursive semantic presets
 * Default brand tone: Casual (warm, friendly, soft, matching our rounded shape engine)
 * Contrast tone: Linear (formal, technical, dense)
 * Code / data tone: Mono & CasualMono
 */
export const RECURSIVE_PRESETS = {
  casual: "'CASL' 1, 'MONO' 0, 'slnt' 0, 'CRSV' 0.5",
  casualBold: "'CASL' 1, 'MONO' 0, 'wght' 700, 'slnt' 0, 'CRSV' 0.5",
  casualSlanted: "'CASL' 1, 'MONO' 0, 'slnt' -15, 'CRSV' 1",
  linear: "'CASL' 0, 'MONO' 0, 'slnt' 0, 'CRSV' 0",
  linearBold: "'CASL' 0, 'MONO' 0, 'wght' 700, 'slnt' 0, 'CRSV' 0",
  linearSlanted: "'CASL' 0, 'MONO' 0, 'slnt' -15, 'CRSV' 0",
  mono: "'CASL' 0, 'MONO' 1, 'slnt' 0, 'CRSV' 0",
  casualMono: "'CASL' 1, 'MONO' 1, 'slnt' 0, 'CRSV' 0.5",
  semiMono: "'CASL' 0, 'MONO' 0.5, 'slnt' 0, 'CRSV' 0",
} as const;

export type RecursivePresetName = keyof typeof RECURSIVE_PRESETS;

export const FONT_FEATURES = {
  tabularNumbers: "'tnum' 1",
  slashedZero: "'zero' 1",
  codeLigatures: "'dlig' 1",
  tabularTechnical: "'tnum' 1, 'zero' 1",
  normal: 'normal',
} as const;

export type FontFeatureName = keyof typeof FONT_FEATURES;

export type M3TypeScaleRole =
  | 'displayLarge'
  | 'displayMedium'
  | 'displaySmall'
  | 'headlineLarge'
  | 'headlineMedium'
  | 'headlineSmall'
  | 'titleLarge'
  | 'titleMedium'
  | 'titleSmall'
  | 'bodyLarge'
  | 'bodyMedium'
  | 'bodySmall'
  | 'labelLarge'
  | 'labelMedium'
  | 'labelSmall';

export interface M3TypeTokenDefinition {
  fontFamily: string;
  fontSize: string;
  fontSizeRem: string;
  fontSizePx: number;
  lineHeight: string | number;
  lineHeightPx: number;
  fontWeight: number;
  letterSpacing: string;
  letterSpacingPx: number;
  fontVariationSettings: string;
  textTransform?: 'none' | 'uppercase' | 'capitalize' | 'lowercase';
}

/**
 * 15 Material Design 3 Type Scale Tokens adapted to Recursive
 */
export const M3_TYPESCALE: Record<M3TypeScaleRole, M3TypeTokenDefinition> = {
  displayLarge: {
    fontFamily: FONT_FAMILIES.brand,
    fontSize: '3.5625rem',
    fontSizeRem: '3.5625rem',
    fontSizePx: 57,
    lineHeight: '4rem',
    lineHeightPx: 64,
    fontWeight: 400,
    letterSpacing: '-0.015em',
    letterSpacingPx: -0.25,
    fontVariationSettings: RECURSIVE_PRESETS.casual,
  },
  displayMedium: {
    fontFamily: FONT_FAMILIES.brand,
    fontSize: '2.8125rem',
    fontSizeRem: '2.8125rem',
    fontSizePx: 45,
    lineHeight: '3.25rem',
    lineHeightPx: 52,
    fontWeight: 400,
    letterSpacing: '0em',
    letterSpacingPx: 0,
    fontVariationSettings: RECURSIVE_PRESETS.casual,
  },
  displaySmall: {
    fontFamily: FONT_FAMILIES.brand,
    fontSize: '2.25rem',
    fontSizeRem: '2.25rem',
    fontSizePx: 36,
    lineHeight: '2.75rem',
    lineHeightPx: 44,
    fontWeight: 400,
    letterSpacing: '0em',
    letterSpacingPx: 0,
    fontVariationSettings: RECURSIVE_PRESETS.casual,
  },
  headlineLarge: {
    fontFamily: FONT_FAMILIES.brand,
    fontSize: '2rem',
    fontSizeRem: '2rem',
    fontSizePx: 32,
    lineHeight: '2.5rem',
    lineHeightPx: 40,
    fontWeight: 500,
    letterSpacing: '0em',
    letterSpacingPx: 0,
    fontVariationSettings: RECURSIVE_PRESETS.casual,
  },
  headlineMedium: {
    fontFamily: FONT_FAMILIES.brand,
    fontSize: '1.75rem',
    fontSizeRem: '1.75rem',
    fontSizePx: 28,
    lineHeight: '2.25rem',
    lineHeightPx: 36,
    fontWeight: 500,
    letterSpacing: '0em',
    letterSpacingPx: 0,
    fontVariationSettings: RECURSIVE_PRESETS.casual,
  },
  headlineSmall: {
    fontFamily: FONT_FAMILIES.brand,
    fontSize: '1.5rem',
    fontSizeRem: '1.5rem',
    fontSizePx: 24,
    lineHeight: '2rem',
    lineHeightPx: 32,
    fontWeight: 500,
    letterSpacing: '0em',
    letterSpacingPx: 0,
    fontVariationSettings: RECURSIVE_PRESETS.casual,
  },
  titleLarge: {
    fontFamily: FONT_FAMILIES.brand,
    fontSize: '1.375rem',
    fontSizeRem: '1.375rem',
    fontSizePx: 22,
    lineHeight: '1.75rem',
    lineHeightPx: 28,
    fontWeight: 600,
    letterSpacing: '0em',
    letterSpacingPx: 0,
    fontVariationSettings: RECURSIVE_PRESETS.casual,
  },
  titleMedium: {
    fontFamily: FONT_FAMILIES.brand,
    fontSize: '1rem',
    fontSizeRem: '1rem',
    fontSizePx: 16,
    lineHeight: '1.5rem',
    lineHeightPx: 24,
    fontWeight: 600,
    letterSpacing: '0.01em',
    letterSpacingPx: 0.15,
    fontVariationSettings: RECURSIVE_PRESETS.casual,
  },
  titleSmall: {
    fontFamily: FONT_FAMILIES.brand,
    fontSize: '0.875rem',
    fontSizeRem: '0.875rem',
    fontSizePx: 14,
    lineHeight: '1.25rem',
    lineHeightPx: 20,
    fontWeight: 600,
    letterSpacing: '0.01em',
    letterSpacingPx: 0.1,
    fontVariationSettings: RECURSIVE_PRESETS.casual,
  },
  bodyLarge: {
    fontFamily: FONT_FAMILIES.brand,
    fontSize: '1rem',
    fontSizeRem: '1rem',
    fontSizePx: 16,
    lineHeight: '1.5rem',
    lineHeightPx: 24,
    fontWeight: 400,
    letterSpacing: '0.03em',
    letterSpacingPx: 0.5,
    fontVariationSettings: RECURSIVE_PRESETS.casual,
  },
  bodyMedium: {
    fontFamily: FONT_FAMILIES.brand,
    fontSize: '0.875rem',
    fontSizeRem: '0.875rem',
    fontSizePx: 14,
    lineHeight: '1.25rem',
    lineHeightPx: 20,
    fontWeight: 400,
    letterSpacing: '0.015em',
    letterSpacingPx: 0.25,
    fontVariationSettings: RECURSIVE_PRESETS.casual,
  },
  bodySmall: {
    fontFamily: FONT_FAMILIES.brand,
    fontSize: '0.75rem',
    fontSizeRem: '0.75rem',
    fontSizePx: 12,
    lineHeight: '1rem',
    lineHeightPx: 16,
    fontWeight: 400,
    letterSpacing: '0.03em',
    letterSpacingPx: 0.4,
    fontVariationSettings: RECURSIVE_PRESETS.casual,
  },
  labelLarge: {
    fontFamily: FONT_FAMILIES.brand,
    fontSize: '0.875rem',
    fontSizeRem: '0.875rem',
    fontSizePx: 14,
    lineHeight: '1.25rem',
    lineHeightPx: 20,
    fontWeight: 600,
    letterSpacing: '0.01em',
    letterSpacingPx: 0.1,
    fontVariationSettings: RECURSIVE_PRESETS.casual,
  },
  labelMedium: {
    fontFamily: FONT_FAMILIES.brand,
    fontSize: '0.75rem',
    fontSizeRem: '0.75rem',
    fontSizePx: 12,
    lineHeight: '1rem',
    lineHeightPx: 16,
    fontWeight: 600,
    letterSpacing: '0.04em',
    letterSpacingPx: 0.5,
    fontVariationSettings: RECURSIVE_PRESETS.casual,
  },
  labelSmall: {
    fontFamily: FONT_FAMILIES.brand,
    fontSize: '0.6875rem',
    fontSizeRem: '0.6875rem',
    fontSizePx: 11,
    lineHeight: '1rem',
    lineHeightPx: 16,
    fontWeight: 600,
    letterSpacing: '0.045em',
    letterSpacingPx: 0.5,
    fontVariationSettings: RECURSIVE_PRESETS.casual,
  },
};

/**
 * Resolves a typography style object adapted to a specific Recursive variation
 * (e.g. casual brand default vs linear contrast vs technical mono).
 */
export function resolveM3Typography(
  role: M3TypeScaleRole,
  variation: 'casual' | 'linear' | 'mono' | 'casualMono' = 'casual',
): {
  fontFamily: string;
  fontSize: string;
  lineHeight: string | number;
  fontWeight: number;
  letterSpacing: string;
  fontVariationSettings: string;
} {
  const token = M3_TYPESCALE[role];
  const family =
    variation === 'mono' || variation === 'casualMono' ? FONT_FAMILIES.mono : FONT_FAMILIES.brand;
  const variationSetting = RECURSIVE_PRESETS[variation];

  return {
    fontFamily: family,
    fontSize: token.fontSize,
    lineHeight: token.lineHeight,
    fontWeight: token.fontWeight,
    letterSpacing: token.letterSpacing,
    fontVariationSettings: variationSetting,
  };
}

export const APPROVED_FONT_SIZE_PIXELS = new Set([
  8, 10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24, 26, 28, 32, 36, 40, 44, 45, 48, 57, 64,
]);

export const APPROVED_FONT_SIZE_REMS = new Set([
  '0.625rem',
  '0.65rem',
  '0.68rem',
  '0.6875rem',
  '0.7rem',
  '0.71875rem',
  '0.72rem',
  '0.75rem',
  '0.775rem',
  '0.78rem',
  '0.78125rem',
  '0.8rem',
  '0.8125rem',
  '0.82rem',
  '0.825rem',
  '0.84375rem',
  '0.85rem',
  '0.875rem',
  '0.9rem',
  '0.925rem',
  '0.95rem',
  '1rem',
  '1.05rem',
  '1.1rem',
  '1.125rem',
  '1.15rem',
  '1.2rem',
  '1.25rem',
  '1.35rem',
  '1.375rem',
  '1.5rem',
  '1.6rem',
  '1.65rem',
  '1.75rem',
  '2rem',
  '2.25rem',
  '2.5rem',
  '2.8125rem',
  '3rem',
  '3.5625rem',
  '4rem',
]);
