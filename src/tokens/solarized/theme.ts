import { createTheme, type ThemeOptions } from '@mui/material/styles';
import {
  M3_EXPRESSIVE_CATALOG,
  M3_SCALE_RADIUS_MAP,
  M3_SHAPE_CORNERS,
  resolveM3ShapeStyle,
} from '../shapes.js';

import {
  ROLE_COLORS,
  CELESTIAL_COLORS,
  FLAG_COLORS,
  NAMED_COLORS,
} from './namedColors.js';
export {
  ROLE_COLORS,
  CELESTIAL_COLORS,
  EU_FLAG_COLORS,
  FRENCH_FLAG_COLORS,
  UK_FLAG_COLORS,
  FLAG_COLORS,
  NAMED_COLORS,
  PROGRESS_THEME_COLORS,
  SOLARIZED_CANONICAL,
  type NamedColors,
  type RoleColors,
  type CelestialColors,
  type FlagColors,
  type ProgressThemeColors,
  type SolarizedCanonical,
} from './namedColors.js';

import { m3SharedComponents } from './themeComponents.js';
export { m3SharedComponents } from './themeComponents.js';

import {
  createDarkHighlightShadows,
  createLightShadows,
  createDebugHighlightShadows,
} from '../shadows.js';
export {
  createDarkHighlightShadows,
  createLightShadows,
  createDebugHighlightShadows,
};

import {
  M3_MOTION,
  M3_SPRINGS,
  M3_MOTION_DURATIONS,
  M3_MOTION_EASINGS,
} from '../motion.js';
export { M3_MOTION, M3_SPRINGS, M3_MOTION_DURATIONS, M3_MOTION_EASINGS };

import {
  M3_SPACINGS,
  M3_SPACING_FRIENDSHIPS,
  M3_STROKES,
  M3_DIMENSIONS,
} from '../spacing.js';
export {
  M3_SPACINGS,
  M3_SPACING_STRINGS,
  M3_SPACING_FRIENDSHIPS,
  M3_STROKES,
  M3_STROKE_STRINGS,
  M3_DIMENSIONS,
  M3_SPACING_CSS_VARIABLES,
  M3_STROKE_CSS_VARIABLES,
  type M3SpacingToken,
  type SpacingFriendship,
  type M3StrokeToken,
  type M3DimensionToken,
} from '../spacing.js';

import {
  FONT_FAMILIES,
  RECURSIVE_PRESETS,
  FONT_FEATURES,
  M3_TYPESCALE,
  type M3TypeScaleRole,
} from '../typography.js';
export {
  FONT_FAMILIES,
  RECURSIVE_PRESETS,
  FONT_FEATURES,
  M3_TYPESCALE,
  type M3TypeScaleRole,
};

export interface ThemeRoleColors {
  student: string;
  instructor: string;
  admin: string;
  guest: string;
}

declare module '@mui/material/styles' {
  interface Palette {
    roles: ThemeRoleColors;
    celestial: typeof CELESTIAL_COLORS;
    flags: typeof FLAG_COLORS;
    surfaceContainerLowest: string;
    surfaceContainerLow: string;
    surfaceContainer: string;
    surfaceContainerHigh: string;
    surfaceContainerHighest: string;
    surfaceDim: string;
    surfaceBright: string;
    outlineVariant: string;
  }
  interface PaletteOptions {
    roles?: ThemeRoleColors;
    celestial?: typeof CELESTIAL_COLORS;
    flags?: typeof FLAG_COLORS;
    surfaceContainerLowest?: string;
    surfaceContainerLow?: string;
    surfaceContainer?: string;
    surfaceContainerHigh?: string;
    surfaceContainerHighest?: string;
    surfaceDim?: string;
    surfaceBright?: string;
    outlineVariant?: string;
  }
  interface Theme {
    named: typeof NAMED_COLORS;
    spacings: typeof M3_SPACINGS;
    friendships: typeof M3_SPACING_FRIENDSHIPS;
    strokes: typeof M3_STROKES;
    dimensions: typeof M3_DIMENSIONS;
    typographyTokens: typeof M3_TYPESCALE;
    fontFamilies: typeof FONT_FAMILIES;
    fontPresets: typeof RECURSIVE_PRESETS;
    fontFeatures: typeof FONT_FEATURES;
  }
  interface ThemeOptions {
    named?: typeof NAMED_COLORS;
    spacings?: typeof M3_SPACINGS;
    friendships?: typeof M3_SPACING_FRIENDSHIPS;
    strokes?: typeof M3_STROKES;
    dimensions?: typeof M3_DIMENSIONS;
    typographyTokens?: typeof M3_TYPESCALE;
    fontFamilies?: typeof FONT_FAMILIES;
    fontPresets?: typeof RECURSIVE_PRESETS;
    fontFeatures?: typeof FONT_FEATURES;
  }
  interface TypographyVariants {
    displayLarge: React.CSSProperties;
    displayMedium: React.CSSProperties;
    displaySmall: React.CSSProperties;
    headlineLarge: React.CSSProperties;
    headlineMedium: React.CSSProperties;
    headlineSmall: React.CSSProperties;
    titleLarge: React.CSSProperties;
    titleMedium: React.CSSProperties;
    titleSmall: React.CSSProperties;
    bodyLarge: React.CSSProperties;
    bodyMedium: React.CSSProperties;
    bodySmall: React.CSSProperties;
    labelLarge: React.CSSProperties;
    labelMedium: React.CSSProperties;
    labelSmall: React.CSSProperties;
  }
  interface TypographyVariantsOptions {
    displayLarge?: React.CSSProperties;
    displayMedium?: React.CSSProperties;
    displaySmall?: React.CSSProperties;
    headlineLarge?: React.CSSProperties;
    headlineMedium?: React.CSSProperties;
    headlineSmall?: React.CSSProperties;
    titleLarge?: React.CSSProperties;
    titleMedium?: React.CSSProperties;
    titleSmall?: React.CSSProperties;
    bodyLarge?: React.CSSProperties;
    bodyMedium?: React.CSSProperties;
    bodySmall?: React.CSSProperties;
    labelLarge?: React.CSSProperties;
    labelMedium?: React.CSSProperties;
    labelSmall?: React.CSSProperties;
  }
  interface Shape {
    borderRadius: number | string;
    corners: typeof M3_SHAPE_CORNERS;
    m3: typeof M3_EXPRESSIVE_CATALOG;
    scale: typeof M3_SCALE_RADIUS_MAP;
    resolve: typeof resolveM3ShapeStyle;
  }
  interface ShapeOptions {
    borderRadius?: number | string;
    corners?: typeof M3_SHAPE_CORNERS;
    m3?: typeof M3_EXPRESSIVE_CATALOG;
    scale?: typeof M3_SCALE_RADIUS_MAP;
    resolve?: typeof resolveM3ShapeStyle;
  }
}

export const M3_SHAPE_SCALE = M3_SHAPE_CORNERS;

export type M3ShapeToken = keyof typeof M3_SHAPE_SCALE;

/**
 * Shared base options across all themes: typography, shapes, transitions, and component overrides.
 */
export const sharedThemeBase = {
  named: NAMED_COLORS,
  spacings: M3_SPACINGS,
  friendships: M3_SPACING_FRIENDSHIPS,
  strokes: M3_STROKES,
  dimensions: M3_DIMENSIONS,
  typographyTokens: M3_TYPESCALE,
  fontFamilies: FONT_FAMILIES,
  fontPresets: RECURSIVE_PRESETS,
  fontFeatures: FONT_FEATURES,
  typography: {
    fontFamily: FONT_FAMILIES.brand,
    ...M3_TYPESCALE,
    h1: { fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.015em' },
    h3: { fontWeight: 600, letterSpacing: '-0.01em' },
    h4: { fontWeight: 600, letterSpacing: '-0.005em' },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { letterSpacing: '0.01em' },
    subtitle2: { letterSpacing: '0.01em' },
    body1: { letterSpacing: '0.01em', lineHeight: 1.6 },
    body2: { letterSpacing: '0.01em', lineHeight: 1.5 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: M3_SHAPE_CORNERS.largeIncreased,
    corners: M3_SHAPE_CORNERS,
    m3: M3_EXPRESSIVE_CATALOG,
    scale: M3_SCALE_RADIUS_MAP,
    resolve: resolveM3ShapeStyle,
  },
  transitions: {
    easing: {
      easeInOut: M3_MOTION.easing.standard,
      easeOut: M3_MOTION.easing.emphasizedDecelerate,
      easeIn: M3_MOTION.easing.emphasizedAccelerate,
      sharp: M3_MOTION.easing.standard,
    },
    duration: {
      shortest: M3_MOTION.duration.short3,
      shorter: M3_MOTION.duration.short4,
      short: M3_MOTION.duration.medium1,
      standard: M3_MOTION.duration.medium2,
      complex: M3_MOTION.duration.medium4,
      enteringScreen: M3_MOTION.duration.medium2,
      leavingScreen: M3_MOTION.duration.short4,
    },
  },
  components: m3SharedComponents,
};

/**
 * Solarized Dark Theme Options
 */
export const darkThemeOptions: ThemeOptions = {
  ...sharedThemeBase,
  shadows: createDarkHighlightShadows(),
  palette: {
    mode: 'dark',
    primary: {
      main: '#268bd2',
      light: '#2aa198',
      dark: '#1e6fa8',
      contrastText: '#fdf6e3',
    },
    secondary: {
      main: '#d33682',
      light: '#e0589c',
      dark: '#a82161',
      contrastText: '#fdf6e3',
    },
    error: {
      main: '#dc322f',
      light: '#e75856',
      dark: '#b02421',
      contrastText: '#fdf6e3',
    },
    warning: {
      main: '#b58900',
      light: '#d4a400',
      dark: '#8f6c00',
      contrastText: '#002b36',
    },
    info: {
      main: '#268bd2',
      light: '#2aa198',
      dark: '#1e6fa8',
      contrastText: '#fdf6e3',
    },
    success: {
      main: '#859900',
      light: '#a1b700',
      dark: '#687a00',
      contrastText: '#fdf6e3',
    },
    background: {
      default: '#002b36',
      paper: '#073642',
    },
    text: {
      primary: '#839496',
      secondary: '#586e75',
      disabled: '#073642',
    },
    divider: 'rgba(88, 110, 117, 0.25)',
    surfaceContainerLowest: '#001f27',
    surfaceContainerLow: '#002b36',
    surfaceContainer: '#073642',
    surfaceContainerHigh: '#0a4351',
    surfaceContainerHighest: '#0d5162',
    surfaceDim: '#002129',
    surfaceBright: '#073642',
    outlineVariant: 'rgba(88, 110, 117, 0.3)',
    roles: ROLE_COLORS,
    celestial: CELESTIAL_COLORS,
    flags: FLAG_COLORS,
    action: {
      active: '#93a1a1',
      hover: 'rgba(131, 148, 150, 0.08)',
      selected: 'rgba(131, 148, 150, 0.16)',
      disabled: 'rgba(88, 110, 117, 0.38)',
      disabledBackground: 'rgba(7, 54, 66, 0.5)',
      focus: 'rgba(38, 139, 210, 0.25)',
    },
  },
};

/**
 * Solarized Light Theme Options
 */
export const lightThemeOptions: ThemeOptions = {
  ...sharedThemeBase,
  shadows: createLightShadows(),
  palette: {
    mode: 'light',
    primary: {
      main: '#268bd2',
      light: '#2aa198',
      dark: '#1e6fa8',
      contrastText: '#fdf6e3',
    },
    secondary: {
      main: '#d33682',
      light: '#e0589c',
      dark: '#a82161',
      contrastText: '#fdf6e3',
    },
    error: {
      main: '#dc322f',
      light: '#e75856',
      dark: '#b02421',
      contrastText: '#fdf6e3',
    },
    warning: {
      main: '#b58900',
      light: '#d4a400',
      dark: '#8f6b00',
      contrastText: '#002b36',
    },
    info: {
      main: '#268bd2',
      light: '#2aa198',
      dark: '#1e6fa8',
      contrastText: '#fdf6e3',
    },
    success: {
      main: '#859900',
      light: '#9cb01f',
      dark: '#687500',
      contrastText: '#fdf6e3',
    },
    background: {
      default: '#fdf6e3',
      paper: '#eee8d5',
    },
    text: {
      primary: '#657b83',
      secondary: '#586e75',
      disabled: '#a0b0b5',
    },
    divider: 'rgba(88, 110, 117, 0.2)',
    surfaceContainerLowest: '#ffffff',
    surfaceContainerLow: '#fdf6e3',
    surfaceContainer: '#eee8d5',
    surfaceContainerHigh: '#e3ddca',
    surfaceContainerHighest: '#d8d1bc',
    surfaceDim: '#dfd8c4',
    surfaceBright: '#fffdf6',
    outlineVariant: 'rgba(88, 110, 117, 0.2)',
    roles: ROLE_COLORS,
    celestial: CELESTIAL_COLORS,
    flags: FLAG_COLORS,
    action: {
      hover: 'rgba(0, 43, 54, 0.04)',
      selected: 'rgba(0, 43, 54, 0.08)',
      disabled: 'rgba(0, 43, 54, 0.26)',
      disabledBackground: 'rgba(0, 43, 54, 0.12)',
    },
  },
};

export const DEBUG_ROLE_COLORS = {
  student: '#00ff66',
  instructor: '#00e5ff',
  admin: '#ff00aa',
  guest: '#a855f7',
} as const;

/**
 * Loud Neon Debug Theme Options (Used in Tests & Dev to Catch Unstyled Items)
 */
export const debugThemeOptions: ThemeOptions = {
  ...sharedThemeBase,
  shadows: createDebugHighlightShadows(),
  palette: {
    mode: 'dark',
    primary: {
      main: '#00ff66',
      light: '#55ff99',
      dark: '#00cc52',
      contrastText: '#000000',
    },
    secondary: {
      main: '#ff007f',
      light: '#ff66b2',
      dark: '#cc0066',
      contrastText: '#ffffff',
    },
    error: {
      main: '#ff2a00',
      light: '#ff6a4d',
      dark: '#cc2200',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#ffea00',
      light: '#fff15c',
      dark: '#cca000',
      contrastText: '#000000',
    },
    info: {
      main: '#00e5ff',
      light: '#80f2ff',
      dark: '#00b4cc',
      contrastText: '#000000',
    },
    success: {
      main: '#00ff66',
      light: '#55ff99',
      dark: '#00cc52',
      contrastText: '#000000',
    },
    background: {
      default: '#120024',
      paper: '#190033',
    },
    text: {
      primary: '#ffff00',
      secondary: '#00ffff',
      disabled: '#660099',
    },
    divider: 'rgba(255, 0, 170, 0.4)',
    surfaceContainerLowest: '#0a0014',
    surfaceContainerLow: '#15002b',
    surfaceContainer: '#200042',
    surfaceContainerHigh: '#2c0059',
    surfaceContainerHighest: '#3b0078',
    surfaceDim: '#0e001c',
    surfaceBright: '#30005a',
    outlineVariant: 'rgba(255, 0, 170, 0.4)',
    roles: DEBUG_ROLE_COLORS,
    celestial: CELESTIAL_COLORS,
    flags: FLAG_COLORS,
    action: {
      active: '#00ff66',
      hover: 'rgba(0, 255, 102, 0.12)',
      selected: 'rgba(0, 255, 102, 0.24)',
      disabled: 'rgba(255, 0, 128, 0.3)',
      disabledBackground: 'rgba(32, 0, 66, 0.6)',
      focus: 'rgba(0, 229, 255, 0.35)',
    },
  },
};

export const darkTheme = createTheme(darkThemeOptions);
export const lightTheme = createTheme(lightThemeOptions);
export const debugTheme = createTheme(debugThemeOptions);
export const appTheme = darkTheme;

// Explicit Solarized aliases
export const solarizedDarkTheme = darkTheme;
export const solarizedLightTheme = lightTheme;
export const solarizedTheme = {
  dark: darkTheme,
  light: lightTheme,
  debug: debugTheme,
} as const;

export type ThemeMode = 'dark' | 'light' | 'debug';

export function getThemeByMode(mode: ThemeMode) {
  if (mode === 'light') return lightTheme;
  if (mode === 'debug') return debugTheme;
  return darkTheme;
}
