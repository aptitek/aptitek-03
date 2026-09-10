import type { Shadows } from '@mui/material/styles';

/**
 * Creates Material 3 Dark Mode Elevation Shadows:
 * Per M3 specifications, dark mode does NOT use black drop shadows.
 * Elevation is purely expressed through perimeter highlight rings & surface highlight.
 */
export function createDarkHighlightShadows(): Shadows {
  const shadows = Array(25).fill('none') as Shadows;
  shadows[0] = 'none';

  for (let i = 1; i <= 24; i++) {
    // Opacity scales progressively with elevation level: 0.08 at level 1 to 0.28 at level 24
    const highlightAlpha = Math.min(0.28, 0.07 + i * 0.009).toFixed(3);
    shadows[i] = `0 0 0 1px rgba(255, 255, 255, ${highlightAlpha})`;
  }

  return shadows;
}

/**
 * Creates Material 3 Light Mode Elevation Shadows:
 * Soft ambient diffusion shadows for light mode.
 */
export function createLightShadows(): Shadows {
  const shadows = Array(25).fill('none') as Shadows;
  shadows[0] = 'none';

  for (let i = 1; i <= 24; i++) {
    const y1 = Math.max(1, Math.round(i * 0.5));
    const blur1 = Math.max(2, i * 2);
    const alpha1 = Math.min(0.22, 0.08 + i * 0.005).toFixed(3);
    shadows[i] = `0px ${y1}px ${blur1}px rgba(0, 0, 0, ${alpha1})`;
  }

  return shadows;
}

/**
 * Creates Debug Theme Elevation Highlights:
 * High-visibility neon highlight rings to immediately spot elevation boundaries.
 */
export function createDebugHighlightShadows(): Shadows {
  const shadows = Array(25).fill('none') as Shadows;
  shadows[0] = 'none';
  shadows[1] = '0 0 0 2px #00ff66';
  shadows[2] = '0 0 0 2px #00e5ff';
  shadows[3] = '0 0 0 2px #ff007f';
  shadows[4] = '0 0 0 3px #ffff00';
  shadows[5] = '0 0 0 3px #ff00aa';

  for (let i = 6; i <= 24; i++) {
    shadows[i] = `0 0 0 3px #00ff66, 0 0 ${i}px rgba(0, 255, 102, 0.5)`;
  }

  return shadows;
}

/**
 * Material Design 3 Elevation Levels (0 to 5).
 * MD3 restricts elevation to 5 strict levels (plus level 0 for flat surfaces).
 */
export const M3_ELEVATION_LEVELS = [0, 1, 2, 3, 4, 5] as const;
export type M3ElevationLevel = (typeof M3_ELEVATION_LEVELS)[number];

export const M3_ELEVATIONS = {
  level0: 0,
  level1: 1,
  level2: 2,
  level3: 3,
  level4: 4,
  level5: 5,
} as const;
