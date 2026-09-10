import { describe, it, expect } from 'vitest';
import {
  darkTheme,
  lightTheme,
  debugTheme,
  getThemeByMode,
  solarizedTheme,
  solarizedDarkTheme,
  solarizedLightTheme,
  ROLE_COLORS,
  CELESTIAL_COLORS,
  FLAG_COLORS,
  EU_FLAG_COLORS,
  FRENCH_FLAG_COLORS,
  UK_FLAG_COLORS,
  NAMED_COLORS,
} from './theme';
import { checkWcagCompliance, getDeltaLStar } from '../colorUtils';

describe('Solarized Theme definitions & Named Color Tokens', () => {
  it('defines distinct dark, light, and debug themes for Solarized', () => {
    expect(darkTheme.palette.mode).toBe('dark');
    expect(lightTheme.palette.mode).toBe('light');
    expect(debugTheme.palette.mode).toBe('dark');

    expect(darkTheme.palette.background.default).toBe('#002b36');
    expect(lightTheme.palette.background.default).toBe('#fdf6e3');
    expect(debugTheme.palette.background.default).toBe('#120024');

    expect(solarizedDarkTheme).toBe(darkTheme);
    expect(solarizedLightTheme).toBe(lightTheme);
    expect(solarizedTheme.dark).toBe(darkTheme);
  });

  it('retrieves proper theme using getThemeByMode', () => {
    expect(getThemeByMode('dark').palette.mode).toBe('dark');
    expect(getThemeByMode('light').palette.mode).toBe('light');
    expect(getThemeByMode('debug').palette.primary.main).toBe('#00ff66');
  });

  it('enforces pure highlights with zero drop shadows in Solarized darkmode', () => {
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

  it('verifies CIELab perceptual contrast and WCAG compliance across Solarized theme palettes', () => {
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

    // 3. Accent Colors on Dark Mode Background
    const darkPrimaryContrast = checkWcagCompliance(
      darkTheme.palette.primary.main,
      darkTheme.palette.background.default,
    );
    expect(darkPrimaryContrast.contrastRatio).toBeGreaterThan(3.0);

    const darkSuccessContrast = checkWcagCompliance(
      darkTheme.palette.success.main,
      darkTheme.palette.background.default,
    );
    expect(darkSuccessContrast.contrastRatio).toBeGreaterThan(3.0);

    // 4. Perceptual Tone Difference (Delta L*) checks
    const darkToneDiff = getDeltaLStar(
      darkTheme.palette.text.primary,
      darkTheme.palette.background.default,
    );
    expect(darkToneDiff).toBeGreaterThanOrEqual(40);

    const lightToneDiff = getDeltaLStar(
      lightTheme.palette.text.primary,
      lightTheme.palette.background.default,
    );
    expect(lightToneDiff).toBeGreaterThanOrEqual(40);
  });

  it('exposes all Solarized named role colors correctly', () => {
    expect(ROLE_COLORS.student).toBe('#859900');
    expect(ROLE_COLORS.instructor).toBe('#268bd2');
    expect(ROLE_COLORS.admin).toBe('#d33682');
    expect(ROLE_COLORS.guest).toBe('#586e75');

    expect(darkTheme.palette.roles.student).toBe('#859900');
    expect(lightTheme.palette.roles.instructor).toBe('#268bd2');
  });

  it('exposes celestial and astronomy named color tokens', () => {
    expect(CELESTIAL_COLORS.sun.main).toBe('#b58900');
    expect(CELESTIAL_COLORS.sun.glow).toBe('#d4a400');
    expect(CELESTIAL_COLORS.moon.main).toBe('#268bd2');
    expect(CELESTIAL_COLORS.moon.glow).toBe('#6c71c4');
    expect(CELESTIAL_COLORS.horizon.day).toBe('#fdf6e3');
    expect(CELESTIAL_COLORS.horizon.night).toBe('#002b36');

    expect(darkTheme.palette.celestial.sun.main).toBe('#b58900');
    expect(lightTheme.palette.celestial.moon.glow).toBe('#6c71c4');
  });

  it('exposes official national and international flag color tokens', () => {
    expect(EU_FLAG_COLORS.blue).toBe('#003399');
    expect(EU_FLAG_COLORS.gold).toBe('#ffcc00');
    expect(FRENCH_FLAG_COLORS.blue).toBe('#002654');
    expect(FRENCH_FLAG_COLORS.red).toBe('#ed2939');
    expect(UK_FLAG_COLORS.blue).toBe('#012169');
    expect(UK_FLAG_COLORS.red).toBe('#c8102e');

    expect(FLAG_COLORS.eu.blue).toBe('#003399');
    expect(FLAG_COLORS.fr.red).toBe('#ed2939');
    expect(FLAG_COLORS.uk.blue).toBe('#012169');

    expect(darkTheme.palette.flags.eu.gold).toBe('#ffcc00');
    expect(lightTheme.palette.flags.fr.white).toBe('#ffffff');
  });

  it('aggregates all named colors in NAMED_COLORS export', () => {
    expect(NAMED_COLORS.roles).toBe(ROLE_COLORS);
    expect(NAMED_COLORS.celestial).toBe(CELESTIAL_COLORS);
    expect(NAMED_COLORS.flags).toBe(FLAG_COLORS);
  });
});
