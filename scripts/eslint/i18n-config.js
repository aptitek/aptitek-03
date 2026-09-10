import i18nextPlugin from 'eslint-plugin-i18next';

export const i18nConfig = {
  files: ['src/**/*.{jsx,tsx}'],
  plugins: {
    i18next: i18nextPlugin,
  },
  rules: {
    'i18next/no-literal-string': [
      'error',
      {
        mode: 'jsx-only',
        'jsx-attributes': {
          include: [
            'title',
            'aria-label',
            'aria-placeholder',
            'aria-roledescription',
            'aria-valuetext',
            'label',
            'placeholder',
            'alt',
            'helperText',
          ],
          exclude: [
            'className',
            'style',
            'sx',
            'id',
            'key',
            'to',
            'href',
            'src',
            'data-testid',
            'color',
            'size',
            'variant',
            'type',
            'placement',
            'component',
            'target',
            'rel',
          ],
        },
      },
    ],
  },
};

export const i18nOverridesConfig = {
  files: [
    'src/**/*.stories.{ts,tsx,js,jsx}',
    '**/*.test.{ts,tsx,js,jsx}',
    '**/*.spec.{ts,tsx,js,jsx}',
    'src/tokens/**',
  ],
  rules: {
    'i18next/no-literal-string': 'off',
  },
};

export default i18nConfig;
