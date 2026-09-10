// Role-specific named colors
export const ROLE_COLORS = {
  student: '#859900', // Green
  instructor: '#268bd2', // Blue
  admin: '#d33682', // Magenta
  guest: '#586e75', // Base01 Slate
} as const;

// Celestial / Astronomy named colors (Sun, Moon, Horizon)
export const CELESTIAL_COLORS = {
  sun: {
    main: '#b58900', // Amber / Gold
    glow: '#d4a400',
    light: '#fdf6e3',
  },
  moon: {
    main: '#268bd2', // Blue
    glow: '#6c71c4', // Violet
    crater: '#586e75',
  },
  horizon: {
    day: '#fdf6e3',
    night: '#002b36',
  },
} as const;

// Official Identity Card & National / International flag colors
export const EU_FLAG_COLORS = {
  blue: '#003399', // EU Reflex Blue field
  gold: '#ffcc00', // EU Yellow 12-stars circle & country code
} as const;

export const FRENCH_FLAG_COLORS = {
  blue: '#002654', // Official French Navy/Marianne Blue
  white: '#ffffff',
  red: '#ed2939', // Official French Red
} as const;

export const UK_FLAG_COLORS = {
  blue: '#012169', // Union Jack Blue
  red: '#c8102e', // Union Jack Red
  white: '#ffffff',
} as const;

export const FLAG_COLORS = {
  eu: EU_FLAG_COLORS,
  fr: FRENCH_FLAG_COLORS,
  uk: UK_FLAG_COLORS,
} as const;

// Progress percentage-based theme color spectrum
export const PROGRESS_THEME_COLORS = {
  purple: '#6c71c4',
  blue: '#268bd2',
  cyan: '#2aa198',
  green: '#859900',
  yellow: '#b58900',
  orange: '#cb4b16',
  red: '#dc322f',
  magenta: '#d33682',
  darkContrast: '#002b36',
  lightContrast: '#ffffff',
} as const;

// Canonical Solarized Base & Accent Palette
export const SOLARIZED_CANONICAL = {
  base03: '#002b36',
  base02: '#073642',
  base01: '#586e75',
  base00: '#657b83',
  base0: '#839496',
  base1: '#93a1a1',
  base2: '#eee8d5',
  base3: '#fdf6e3',
  yellow: '#b58900',
  orange: '#cb4b16',
  red: '#dc322f',
  magenta: '#d33682',
  violet: '#6c71c4',
  blue: '#268bd2',
  cyan: '#2aa198',
  green: '#859900',
} as const;

// Aggregated Named Color Tokens
export const NAMED_COLORS = {
  roles: ROLE_COLORS,
  celestial: CELESTIAL_COLORS,
  flags: FLAG_COLORS,
  progress: PROGRESS_THEME_COLORS,
  canonical: SOLARIZED_CANONICAL,
} as const;

export type NamedColors = typeof NAMED_COLORS;
export type RoleColors = typeof ROLE_COLORS;
export type CelestialColors = typeof CELESTIAL_COLORS;
export type FlagColors = typeof FLAG_COLORS;
export type ProgressThemeColors = typeof PROGRESS_THEME_COLORS;
export type SolarizedCanonical = typeof SOLARIZED_CANONICAL;
