/**
 * Material Design 3 Spacing, Dimensions & Line Thickness (Stroke) Engine
 *
 * Implements:
 * 1. M3 8dp baseline spacing grid with granular half-steps (2dp, 4dp, 6dp, 10dp, 12dp, 20dp).
 * 2. DesignForDucks "Spacing Friendship" semantic scale (Inseparable -> Strangers).
 * 3. M3 Stroke / Line Thickness scale (hairline, thin, medium, thick, heavy, expressive).
 * 4. Standard UI Dimension tokens (touch targets, icon sizes, component heights, avatar diameters).
 */

/**
 * Material Design 3 Numeric Spacing Scale (dp / px).
 * Rooted in the 8dp grid system with granular half-steps for component ergonomics.
 */
export const M3_SPACINGS = {
  none: 0,
  hairline: 2, // 0.25x
  micro: 4, // 0.5x  (Inseparable)
  compactHalf: 6, // 0.75x
  compact: 8, // 1.0x  (Best Friends)
  mediumHalf: 10, // 1.25x
  medium: 12, // 1.5x
  standard: 16, // 2.0x  (Friends)
  largeHalf: 20, // 2.5x
  large: 24, // 3.0x  (Grouping / Gutters)
  extraLarge: 32, // 4.0x  (Casual Friends)
  sectionHalf: 40, // 5.0x
  extraExtraLarge: 48, // 6.0x  (Major Sections)
  hugeHalf: 56, // 7.0x
  huge: 64, // 8.0x  (Acquaintances)
  massive: 80, // 10.0x (Distant Acquaintances)
  macro: 96, // 12.0x
  giant: 120, // 15.0x (Strangers / Hero)
  jumbo: 160, // 20.0x
} as const;

export type M3SpacingToken = keyof typeof M3_SPACINGS;

/**
 * M3 CSS String Spacing Tokens.
 */
export const M3_SPACING_STRINGS: Record<M3SpacingToken, string> = {
  none: '0px',
  hairline: '2px',
  micro: '4px',
  compactHalf: '6px',
  compact: '8px',
  mediumHalf: '10px',
  medium: '12px',
  standard: '16px',
  largeHalf: '20px',
  large: '24px',
  extraLarge: '32px',
  sectionHalf: '40px',
  extraExtraLarge: '48px',
  hugeHalf: '56px',
  huge: '64px',
  massive: '80px',
  macro: '96px',
  giant: '120px',
  jumbo: '160px',
};

/**
 * DesignForDucks Spacing Friendship Semantic Hierarchy.
 * Maps relational proximity between UI elements to physical pixel spacing.
 * Reference: https://designforducks.com/ui-spacing-cheat-sheet-a-complete-guide-2/
 */
export const M3_SPACING_FRIENDSHIPS = {
  /** 4px: "I will die for you" - tightly coupled elements (icon + label, notification badge, indicator dot) */
  inseparable: 4,
  /** 8px: "Best Friends" - closely related content (title + subtitle, avatar + user name, chip internal padding, label + input) */
  bestFriends: 8,
  /** 16px: "Friends" - component elements (gap between form fields, intra-card element spacing, default container padding) */
  friends: 16,
  /** 24px: Cluster grouping (card internal padding, multi-column card gutters, toolbar spacing) */
  grouping: 24,
  /** 32px: "Casual Friends" - spacing between distinct groups or sections inside cards, drawers, and modal dialogs */
  casualFriends: 32,
  /** 48px: Major section spacing (between independent modules, modal header-to-body, dialog outer gaps) */
  sections: 48,
  /** 64px: "Acquaintances" - macro page section gaps (between distinct hero, features, and footer blocks) */
  acquaintances: 64,
  /** 80px: "Distant Acquaintances" - substantial layout breaks (marketing blocks, full-page chapter divides) */
  distantAcquaintances: 80,
  /** 120px: "Who are you?" / Strangers - macro layout boundaries (hero landing whitespace, major page transitions) */
  strangers: 120,
} as const;

export type SpacingFriendship = keyof typeof M3_SPACING_FRIENDSHIPS;

/**
 * Line Thickness / Stroke / Border Width Scale.
 * Provides consistent border weights from delicate hairline highlights to bold expressive contours.
 */
export const M3_STROKES = {
  /** 0px: Seamless borderless edge */
  none: 0,
  /** 0.5px: Retina hairline divider / subtle inner perimeter glow */
  hairline: 0.5,
  /** 1px: Standard M3 outline (cards, text fields, chips, dialogs, dividers) */
  thin: 1,
  /** 2px: Emphasized active state, selection border, high-contrast focus indicator */
  medium: 2,
  /** 3px: High-emphasis active tab indicator, selected card outline */
  thick: 3,
  /** 4px: Prominent accessibility focus outline, grab handles, callout accents */
  heavy: 4,
  /** 6px: Expressive framing or badge borders */
  expressive: 6,
} as const;

export type M3StrokeToken = keyof typeof M3_STROKES;

export const M3_STROKE_STRINGS: Record<M3StrokeToken, string> = {
  none: '0px',
  hairline: '0.5px',
  thin: '1px',
  medium: '2px',
  thick: '3px',
  heavy: '4px',
  expressive: '6px',
};

/**
 * Standard UI Dimensions (dp / px).
 * Tokenizes touch targets (WCAG / M3), icon dimensions, component heights, and avatar sizes.
 */
export const M3_DIMENSIONS = {
  // Touch Targets (WCAG 2.5.5 / M3)
  touchTarget: 48,
  touchTargetDense: 40,

  // Icon Dimensions
  iconSmall: 18,
  iconInline: 20,
  iconStandard: 24,
  iconLarge: 32,
  iconExtraLarge: 40,
  iconHuge: 48,

  // Component Heights
  chipHeight: 32,
  buttonSmall: 32,
  buttonMedium: 40,
  buttonLarge: 48,
  inputStandard: 56,
  headerHeight: 64,
  navigationBarHeight: 80,

  // Avatar Diameters
  avatarXs: 24,
  avatarSm: 32,
  avatarMd: 40,
  avatarLg: 48,
  avatarXl: 64,
  avatarHero: 96,
} as const;

export type M3DimensionToken = keyof typeof M3_DIMENSIONS;

/**
 * CSS Custom Property Mappings.
 */
export const M3_SPACING_CSS_VARIABLES = {
  none: 'var(--md-sys-spacing-none)',
  hairline: 'var(--md-sys-spacing-hairline)',
  micro: 'var(--md-sys-spacing-micro)',
  compactHalf: 'var(--md-sys-spacing-compact-half)',
  compact: 'var(--md-sys-spacing-compact)',
  mediumHalf: 'var(--md-sys-spacing-medium-half)',
  medium: 'var(--md-sys-spacing-medium)',
  standard: 'var(--md-sys-spacing-standard)',
  largeHalf: 'var(--md-sys-spacing-large-half)',
  large: 'var(--md-sys-spacing-large)',
  extraLarge: 'var(--md-sys-spacing-extra-large)',
  sectionHalf: 'var(--md-sys-spacing-section-half)',
  extraExtraLarge: 'var(--md-sys-spacing-extra-extra-large)',
  hugeHalf: 'var(--md-sys-spacing-huge-half)',
  huge: 'var(--md-sys-spacing-huge)',
  massive: 'var(--md-sys-spacing-massive)',
  macro: 'var(--md-sys-spacing-macro)',
  giant: 'var(--md-sys-spacing-giant)',
  jumbo: 'var(--md-sys-spacing-jumbo)',
  inseparable: 'var(--spacing-friendship-inseparable)',
  bestFriends: 'var(--spacing-friendship-best-friends)',
  friends: 'var(--spacing-friendship-friends)',
  casualFriends: 'var(--spacing-friendship-casual-friends)',
  acquaintances: 'var(--spacing-friendship-acquaintances)',
  distantAcquaintances: 'var(--spacing-friendship-distant-acquaintances)',
  strangers: 'var(--spacing-friendship-strangers)',
} as const;

export const M3_STROKE_CSS_VARIABLES = {
  none: 'var(--md-sys-stroke-none)',
  hairline: 'var(--md-sys-stroke-hairline)',
  thin: 'var(--md-sys-stroke-thin)',
  medium: 'var(--md-sys-stroke-medium)',
  thick: 'var(--md-sys-stroke-thick)',
  heavy: 'var(--md-sys-stroke-heavy)',
  expressive: 'var(--md-sys-stroke-expressive)',
} as const;

/**
 * Resolves an approved spacing value to its CSS pixel string.
 */
export function resolveM3Spacing(token: M3SpacingToken | SpacingFriendship): string {
  if (token in M3_SPACING_FRIENDSHIPS) {
    return `${M3_SPACING_FRIENDSHIPS[token as SpacingFriendship]}px`;
  }
  return M3_SPACING_STRINGS[token as M3SpacingToken] || '0px';
}

/**
 * Resolves an approved stroke value to its CSS pixel string.
 */
export function resolveM3Stroke(token: M3StrokeToken): string {
  return M3_STROKE_STRINGS[token] || '1px';
}
