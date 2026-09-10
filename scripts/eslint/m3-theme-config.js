import { m3ThemePlugin } from './m3-theme/index.js';
import {
  m3ForbidNativeElementsRule,
  restrictedImportsRule,
  restrictedSyntaxRule,
} from './restricted-rules.js';

export const m3ThemeRules = {
  'm3-theme/no-action-as-container-background': [
    'error',
    {
      allowed: ['rgba(0, 0, 0,'],
    },
  ],
  'm3-theme/allowed-theme-colors': [
    'error',
    {
      allowed: [
        'rgba(0, 0, 0,',
        'rgba(0,0,0,',
        'rgba(0, 43, 54,',
        'rgba(0, 255, 102,',
        'rgba(0, 229, 255,',
        'rgba(255, 255, 255,',
        'rgba(255,255,255,',
        'rgba(42, 161, 152,',
        'rgba(42,161,152,',
        '#00ff66',
      ],
    },
  ],
  'm3-theme/no-static-role-colors': 'error',
  'm3-theme/no-alpha-paper-surface': 'off',
  'm3-theme/no-dark-mode-black-shadow': 'off',
  'm3-theme/no-hardcoded-box-shadow': 'off',
  'm3-theme/no-raw-svg-icons': 'error',
  'm3-theme/enforce-rounded-icons': 'error',
  'm3-theme/enforce-motion-tokens': 'error',
  'm3-theme/enforce-shape-tokens': 'error',
  'm3-theme/enforce-spacing-tokens': 'error',
  'm3-theme/enforce-typography-tokens': 'error',
  'm3-theme/enforce-elevation-levels': 'off',
  'm3-theme/enforce-state-layers': 'off',
  'm3-theme/enforce-minimum-touch-target': 'error',
  'm3-theme/forbid-native-elements': m3ForbidNativeElementsRule,
};

export const m3Config = {
  files: ['**/*.{js,mjs,cjs,jsx,ts,tsx,astro}'],
  plugins: {
    'm3-theme': m3ThemePlugin,
  },
  rules: {
    ...m3ThemeRules,
    'no-restricted-imports': restrictedImportsRule,
    'no-restricted-syntax': restrictedSyntaxRule,
  },
};

export const tokensOverridesConfig = {
  files: ['src/tokens/**'],
  rules: {
    'no-restricted-syntax': 'off',
    'id-denylist': 'off',
    'm3-theme/no-static-role-colors': 'off',
    'm3-theme/no-alpha-paper-surface': 'off',
    'm3-theme/no-action-as-container-background': 'off',
    'm3-theme/no-dark-mode-black-shadow': 'off',
    'm3-theme/no-hardcoded-box-shadow': 'off',
    'm3-theme/no-raw-svg-icons': 'off',
    'm3-theme/enforce-rounded-icons': 'off',
    'm3-theme/allowed-theme-colors': 'off',
    'm3-theme/enforce-motion-tokens': 'off',
    'm3-theme/enforce-shape-tokens': 'off',
    'm3-theme/enforce-spacing-tokens': 'off',
    'm3-theme/enforce-typography-tokens': 'off',
    'm3-theme/enforce-elevation-levels': 'off',
    'm3-theme/enforce-state-layers': 'off',
    'm3-theme/enforce-minimum-touch-target': 'off',
  },
};

export const astroOverridesConfig = {
  files: ['**/*.astro'],
  rules: {
    'no-restricted-syntax': [
      'error',
      ...restrictedSyntaxRule.slice(1),
      {
        selector: "JSXAttribute[name.name='sx']",
        message:
          'Inline `sx` is forbidden in Astro templates. Place styles in clean CSS stylesheets.',
      },
      {
        selector: "JSXElement[openingElement.name.name='style']",
        message:
          'Raw `<style>` tags are forbidden in layout and template files. Place styles in clean CSS stylesheets and import them.',
      },
    ],
  },
};

export const layoutOverridesConfig = {
  files: ['src/layouts/**/*.{astro,jsx,tsx}', '**/*Layout*.astro'],
  rules: {
    'no-restricted-syntax': [
      'error',
      ...restrictedSyntaxRule.slice(1),
      {
        selector: "JSXElement[openingElement.name.name='div']",
        message:
          'Native `<div>` is forbidden in layout files (*Layout.astro, layouts/**). Use semantic HTML5 landmarks (<main>, <header>, <footer>, <section>, <article>, <aside>, <nav>) or component containers instead.',
      },
      {
        selector: "JSXElement[openingElement.name.name='style']",
        message:
          'Raw `<style>` tags are forbidden in layout files (*Layout.astro, layouts/**). Place styles in clean CSS stylesheets and import them.',
      },
      {
        selector: "JSXAttribute[name.name='style']",
        message:
          'Inline `style` attributes are forbidden in layout files. Place styles in clean CSS stylesheets.',
      },
      {
        selector: "JSXAttribute[name.name='sx']",
        message:
          'Inline `sx` is forbidden in layout files. Place styles in clean CSS stylesheets.',
      },
    ],
  },
};

export default m3Config;
