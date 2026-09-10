import { describe, it, expect } from 'vitest';
import {
  darkTheme,
  lightTheme,
  debugTheme,
  getThemeByMode,
  getTheme,
  THEMES,
  DEFAULT_THEME,
  solarizedTheme,
  ROLE_COLORS,
  CELESTIAL_COLORS,
  FLAG_COLORS,
  EU_FLAG_COLORS,
  FRENCH_FLAG_COLORS,
  UK_FLAG_COLORS,
  NAMED_COLORS,
} from './theme';
import { checkWcagCompliance, getDeltaLStar } from './colorUtils';

describe('Theme definitions & Named Color Tokens', () => {
  it('defines distinct dark, light, and debug themes', () => {
    expect(darkTheme.palette.mode).toBe('dark');
    expect(lightTheme.palette.mode).toBe('light');
    expect(debugTheme.palette.mode).toBe('dark');

    expect(darkTheme.palette.background.default).toBe('#002b36');
    expect(lightTheme.palette.background.default).toBe('#fdf6e3');
    expect(debugTheme.palette.background.default).toBe('#120024');

    expect(DEFAULT_THEME).toBe('solarized');
    expect(THEMES.solarized).toBe(solarizedTheme);
  });

  it('retrieves proper theme using getThemeByMode and dynamic getTheme selector', () => {
    expect(getThemeByMode('dark').palette.mode).toBe('dark');
    expect(getThemeByMode('light').palette.mode).toBe('light');
    expect(getThemeByMode('debug').palette.primary.main).toBe('#00ff66');

    expect(getTheme('dark').palette.mode).toBe('dark');
    expect(getTheme({ theme: 'solarized', mode: 'light' }).palette.mode).toBe('light');
    expect(getTheme({ theme: 'solarized', mode: 'debug' }).palette.primary.main).toBe('#00ff66');
  });

  it('enforces pure highlights with zero drop shadows in darkmode', () => {
    expect(darkTheme.shadows[0]).toBe('none');

    for (let i = 1; i <= 24; i++) {
      const shadow = darkTheme.shadows[i];
      // Must contain perimeter luminous highlight
      expect(shadow).toContain('0 0 0 1px rgba(255, 255, 255,');
      // Must NOT contain black drop shadow blur in dark mode
      expect(shadow).not.toContain('rgba(0, 0, 0,');
    }
  });

  it('provides vivid neon highlight rings in debug theme', () => {
    expect(debugTheme.shadows[0]).toBe('none');
    expect(debugTheme.shadows[1]).toBe('0 0 0 2px #00ff66');
    expect(debugTheme.shadows[2]).toBe('0 0 0 2px #00e5ff');
    expect(debugTheme.shadows[3]).toBe('0 0 0 2px #ff007f');
    expect(debugTheme.shadows[4]).toBe('0 0 0 3px #ffff00');
  });

  it('verifies CIELab perceptual contrast and WCAG compliance across theme palettes', () => {
    // 1. Dark Mode Primary Text vs Background
    const darkBgContrast = checkWcagCompliance(
      darkTheme.palette.text.primary,
      darkTheme.palette.background.default,
    );
    expect(darkBgContrast.isAALarge).toBe(true);
    expect(darkBgContrast.deltaLStar).toBeGreaterThan(40);

    // 2. Light Mode Primary Text vs Background
    const lightBgContrast = checkWcagCompliance(
      lightTheme.palette.text.primary,
      lightTheme.palette.background.default,
    );
    expect(lightBgContrast.isAALarge).toBe(true);
    expect(lightBgContrast.deltaLStar).toBeGreaterThan(40);

    // 3. Debug Theme Text vs Background (Ultra High Contrast Yellow on Ultraviolet)
    const debugBgContrast = checkWcagCompliance(
      debugTheme.palette.text.primary,
      debugTheme.palette.background.default,
    );
    expect(debugBgContrast.contrastRatio).toBeGreaterThan(12);
    expect(debugBgContrast.deltaLStar).toBeGreaterThan(80);
    expect(debugBgContrast.isAAANormal).toBe(true);

    // 4. Debug Theme Primary Button Text vs Primary Main (Black on Electric Lime)
    const debugPrimaryContrast = checkWcagCompliance(
      debugTheme.palette.primary.contrastText,
      debugTheme.palette.primary.main,
    );
    expect(debugPrimaryContrast.contrastRatio).toBeGreaterThan(10);
    expect(debugPrimaryContrast.isAAANormal).toBe(true);

    // 5. Delta L* perceptual tone differences for primary actions
    const darkPrimaryDeltaL = getDeltaLStar(
      darkTheme.palette.primary.main,
      darkTheme.palette.primary.contrastText,
    );
    expect(darkPrimaryDeltaL).toBeGreaterThan(40);
  });

  it('provides named role color tokens on theme and palette', () => {
    expect(ROLE_COLORS.student).toBe('#859900');
    expect(ROLE_COLORS.instructor).toBe('#268bd2');
    expect(ROLE_COLORS.admin).toBe('#d33682');
    expect(ROLE_COLORS.guest).toBe('#586e75');

    expect(darkTheme.palette.roles.student).toBe('#859900');
    expect(darkTheme.palette.roles.instructor).toBe('#268bd2');
    expect(darkTheme.palette.roles.admin).toBe('#d33682');
    expect(darkTheme.palette.roles.guest).toBe('#586e75');

    expect(lightTheme.palette.roles.student).toBe(ROLE_COLORS.student);
    expect(lightTheme.palette.roles.instructor).toBe(ROLE_COLORS.instructor);
    expect(lightTheme.palette.roles.admin).toBe(ROLE_COLORS.admin);
  });

  it('provides named celestial color tokens (Sun, Moon, Horizon)', () => {
    expect(CELESTIAL_COLORS.sun.main).toBe('#b58900');
    expect(CELESTIAL_COLORS.sun.glow).toBe('#d4a400');
    expect(CELESTIAL_COLORS.sun.light).toBe('#fdf6e3');

    expect(CELESTIAL_COLORS.moon.main).toBe('#268bd2');
    expect(CELESTIAL_COLORS.moon.glow).toBe('#6c71c4');
    expect(CELESTIAL_COLORS.moon.crater).toBe('#586e75');

    expect(CELESTIAL_COLORS.horizon.day).toBe('#fdf6e3');
    expect(CELESTIAL_COLORS.horizon.night).toBe('#002b36');

    expect(darkTheme.palette.celestial.sun.main).toBe(CELESTIAL_COLORS.sun.main);
    expect(darkTheme.palette.celestial.moon.main).toBe(CELESTIAL_COLORS.moon.main);
    expect(lightTheme.palette.celestial.sun.glow).toBe(CELESTIAL_COLORS.sun.glow);
  });

  it('provides named national and identity flag color tokens (EU, France, UK)', () => {
    expect(EU_FLAG_COLORS.blue).toBe('#003399');
    expect(EU_FLAG_COLORS.gold).toBe('#ffcc00');

    expect(FRENCH_FLAG_COLORS.blue).toBe('#002654');
    expect(FRENCH_FLAG_COLORS.white).toBe('#ffffff');
    expect(FRENCH_FLAG_COLORS.red).toBe('#ed2939');

    expect(UK_FLAG_COLORS.blue).toBe('#012169');
    expect(UK_FLAG_COLORS.red).toBe('#c8102e');
    expect(UK_FLAG_COLORS.white).toBe('#ffffff');

    expect(FLAG_COLORS.eu).toEqual(EU_FLAG_COLORS);
    expect(FLAG_COLORS.fr).toEqual(FRENCH_FLAG_COLORS);
    expect(FLAG_COLORS.uk).toEqual(UK_FLAG_COLORS);

    expect(darkTheme.palette.flags.eu.blue).toBe('#003399');
    expect(darkTheme.palette.flags.fr.blue).toBe('#002654');
    expect(darkTheme.palette.flags.uk.blue).toBe('#012169');
    expect(lightTheme.palette.flags.eu.gold).toBe('#ffcc00');
  });

  it('provides aggregated named container on theme', () => {
    expect(darkTheme.named).toEqual(NAMED_COLORS);
    expect(lightTheme.named).toEqual(NAMED_COLORS);
    expect(debugTheme.named).toEqual(NAMED_COLORS);
  });
});
