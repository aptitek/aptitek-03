import cssPlugin from '@eslint/css';
import { cssTokensPlugin } from './css-tokens-plugin.js';

export const cssConfigs = [
  {
    files: ['**/*.css'],
    language: 'css/css',
    plugins: {
      css: cssPlugin,
      'css-tokens': cssTokensPlugin,
    },
    rules: {
      'css-tokens/no-raw-colors': 'error',
      'css-tokens/no-raw-font-family': 'error',
      'css-tokens/no-universal-transition': 'error',
      'css-tokens/no-tailwind-directives': 'error',
    },
  },
  {
    files: ['src/tokens/**', '**/tokens/**', '**/*token*.css', '**/*theme*.css'],
    rules: {
      'css-tokens/no-raw-colors': 'off',
      'css-tokens/no-raw-font-family': 'off',
    },
  },
];

export default cssConfigs;
