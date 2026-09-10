import type { ReactNode } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import {
  getTheme,
  type ThemeMode,
  type SupportedTheme,
  DEFAULT_THEME,
} from '../tokens/theme.js';

export interface AppThemeProviderProps {
  theme?: SupportedTheme;
  mode?: ThemeMode;
  children: ReactNode;
}

export function AppThemeProvider({
  theme = DEFAULT_THEME,
  mode = 'dark',
  children,
}: AppThemeProviderProps) {
  const activeTheme = getTheme({ theme, mode });
  return <ThemeProvider theme={activeTheme}>{children}</ThemeProvider>;
}
