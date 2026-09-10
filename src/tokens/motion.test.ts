import { describe, it, expect } from 'vitest';
import {
  M3_MOTION_DURATIONS,
  M3_MOTION_EASINGS,
  M3_SPRINGS,
  M3_MOTION,
  reducedMotionSafe,
} from './motion';

describe('Material Design 3 Motion System', () => {
  describe('M3_MOTION_DURATIONS', () => {
    it('provides monotonic millisecond durations matching M3 spec', () => {
      expect(M3_MOTION_DURATIONS.short1).toBeLessThan(
        M3_MOTION_DURATIONS.short2,
      );
      expect(M3_MOTION_DURATIONS.short2).toBeLessThan(
        M3_MOTION_DURATIONS.short3,
      );
      expect(M3_MOTION_DURATIONS.short3).toBeLessThan(
        M3_MOTION_DURATIONS.short4,
      );
      expect(M3_MOTION_DURATIONS.short4).toBeLessThan(
        M3_MOTION_DURATIONS.medium1,
      );
      expect(M3_MOTION_DURATIONS.medium1).toBeLessThan(
        M3_MOTION_DURATIONS.medium2,
      );
      expect(M3_MOTION_DURATIONS.medium4).toBeLessThan(
        M3_MOTION_DURATIONS.long1,
      );
      expect(M3_MOTION_DURATIONS.long4).toBeLessThan(
        M3_MOTION_DURATIONS.extraLong1,
      );
      expect(M3_MOTION_DURATIONS.extraLong4).toBe(1000);
    });

    it('provides matching second representations for Framer Motion', () => {
      expect(M3_MOTION_DURATIONS.s.short1).toBe(0.05);
      expect(M3_MOTION_DURATIONS.s.short3).toBe(0.15);
      expect(M3_MOTION_DURATIONS.s.medium1).toBe(0.25);
      expect(M3_MOTION_DURATIONS.s.medium2).toBe(0.3);
      expect(M3_MOTION_DURATIONS.s.medium4).toBe(0.4);
      expect(M3_MOTION_DURATIONS.s.long2).toBe(0.5);
    });

    it('defines standard semantic speed tiers', () => {
      expect(M3_MOTION_DURATIONS.speed.fast).toBe(150);
      expect(M3_MOTION_DURATIONS.speed.default).toBe(300);
      expect(M3_MOTION_DURATIONS.speed.slow).toBe(500);
      expect(M3_MOTION_DURATIONS.speed.extraSlow).toBe(700);
    });
  });

  describe('M3_MOTION_EASINGS', () => {
    it('provides valid CSS cubic-bezier strings', () => {
      const css = M3_MOTION_EASINGS.css;
      for (const curve of Object.values(css)) {
        expect(curve).toMatch(
          /^cubic-bezier\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*\)$/,
        );
      }
    });

    it('provides Framer Motion cubic-bezier tuples with 4 coordinates', () => {
      const tuples = M3_MOTION_EASINGS.tuples;
      for (const tuple of Object.values(tuples)) {
        expect(tuple).toHaveLength(4);
        expect(tuple[0]).toBeGreaterThanOrEqual(0);
        expect(tuple[0]).toBeLessThanOrEqual(1);
        expect(tuple[2]).toBeGreaterThanOrEqual(0);
        expect(tuple[2]).toBeLessThanOrEqual(1);
      }
    });
  });

  describe('M3_SPRINGS: Spatial vs Effects Domain Separation', () => {
    it('ensures spatial springs define valid physical spring parameters', () => {
      const expressiveSpatial = M3_SPRINGS.expressive.spatial;
      expect(expressiveSpatial.fast.type).toBe('spring');
      expect(expressiveSpatial.fast.stiffness).toBeGreaterThan(0);
      expect(expressiveSpatial.fast.damping).toBeGreaterThan(0);

      expect(expressiveSpatial.default.type).toBe('spring');
      expect(expressiveSpatial.default.stiffness).toBeGreaterThan(0);

      expect(expressiveSpatial.slow.type).toBe('spring');
      expect(expressiveSpatial.slow.stiffness).toBeGreaterThan(0);
    });

    it('ensures effects transitions never oscillate or use bounce (strictly duration + ease)', () => {
      const expressiveEffects = M3_SPRINGS.expressive.effects;
      expect(expressiveEffects.fast).not.toHaveProperty('type', 'spring');
      expect(expressiveEffects.fast).toHaveProperty('duration');
      expect(expressiveEffects.fast).toHaveProperty('ease');

      const standardEffects = M3_SPRINGS.standard.effects;
      expect(standardEffects.default).not.toHaveProperty('type', 'spring');
      expect(standardEffects.default).toHaveProperty('duration');
      expect(standardEffects.default).toHaveProperty('ease');
    });

    it('ensures standard spatial springs are critically damped (no overshoot)', () => {
      const standardSpatial = M3_SPRINGS.standard.spatial;
      expect(standardSpatial.fast.type).toBe('spring');
      expect(standardSpatial.fast.damping).toBeGreaterThanOrEqual(30);
      expect(standardSpatial.default.damping).toBeGreaterThanOrEqual(30);
    });
  });

  describe('Interaction Micro-Spring Presets', () => {
    it('provides tactile button press preset', () => {
      expect(M3_SPRINGS.press.type).toBe('spring');
      expect(M3_SPRINGS.press.stiffness).toBe(500);
      expect(M3_SPRINGS.press.damping).toBe(25);
    });

    it('provides switch thumb spring preset', () => {
      expect(M3_SPRINGS.switchThumb.type).toBe('spring');
      expect(M3_SPRINGS.switchThumb.stiffness).toBe(500);
      expect(M3_SPRINGS.switchThumb.damping).toBe(30);
    });

    it('provides sliding tab indicator spring preset', () => {
      expect(M3_SPRINGS.tabIndicator.type).toBe('spring');
      expect(M3_SPRINGS.tabIndicator.stiffness).toBe(400);
      expect(M3_SPRINGS.tabIndicator.damping).toBe(30);
    });

    it('provides dialog / modal surface entrance and exit presets', () => {
      expect(M3_SPRINGS.modalCard.enter.duration).toBe(0.4);
      expect(M3_SPRINGS.modalCard.exit.duration).toBe(0.25);
      expect(M3_SPRINGS.modalBackdrop.enter.duration).toBe(0.4);
      expect(M3_SPRINGS.modalBackdrop.exit.duration).toBe(0.25);
    });

    it('provides 3D card tilt and flip presets', () => {
      expect(M3_SPRINGS.cardTilt.stiffness).toBe(300);
      expect(M3_SPRINGS.cardTilt.damping).toBe(30);
      expect(M3_SPRINGS.cardFlip.type).toBe('spring');
      expect(M3_SPRINGS.cardFlip.stiffness).toBe(260);
    });
  });

  describe('M3_MOTION MUI Compatibility Export', () => {
    it('provides M3_MOTION easing and duration maps for MUI Theme integration', () => {
      expect(M3_MOTION.easing.standard).toBe(M3_MOTION_EASINGS.css.standard);
      expect(M3_MOTION.easing.emphasizedDecelerate).toBe(
        M3_MOTION_EASINGS.css.emphasizedDecelerate,
      );
      expect(M3_MOTION.duration.short3).toBe(150);
      expect(M3_MOTION.duration.medium2).toBe(300);
      expect(M3_MOTION.spring).toBe(M3_SPRINGS);
    });
  });

  describe('reducedMotionSafe', () => {
    it('returns original transition when shouldReduceMotion is false', () => {
      const spring = M3_SPRINGS.press;
      expect(reducedMotionSafe(spring, false)).toBe(spring);
    });

    it('returns linear fade fallback when shouldReduceMotion is true', () => {
      const spring = M3_SPRINGS.press;
      const fallback = reducedMotionSafe(spring, true);
      expect(fallback).toEqual({
        duration: 0.15,
        ease: 'linear',
      });
    });
  });
});
