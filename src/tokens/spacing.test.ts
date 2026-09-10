import { describe, it, expect } from 'vitest';
import {
  M3_SPACINGS,
  M3_SPACING_STRINGS,
  M3_SPACING_FRIENDSHIPS,
  M3_STROKES,
  M3_STROKE_STRINGS,
  M3_DIMENSIONS,
  M3_SPACING_CSS_VARIABLES,
  M3_STROKE_CSS_VARIABLES,
  resolveM3Spacing,
  resolveM3Stroke,
} from './spacing';

describe('Material Design 3 Spacing & Layout Engine', () => {
  it('defines the standard 8dp baseline grid and granular half-step numbers', () => {
    expect(M3_SPACINGS.none).toBe(0);
    expect(M3_SPACINGS.hairline).toBe(2);
    expect(M3_SPACINGS.micro).toBe(4);
    expect(M3_SPACINGS.compactHalf).toBe(6);
    expect(M3_SPACINGS.compact).toBe(8);
    expect(M3_SPACINGS.mediumHalf).toBe(10);
    expect(M3_SPACINGS.medium).toBe(12);
    expect(M3_SPACINGS.standard).toBe(16);
    expect(M3_SPACINGS.largeHalf).toBe(20);
    expect(M3_SPACINGS.large).toBe(24);
    expect(M3_SPACINGS.extraLarge).toBe(32);
    expect(M3_SPACINGS.sectionHalf).toBe(40);
    expect(M3_SPACINGS.extraExtraLarge).toBe(48);
    expect(M3_SPACINGS.hugeHalf).toBe(56);
    expect(M3_SPACINGS.huge).toBe(64);
    expect(M3_SPACINGS.massive).toBe(80);
    expect(M3_SPACINGS.macro).toBe(96);
    expect(M3_SPACINGS.giant).toBe(120);
    expect(M3_SPACINGS.jumbo).toBe(160);
  });

  it('defines CSS pixel string values for all spacing levels', () => {
    expect(M3_SPACING_STRINGS.none).toBe('0px');
    expect(M3_SPACING_STRINGS.micro).toBe('4px');
    expect(M3_SPACING_STRINGS.compact).toBe('8px');
    expect(M3_SPACING_STRINGS.standard).toBe('16px');
    expect(M3_SPACING_STRINGS.large).toBe('24px');
    expect(M3_SPACING_STRINGS.extraLarge).toBe('32px');
    expect(M3_SPACING_STRINGS.extraExtraLarge).toBe('48px');
    expect(M3_SPACING_STRINGS.huge).toBe('64px');
    expect(M3_SPACING_STRINGS.massive).toBe('80px');
    expect(M3_SPACING_STRINGS.giant).toBe('120px');
  });

  it('defines the DesignForDucks spacing friendship semantic hierarchy', () => {
    expect(M3_SPACING_FRIENDSHIPS.inseparable).toBe(4);
    expect(M3_SPACING_FRIENDSHIPS.bestFriends).toBe(8);
    expect(M3_SPACING_FRIENDSHIPS.friends).toBe(16);
    expect(M3_SPACING_FRIENDSHIPS.grouping).toBe(24);
    expect(M3_SPACING_FRIENDSHIPS.casualFriends).toBe(32);
    expect(M3_SPACING_FRIENDSHIPS.sections).toBe(48);
    expect(M3_SPACING_FRIENDSHIPS.acquaintances).toBe(64);
    expect(M3_SPACING_FRIENDSHIPS.distantAcquaintances).toBe(80);
    expect(M3_SPACING_FRIENDSHIPS.strangers).toBe(120);
  });

  it('defines the line thickness and stroke width scale', () => {
    expect(M3_STROKES.none).toBe(0);
    expect(M3_STROKES.hairline).toBe(0.5);
    expect(M3_STROKES.thin).toBe(1);
    expect(M3_STROKES.medium).toBe(2);
    expect(M3_STROKES.thick).toBe(3);
    expect(M3_STROKES.heavy).toBe(4);
    expect(M3_STROKES.expressive).toBe(6);

    expect(M3_STROKE_STRINGS.none).toBe('0px');
    expect(M3_STROKE_STRINGS.hairline).toBe('0.5px');
    expect(M3_STROKE_STRINGS.thin).toBe('1px');
    expect(M3_STROKE_STRINGS.medium).toBe('2px');
    expect(M3_STROKE_STRINGS.thick).toBe('3px');
    expect(M3_STROKE_STRINGS.heavy).toBe('4px');
    expect(M3_STROKE_STRINGS.expressive).toBe('6px');
  });

  it('defines standard UI dimension tokens', () => {
    expect(M3_DIMENSIONS.touchTarget).toBe(48);
    expect(M3_DIMENSIONS.touchTargetDense).toBe(40);
    expect(M3_DIMENSIONS.iconSmall).toBe(18);
    expect(M3_DIMENSIONS.iconInline).toBe(20);
    expect(M3_DIMENSIONS.iconStandard).toBe(24);
    expect(M3_DIMENSIONS.iconLarge).toBe(32);
    expect(M3_DIMENSIONS.chipHeight).toBe(32);
    expect(M3_DIMENSIONS.buttonMedium).toBe(40);
    expect(M3_DIMENSIONS.inputStandard).toBe(56);
    expect(M3_DIMENSIONS.headerHeight).toBe(64);
    expect(M3_DIMENSIONS.navigationBarHeight).toBe(80);
    expect(M3_DIMENSIONS.avatarMd).toBe(40);
    expect(M3_DIMENSIONS.avatarHero).toBe(96);
  });

  it('exposes CSS custom properties for spacing and strokes', () => {
    expect(M3_SPACING_CSS_VARIABLES.standard).toBe('var(--md-sys-spacing-standard)');
    expect(M3_SPACING_CSS_VARIABLES.bestFriends).toBe('var(--spacing-friendship-best-friends)');
    expect(M3_STROKE_CSS_VARIABLES.thin).toBe('var(--md-sys-stroke-thin)');
    expect(M3_STROKE_CSS_VARIABLES.medium).toBe('var(--md-sys-stroke-medium)');
  });

  it('resolves spacing tokens to pixel strings via resolveM3Spacing', () => {
    expect(resolveM3Spacing('standard')).toBe('16px');
    expect(resolveM3Spacing('friends')).toBe('16px');
    expect(resolveM3Spacing('casualFriends')).toBe('32px');
    expect(resolveM3Spacing('compact')).toBe('8px');
  });

  it('resolves stroke tokens to pixel strings via resolveM3Stroke', () => {
    expect(resolveM3Stroke('thin')).toBe('1px');
    expect(resolveM3Stroke('medium')).toBe('2px');
    expect(resolveM3Stroke('heavy')).toBe('4px');
  });
});
