export interface Transition {
  type?: 'spring' | 'tween' | 'inertia' | (string & {});
  stiffness?: number;
  damping?: number;
  mass?: number;
  duration?: number;
  ease?: string | number[] | readonly number[];
  bounce?: number;
  restDelta?: number;
  restSpeed?: number;
  repeat?: number;
  [key: string]: unknown;
}

/**
 * Material Design 3 Motion System
 * Adheres strictly to M3 Expressive Motion Physics & Guidelines:
 * https://m3.material.io/styles/motion/overview/how-it-works
 *
 * Architecture:
 * - Motion Families: Expressive (bouncy, dynamic) vs Standard (clean, utilitarian)
 * - Motion Domains: Spatial (translation, scale, bounds) vs Effects (opacity, color, blur)
 * - Motion Speeds: Fast (small UI), Default (mid-size UI), Slow (large/view transitions)
 */

export const M3_MOTION_DURATIONS = {
  // Exact millisecond tokens
  short1: 50,
  short2: 100,
  short3: 150,
  short4: 200,
  medium1: 250,
  medium2: 300,
  medium3: 350,
  medium4: 400,
  long1: 450,
  long2: 500,
  long3: 550,
  long4: 600,
  extraLong1: 700,
  extraLong2: 800,
  extraLong3: 900,
  extraLong4: 1000,

  // Framer Motion second tokens
  s: {
    short1: 0.05,
    short2: 0.1,
    short3: 0.15,
    short4: 0.2,
    medium1: 0.25,
    medium2: 0.3,
    medium3: 0.35,
    medium4: 0.4,
    long1: 0.45,
    long2: 0.5,
    long3: 0.55,
    long4: 0.6,
    extraLong1: 0.7,
    extraLong2: 0.8,
    extraLong3: 0.9,
    extraLong4: 1.0,
  },

  // Semantic speed tiers
  speed: {
    fast: 150,
    default: 300,
    slow: 500,
    extraSlow: 700,
  },
} as const;

export const M3_MOTION_EASINGS = {
  // CSS cubic-bezier strings
  css: {
    standard: 'cubic-bezier(0.2, 0, 0, 1)',
    standardDecelerate: 'cubic-bezier(0, 0, 0.2, 1)',
    standardAccelerate: 'cubic-bezier(0.3, 0, 1, 1)',
    emphasized: 'cubic-bezier(0.2, 0, 0, 1)',
    emphasizedDecelerate: 'cubic-bezier(0.05, 0.7, 0.1, 1)',
    emphasizedAccelerate: 'cubic-bezier(0.3, 0, 0.8, 0.15)',
    expressiveStandard: 'cubic-bezier(0.4, 0.14, 0.3, 1)',
    expressiveDecelerate: 'cubic-bezier(0.1, 0.9, 0.2, 1)',
    expressiveAccelerate: 'cubic-bezier(0.4, 0, 0.7, 0.2)',
  },

  // Framer Motion cubic-bezier tuples [x1, y1, x2, y2]
  tuples: {
    standard: [0.2, 0, 0, 1] as const,
    standardDecelerate: [0, 0, 0.2, 1] as const,
    standardAccelerate: [0.3, 0, 1, 1] as const,
    emphasized: [0.2, 0, 0, 1] as const,
    emphasizedDecelerate: [0.05, 0.7, 0.1, 1] as const,
    emphasizedAccelerate: [0.3, 0, 0.8, 0.15] as const,
    expressiveStandard: [0.4, 0.14, 0.3, 1] as const,
    expressiveDecelerate: [0.1, 0.9, 0.2, 1] as const,
    expressiveAccelerate: [0.4, 0, 0.7, 0.2] as const,
  },
} as const;

/**
 * Material Design 3 Spring Physics & Transition Tokens
 */
export const M3_SPRINGS = {
  // --- Hierarchical System Tokens ---
  expressive: {
    spatial: {
      fast: {
        type: 'spring',
        stiffness: 480,
        damping: 28,
        mass: 0.8,
      } as const satisfies Transition,
      default: {
        type: 'spring',
        stiffness: 350,
        damping: 25,
        mass: 1.0,
      } as const satisfies Transition,
      slow: {
        type: 'spring',
        stiffness: 260,
        damping: 22,
        mass: 1.2,
      } as const satisfies Transition,
    },
    effects: {
      fast: {
        duration: M3_MOTION_DURATIONS.s.short3,
        ease: M3_MOTION_EASINGS.tuples.emphasized,
      } as const satisfies Transition,
      default: {
        duration: M3_MOTION_DURATIONS.s.medium1,
        ease: M3_MOTION_EASINGS.tuples.emphasizedDecelerate,
      } as const satisfies Transition,
      slow: {
        duration: M3_MOTION_DURATIONS.s.medium4,
        ease: M3_MOTION_EASINGS.tuples.emphasizedDecelerate,
      } as const satisfies Transition,
    },
  },

  standard: {
    spatial: {
      fast: {
        type: 'spring',
        stiffness: 400,
        damping: 35,
        mass: 1.0,
      } as const satisfies Transition,
      default: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        mass: 1.0,
      } as const satisfies Transition,
      slow: {
        type: 'spring',
        stiffness: 220,
        damping: 28,
        mass: 1.2,
      } as const satisfies Transition,
    },
    effects: {
      fast: {
        duration: M3_MOTION_DURATIONS.s.short2,
        ease: M3_MOTION_EASINGS.tuples.standard,
      } as const satisfies Transition,
      default: {
        duration: M3_MOTION_DURATIONS.s.short4,
        ease: M3_MOTION_EASINGS.tuples.standardDecelerate,
      } as const satisfies Transition,
      slow: {
        duration: M3_MOTION_DURATIONS.s.medium2,
        ease: M3_MOTION_EASINGS.tuples.standardDecelerate,
      } as const satisfies Transition,
    },
  },

  // --- Specialized Interaction Presets ---
  /** Tactile button/card press feedback (scale 0.96-0.97) */
  press: {
    type: 'spring',
    stiffness: 500,
    damping: 25,
    mass: 0.5,
  } as const satisfies Transition,

  /** Subtle hover elevation/scale reaction */
  hover: {
    type: 'spring',
    stiffness: 400,
    damping: 30,
    mass: 0.8,
  } as const satisfies Transition,

  /** MD3 Switch thumb translation */
  switchThumb: {
    type: 'spring',
    stiffness: 500,
    damping: 30,
    mass: 0.8,
  } as const satisfies Transition,

  /** Sliding tab pill indicator */
  tabIndicator: {
    type: 'spring',
    stiffness: 400,
    damping: 30,
    mass: 0.8,
  } as const satisfies Transition,

  /** Dialog/Modal card spatial entrance and exit */
  modalCard: {
    enter: {
      duration: M3_MOTION_DURATIONS.s.medium4,
      ease: M3_MOTION_EASINGS.tuples.emphasizedDecelerate,
    } as const satisfies Transition,
    exit: {
      duration: M3_MOTION_DURATIONS.s.medium1,
      ease: M3_MOTION_EASINGS.tuples.standardAccelerate,
    } as const satisfies Transition,
  },

  /** Modal backdrop scrim fade (effects transition, strictly no overshoot) */
  modalBackdrop: {
    enter: {
      duration: M3_MOTION_DURATIONS.s.medium4,
      ease: M3_MOTION_EASINGS.tuples.standardDecelerate,
    } as const satisfies Transition,
    exit: {
      duration: M3_MOTION_DURATIONS.s.medium1,
      ease: M3_MOTION_EASINGS.tuples.standardAccelerate,
    } as const satisfies Transition,
  },

  /** Status snackbar entrance slide */
  snackbar: {
    type: 'spring',
    stiffness: 400,
    damping: 30,
    mass: 0.9,
  } as const satisfies Transition,

  /** 3D card mouse tilt tracking */
  cardTilt: {
    stiffness: 300,
    damping: 30,
    mass: 1.0,
  } as const,

  /** 3D card flip rotation */
  cardFlip: {
    type: 'spring',
    stiffness: 260,
    damping: 20,
    mass: 1.0,
  } as const satisfies Transition,

  /** Celestial theme toggle thumb and peek icon */
  celestialThumb: {
    type: 'spring',
    stiffness: 480,
    damping: 28,
    mass: 0.8,
  } as const satisfies Transition,
  celestialPeek: {
    type: 'spring',
    stiffness: 380,
    damping: 22,
    mass: 0.6,
  } as const satisfies Transition,

  /** Meridian language toggle flight puck */
  flightPuck: {
    type: 'spring',
    stiffness: 440,
    damping: 26,
    mass: 0.75,
  } as const satisfies Transition,

  /** TimeSheet analog clock needle physics */
  timeSheetCard: {
    type: 'spring',
    stiffness: 280,
    damping: 24,
    mass: 0.8,
  } as const satisfies Transition,
  timeSheetHour: {
    type: 'spring',
    stiffness: 260,
    damping: 23,
    mass: 0.9,
  } as const satisfies Transition,
  timeSheetMinute: {
    type: 'spring',
    stiffness: 290,
    damping: 24,
    mass: 0.7,
  } as const satisfies Transition,
  timeSheetDot: {
    type: 'spring',
    stiffness: 340,
    damping: 20,
    mass: 0.6,
  } as const satisfies Transition,

  /** MapSheet origami perspective fold & unfold */
  mapFold: {
    type: 'spring',
    stiffness: 100,
    damping: 20,
    mass: 1.2,
  } as const satisfies Transition,
  mapUnfold: {
    type: 'spring',
    stiffness: 75,
    damping: 18,
    mass: 1.4,
  } as const satisfies Transition,

  /** Hold button cancellation snap-back */
  holdReset: {
    type: 'spring',
    stiffness: 300,
    damping: 30,
    mass: 0.8,
  } as const satisfies Transition,
} as const;

/**
 * Canonical M3_MOTION export for MUI theme integration
 */
export const M3_MOTION = {
  easing: {
    emphasized: M3_MOTION_EASINGS.css.emphasized,
    emphasizedDecelerate: M3_MOTION_EASINGS.css.emphasizedDecelerate,
    emphasizedAccelerate: M3_MOTION_EASINGS.css.emphasizedAccelerate,
    standard: M3_MOTION_EASINGS.css.standard,
    standardDecelerate: M3_MOTION_EASINGS.css.standardDecelerate,
    standardAccelerate: M3_MOTION_EASINGS.css.standardAccelerate,
    expressiveStandard: M3_MOTION_EASINGS.css.expressiveStandard,
    expressiveDecelerate: M3_MOTION_EASINGS.css.expressiveDecelerate,
    expressiveAccelerate: M3_MOTION_EASINGS.css.expressiveAccelerate,
  },
  duration: {
    short1: M3_MOTION_DURATIONS.short1,
    short2: M3_MOTION_DURATIONS.short2,
    short3: M3_MOTION_DURATIONS.short3,
    short4: M3_MOTION_DURATIONS.short4,
    medium1: M3_MOTION_DURATIONS.medium1,
    medium2: M3_MOTION_DURATIONS.medium2,
    medium3: M3_MOTION_DURATIONS.medium3,
    medium4: M3_MOTION_DURATIONS.medium4,
    long1: M3_MOTION_DURATIONS.long1,
    long2: M3_MOTION_DURATIONS.long2,
    long3: M3_MOTION_DURATIONS.long3,
    long4: M3_MOTION_DURATIONS.long4,
    extraLong1: M3_MOTION_DURATIONS.extraLong1,
    extraLong2: M3_MOTION_DURATIONS.extraLong2,
    extraLong3: M3_MOTION_DURATIONS.extraLong3,
    extraLong4: M3_MOTION_DURATIONS.extraLong4,
  },
  spring: M3_SPRINGS,
} as const;

/**
 * Accessibility Helper:
 * Wraps a transition with fallback for users who prefer reduced motion.
 */
export function reducedMotionSafe(transition: Transition, shouldReduceMotion: boolean): Transition {
  if (!shouldReduceMotion) return transition;
  return {
    duration: M3_MOTION_DURATIONS.s.short3,
    ease: 'linear',
  };
}
