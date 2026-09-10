import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginAstro from 'eslint-plugin-astro';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import eslintPluginStorybook from 'eslint-plugin-storybook';
import playwright from 'eslint-plugin-playwright';
import vitest from '@vitest/eslint-plugin';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';

import { a11yConfig } from './scripts/eslint/a11y-config.js';
import {
  i18nConfig,
  i18nOverridesConfig,
} from './scripts/eslint/i18n-config.js';
import {
  m3Config,
  tokensOverridesConfig,
  astroOverridesConfig,
  layoutOverridesConfig,
} from './scripts/eslint/m3-theme-config.js';
import { cssConfigs } from './scripts/eslint/css-config.js';
import { forbidElementsRule } from './scripts/eslint/restricted-rules.js';

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      '.astro/**',
      'node_modules/**',
      'storybook-static/**',
      'test-results/**',
      'playwright-report/**',
      '.husky/**',
      'coverage/**',
      '.agents/**',
      '.wireit/**',
    ],
  },
  {
    ...js.configs.recommended,
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
  },
  ...tseslint.configs.recommended.map((cfg) => ({
    ...cfg,
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
  })),

  // React & React Hooks configuration
  {
    files: ['**/*.{jsx,tsx}'],
    ...eslintPluginReact.configs.flat.recommended,
    ...eslintPluginReact.configs.flat['jsx-runtime'],
    settings: {
      react: {
        version: '19.0',
      },
    },
    rules: {
      ...eslintPluginReact.configs.flat.recommended.rules,
      ...eslintPluginReact.configs.flat['jsx-runtime'].rules,
      'react/forbid-elements': forbidElementsRule,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      'react-hooks': eslintPluginReactHooks,
    },
    rules: {
      ...eslintPluginReactHooks.configs.recommended.rules,
    },
  },

  // Strict Accessibility (a11y) - WCAG 2.1 AA
  a11yConfig,

  // Astro recommended & Astro accessibility (a11y)
  ...eslintPluginAstro.configs['flat/recommended'],
  ...eslintPluginAstro.configs['flat/jsx-a11y-recommended'],

  // Strict Internationalization (i18n)
  i18nConfig,
  i18nOverridesConfig,

  // Material Design 3 Theming & Token Overrides
  m3Config,
  tokensOverridesConfig,
  astroOverridesConfig,
  layoutOverridesConfig,

  // Vitest unit & integration tests overrides
  {
    files: ['**/*.test.{ts,tsx,js,jsx}', 'tests/unit/**/*.{ts,tsx,js,jsx}'],
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules,
      'no-restricted-syntax': 'off',
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
  },

  // Playwright E2E tests
  {
    files: ['tests/e2e/**/*.{ts,js}', '**/*.spec.{ts,js}'],
    ...playwright.configs['flat/recommended'],
  },

  // Storybook stories & overrides
  ...eslintPluginStorybook.configs['flat/recommended'],
  {
    files: [
      '**/*.stories.{ts,tsx,js,jsx}',
      '**/*.stories.mdx',
      '.storybook/**',
      'stories/**',
    ],
    rules: {
      'no-restricted-syntax': 'off',
      'm3-theme/no-action-as-container-background': 'off',
      'm3-theme/allowed-theme-colors': 'off',
      'm3-theme/enforce-motion-tokens': 'off',
      'm3-theme/enforce-shape-tokens': 'off',
      'm3-theme/enforce-spacing-tokens': 'off',
      'm3-theme/enforce-typography-tokens': 'off',
      'm3-theme/enforce-elevation-levels': 'off',
      'm3-theme/enforce-state-layers': 'off',
      'm3-theme/enforce-minimum-touch-target': 'off',
    },
  },

  // Scripts and config files
  {
    files: ['scripts/**', '*.config.{ts,js,mjs}', 'vitest.shims.d.ts'],
    rules: {
      'no-console': 'off',
      'no-restricted-syntax': 'off',
    },
  },

  // CSS Token Enforcement
  ...cssConfigs,

  // Prettier must come last to override formatting rules
  eslintConfigPrettier,
);
