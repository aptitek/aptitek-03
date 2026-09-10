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
import { i18nConfig, i18nOverridesConfig } from './scripts/eslint/i18n-config.js';
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
    rules: {
      // Cognitive complexity ceiling
      complexity: ['error', 10],
      'max-depth': ['error', 4],
      'max-nested-callbacks': ['error', 3],
      'max-params': ['error', 4],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-alert': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'no-throw-literal': 'error',
      'no-return-assign': ['error', 'always'],
      'no-param-reassign': ['error', { props: true }],
      'no-shadow': 'off', // Superseded by @typescript-eslint/no-shadow
    },
  },
  ...tseslint.configs.strictTypeChecked.map((cfg) => ({
    ...cfg,
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
  })),
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['.*.mjs', '.*.js'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/no-unsafe-argument': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/strict-boolean-expressions': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
    },
  },

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
      'max-nested-callbacks': ['error', 5],
      'no-param-reassign': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',
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
    files: ['**/*.stories.{ts,tsx,js,jsx}', '**/*.stories.mdx', '.storybook/**', 'stories/**'],
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
      complexity: 'off',
      'max-params': 'off',
      'max-nested-callbacks': 'off',
      'no-param-reassign': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/prefer-optional-chain': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/restrict-plus-operands': 'off',
      '@typescript-eslint/no-redundant-type-constituents': 'off',
      '@typescript-eslint/no-misused-spread': 'off',
      '@typescript-eslint/use-unknown-in-catch-callback-variable': 'off',
      '@typescript-eslint/no-deprecated': 'off',
    },
  },

  // CSS Token Enforcement
  ...cssConfigs,

  // Prettier must come last to override formatting rules
  eslintConfigPrettier,
);
