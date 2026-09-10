/**
 * Application Theme Registry & Selector
 *
 * Configured with a multi-theme architecture leaving room for theme selection later
 * (e.g. Solarized, Material, Nord, Dracula, Catppuccin, etc.) with Solarized as
 * the default active theme.
 */
import { solarizedTheme, getThemeByMode, type ThemeMode } from './solarized/theme.js';

export * from './solarized/theme.js';

/**
 * Supported Theme Identifiers
 */
export type SupportedTheme = 'solarized';

/**
 * Themes Registry
 * Add additional theme packages here when extending the theme catalog.
 */
export const THEMES = {
  solarized: solarizedTheme,
} as const;

/**
 * Default Active Theme
 */
export const DEFAULT_THEME: SupportedTheme = 'solarized';

export interface ThemeSelectionOptions {
  theme?: SupportedTheme;
  mode?: ThemeMode;
}

/**
 * Resolves a Theme instance based on theme name and mode.
 * Supports both getTheme({ theme: 'solarized', mode: 'dark' }) and getTheme('dark').
 */
export function getTheme(options?: ThemeSelectionOptions | ThemeMode) {
  if (typeof options === 'string') {
    return getThemeByMode(options);
  }
  const themeName: SupportedTheme = options?.theme ?? DEFAULT_THEME;
  const mode: ThemeMode = options?.mode ?? 'dark';
  const selectedTheme = THEMES[themeName];
  if (mode === 'light') return selectedTheme.light;
  if (mode === 'debug') return selectedTheme.debug;
  return selectedTheme.dark;
}
