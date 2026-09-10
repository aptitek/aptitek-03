/**
 * ESLint Plugin: eslint-plugin-m3-theme
 *
 * Enforces Material Design 3 design system architecture, dynamic theme awareness,
 * surface containers, dark mode elevation specifications, rounded unfilled icons,
 * tokenized motion physics (M3_SPRINGS, M3_MOTION_DURATIONS, M3_MOTION_EASINGS),
 * and strict token-driven geometry.
 */

import { createContainerBackgroundRule } from './helpers.js';
import { colorRules } from './color-rules.js';
import { elevationRules } from './elevation-rules.js';
import { iconRules } from './icon-rules.js';
import { motionRules } from './motion-rules.js';
import { shapeRules } from './shape-rules.js';
import { spacingRules } from './spacing-rules.js';
import { stateRules } from './state-rules.js';
import { typographyRules } from './typography-rules.js';
import { elementRules } from './element-rules.js';
import { themeRules } from './theme-rules.js';

export const m3ThemePlugin = {
  meta: { name: 'eslint-plugin-m3-theme' },
  rules: {
    'no-action-as-container-background': createContainerBackgroundRule(),
    'allowed-container-background': createContainerBackgroundRule(),
    ...colorRules,
    ...elevationRules,
    ...iconRules,
    ...motionRules,
    ...shapeRules,
    ...spacingRules,
    ...stateRules,
    ...typographyRules,
    ...elementRules,
    ...themeRules,
  },
};

export default m3ThemePlugin;
