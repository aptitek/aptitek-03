import { describe, it, expect } from 'vitest';
import {
  FONT_FAMILIES,
  RECURSIVE_AXES,
  RECURSIVE_PRESETS,
  FONT_FEATURES,
  M3_TYPESCALE,
  formatFontVariation,
  resolveM3Typography,
  APPROVED_FONT_SIZE_PIXELS,
  APPROVED_FONT_SIZE_REMS,
} from './typography';

describe('Material Design 3 Typography & Recursive Tokens', () => {
  describe('Font Families', () => {
    it('defines brand, mono, display, mrz, logo, and icon font families', () => {
      expect(FONT_FAMILIES.brand).toContain('Recursive');
      expect(FONT_FAMILIES.brand).toContain('Inter');
      expect(FONT_FAMILIES.mono).toContain('Recursive');
      expect(FONT_FAMILIES.mono).toContain('JetBrains Mono');
      expect(FONT_FAMILIES.display).toContain('Recursive');
      expect(FONT_FAMILIES.mrz).toContain('OCR-B');
      expect(FONT_FAMILIES.logo).toContain('Milkshake');
      expect(FONT_FAMILIES.icons).toContain('Material Symbols Rounded');
    });
  });

  describe('Recursive Variable Font Axes', () => {
    it('defines valid min, max, and default for all 5 axes', () => {
      expect(RECURSIVE_AXES.MONO.default).toBe(0);
      expect(RECURSIVE_AXES.CASL.default).toBe(1);
      expect(RECURSIVE_AXES.wght.min).toBe(300);
      expect(RECURSIVE_AXES.wght.max).toBe(1000);
      expect(RECURSIVE_AXES.slnt.min).toBe(-15);
      expect(RECURSIVE_AXES.CRSV.default).toBe(0.5);
    });

    it('formats font variation settings accurately', () => {
      const formatted = formatFontVariation({
        casl: 1,
        mono: 0,
        wght: 600,
        slnt: 0,
        crsv: 0.5,
      });
      expect(formatted).toBe("'CASL' 1, 'MONO' 0, 'wght' 600, 'slnt' 0, 'CRSV' 0.5");
    });
  });

  describe('Recursive Presets', () => {
    it('provides brand casual default and linear contrast presets', () => {
      expect(RECURSIVE_PRESETS.casual).toContain("'CASL' 1");
      expect(RECURSIVE_PRESETS.casual).toContain("'MONO' 0");
      expect(RECURSIVE_PRESETS.linear).toContain("'CASL' 0");
      expect(RECURSIVE_PRESETS.linear).toContain("'MONO' 0");
      expect(RECURSIVE_PRESETS.mono).toContain("'MONO' 1");
      expect(RECURSIVE_PRESETS.casualMono).toContain("'CASL' 1, 'MONO' 1");
      expect(RECURSIVE_PRESETS.semiMono).toContain("'MONO' 0.5");
    });
  });

  describe('Font Feature Settings', () => {
    it('provides tabular numbers and slashed zero features', () => {
      expect(FONT_FEATURES.tabularNumbers).toBe("'tnum' 1");
      expect(FONT_FEATURES.slashedZero).toBe("'zero' 1");
      expect(FONT_FEATURES.codeLigatures).toBe("'dlig' 1");
      expect(FONT_FEATURES.tabularTechnical).toBe("'tnum' 1, 'zero' 1");
    });
  });

  describe('M3 Type Scale Tokens', () => {
    const roles = [
      'displayLarge',
      'displayMedium',
      'displaySmall',
      'headlineLarge',
      'headlineMedium',
      'headlineSmall',
      'titleLarge',
      'titleMedium',
      'titleSmall',
      'bodyLarge',
      'bodyMedium',
      'bodySmall',
      'labelLarge',
      'labelMedium',
      'labelSmall',
    ] as const;

    it('defines all 15 M3 type roles', () => {
      roles.forEach((role) => {
        const token = M3_TYPESCALE[role];
        expect(token).toBeDefined();
        expect(token.fontSizePx).toBeGreaterThan(0);
        expect(token.lineHeightPx).toBeGreaterThan(0);
        expect(token.fontWeight).toBeGreaterThanOrEqual(400);
        expect(token.fontFamily).toBe(FONT_FAMILIES.brand);
      });
    });

    it('matches Material Design 3 type specifications', () => {
      expect(M3_TYPESCALE.displayLarge.fontSizePx).toBe(57);
      expect(M3_TYPESCALE.displayMedium.fontSizePx).toBe(45);
      expect(M3_TYPESCALE.displaySmall.fontSizePx).toBe(36);
      expect(M3_TYPESCALE.headlineLarge.fontSizePx).toBe(32);
      expect(M3_TYPESCALE.bodyLarge.fontSizePx).toBe(16);
      expect(M3_TYPESCALE.bodyMedium.fontSizePx).toBe(14);
      expect(M3_TYPESCALE.bodySmall.fontSizePx).toBe(12);
      expect(M3_TYPESCALE.labelSmall.fontSizePx).toBe(11);
    });

    it('resolves variations correctly for casual, linear, and mono', () => {
      const casualTitle = resolveM3Typography('titleMedium', 'casual');
      expect(casualTitle.fontFamily).toBe(FONT_FAMILIES.brand);
      expect(casualTitle.fontVariationSettings).toBe(RECURSIVE_PRESETS.casual);

      const linearHeading = resolveM3Typography('headlineSmall', 'linear');
      expect(linearHeading.fontFamily).toBe(FONT_FAMILIES.brand);
      expect(linearHeading.fontVariationSettings).toBe(RECURSIVE_PRESETS.linear);

      const monoLabel = resolveM3Typography('labelMedium', 'mono');
      expect(monoLabel.fontFamily).toBe(FONT_FAMILIES.mono);
      expect(monoLabel.fontVariationSettings).toBe(RECURSIVE_PRESETS.mono);
    });
  });

  describe('Approved Font Sizes', () => {
    it('contains all M3 pixel font sizes', () => {
      [11, 12, 14, 16, 22, 24, 28, 32, 36, 45, 57].forEach((px) => {
        expect(APPROVED_FONT_SIZE_PIXELS.has(px)).toBe(true);
      });
    });

    it('contains standard rem sizes', () => {
      expect(APPROVED_FONT_SIZE_REMS.has('1rem')).toBe(true);
      expect(APPROVED_FONT_SIZE_REMS.has('0.875rem')).toBe(true);
      expect(APPROVED_FONT_SIZE_REMS.has('0.75rem')).toBe(true);
    });
  });
});
