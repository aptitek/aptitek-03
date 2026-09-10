import { describe, it, expect, vi } from 'vitest';
import {
  M3_SHAPE_CORNERS,
  M3_SHAPE_CORNER_STRINGS,
  M3_SHAPE_CSS_VARIABLES,
  M3_EXPRESSIVE_CATALOG,
  getExpressivePolygon,
  getMorphPath,
  animateExpressiveMorph,
  resolveM3ShapeStyle,
} from './shapes';

describe('Material Design 3 Shape Engine', () => {
  it('defines the standard 10-level M3 corner radius scale numbers', () => {
    expect(M3_SHAPE_CORNERS.none).toBe(0);
    expect(M3_SHAPE_CORNERS.extraSmall).toBe(4);
    expect(M3_SHAPE_CORNERS.small).toBe(8);
    expect(M3_SHAPE_CORNERS.medium).toBe(12);
    expect(M3_SHAPE_CORNERS.large).toBe(16);
    expect(M3_SHAPE_CORNERS.largeIncreased).toBe(20);
    expect(M3_SHAPE_CORNERS.extraLarge).toBe(28);
    expect(M3_SHAPE_CORNERS.extraLargeIncreased).toBe(32);
    expect(M3_SHAPE_CORNERS.extraExtraLarge).toBe(48);
    expect(M3_SHAPE_CORNERS.full).toBe(9999);
  });

  it('defines the standard CSS strings for all corner levels', () => {
    expect(M3_SHAPE_CORNER_STRINGS.none).toBe('0px');
    expect(M3_SHAPE_CORNER_STRINGS.extraSmall).toBe('4px');
    expect(M3_SHAPE_CORNER_STRINGS.small).toBe('8px');
    expect(M3_SHAPE_CORNER_STRINGS.medium).toBe('12px');
    expect(M3_SHAPE_CORNER_STRINGS.large).toBe('16px');
    expect(M3_SHAPE_CORNER_STRINGS.largeIncreased).toBe('20px');
    expect(M3_SHAPE_CORNER_STRINGS.extraLarge).toBe('28px');
    expect(M3_SHAPE_CORNER_STRINGS.extraLargeIncreased).toBe('32px');
    expect(M3_SHAPE_CORNER_STRINGS.extraExtraLarge).toBe('48px');
    expect(M3_SHAPE_CORNER_STRINGS.full).toBe('9999px');
  });

  it('exposes CSS custom property variable strings for theme synchronization', () => {
    expect(M3_SHAPE_CSS_VARIABLES.none).toBe('var(--md-sys-shape-corner-none)');
    expect(M3_SHAPE_CSS_VARIABLES.medium).toBe(
      'var(--md-sys-shape-corner-medium)',
    );
    expect(M3_SHAPE_CSS_VARIABLES.largeIncreased).toBe(
      'var(--md-sys-shape-corner-large-increased)',
    );
    expect(M3_SHAPE_CSS_VARIABLES.full).toBe('var(--md-sys-shape-corner-full)');
  });

  it('resolves shape styles via resolveM3ShapeStyle helper', () => {
    const mediumStyle = resolveM3ShapeStyle('medium');
    expect(mediumStyle.borderRadius).toBe('12px');

    const fullStyle = resolveM3ShapeStyle('full');
    expect(fullStyle.borderRadius).toBe('9999px');
  });

  it('provides expressive shapes catalog for geometric morphing', () => {
    expect(M3_EXPRESSIVE_CATALOG.circle).toBeDefined();
    expect(M3_EXPRESSIVE_CATALOG.pill).toBeDefined();
    expect(M3_EXPRESSIVE_CATALOG.burst).toBeDefined();
    expect(M3_EXPRESSIVE_CATALOG.flower).toBeDefined();
    expect(M3_EXPRESSIVE_CATALOG.pentagon).toBeDefined();
    expect(M3_EXPRESSIVE_CATALOG.heart).toBeDefined();
  });

  it('returns polygon objects via getExpressivePolygon', () => {
    const circle = getExpressivePolygon('circle');
    expect(circle).toBeDefined();
    const burst = getExpressivePolygon('burst');
    expect(burst).toBeDefined();
  });

  it('generates valid SVG path strings via getMorphPath', () => {
    const path0 = getMorphPath('circle', 'circle', 0);
    expect(typeof path0).toBe('string');
    expect(path0.length).toBeGreaterThan(0);
    expect(path0.startsWith('M')).toBe(true);

    const pathHalf = getMorphPath('circle', 'burst', 0.5);
    expect(typeof pathHalf).toBe('string');
    expect(pathHalf.startsWith('M')).toBe(true);
  });

  it('animates expressive morph transitions with frame interpolation', () => {
    const onFrame = vi.fn();
    const anim = animateExpressiveMorph('circle', 'burst', {
      duration: 50,
      onFrame,
    });

    expect(anim).toBeDefined();
    expect(typeof anim.cancel).toBe('function');
    anim.cancel();
  });
});
