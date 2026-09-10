/**
 * Material Design 3 Expressive State Layer Opacities
 *
 * MD3 enforces strict opacities for interaction state overlays across components:
 * - Hover: 0.08 (8%)
 * - Focus: 0.12 (12%)
 * - Pressed: 0.12 (12%)
 * - Dragged: 0.16 (16%)
 *
 * Instead of arbitrary solid background color swaps, MD3 layers an on-surface or primary
 * tint at these exact opacities over the container.
 */

export const M3_STATE_OPACITIES = {
  hover: 0.08,
  focus: 0.12,
  pressed: 0.12,
  dragged: 0.16,
} as const;

export type M3StateInteraction = keyof typeof M3_STATE_OPACITIES;

export const M3_STATE_CSS_VARIABLES: Record<M3StateInteraction, string> = {
  hover: 'var(--md-sys-state-hover-opacity)',
  focus: 'var(--md-sys-state-focus-opacity)',
  pressed: 'var(--md-sys-state-pressed-opacity)',
  dragged: 'var(--md-sys-state-dragged-opacity)',
};
