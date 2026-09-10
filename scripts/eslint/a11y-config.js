import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';

export const a11yConfig = {
  ...jsxA11yPlugin.flatConfigs.recommended,
  files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
  rules: {
    ...jsxA11yPlugin.flatConfigs.recommended.rules,
    // --- JSX Accessibility (a11y) - WCAG 2.1 AA Enforced ---
    'jsx-a11y/alt-text': 'error',
    'jsx-a11y/anchor-has-content': 'error',
    'jsx-a11y/anchor-is-valid': 'error',
    'jsx-a11y/aria-props': 'error',
    'jsx-a11y/aria-proptypes': 'error',
    'jsx-a11y/aria-role': 'error',
    'jsx-a11y/role-has-required-aria-props': 'error',
    'jsx-a11y/role-supports-aria-props': 'error',
    'jsx-a11y/aria-unsupported-elements': 'error',
    'jsx-a11y/heading-has-content': 'error',
    'jsx-a11y/html-has-lang': 'error',
    'jsx-a11y/no-redundant-roles': 'error',
    'jsx-a11y/no-interactive-element-to-noninteractive-role': 'error',
    'jsx-a11y/no-noninteractive-element-to-interactive-role': 'error',
    'jsx-a11y/interactive-supports-focus': 'error',
    'jsx-a11y/tabindex-no-positive': 'error',
    'jsx-a11y/click-events-have-key-events': 'error',
    'jsx-a11y/no-static-element-interactions': 'error',
    'jsx-a11y/no-noninteractive-element-interactions': 'error',
    'jsx-a11y/mouse-events-have-key-events': 'error',
    'jsx-a11y/label-has-associated-control': 'error',
    'jsx-a11y/control-has-associated-label': [
      'warn',
      {
        ignoreElements: ['audio', 'canvas', 'embed', 'input', 'textarea', 'tr', 'video'],
        ignoreRoles: [
          'grid',
          'listbox',
          'menu',
          'menubar',
          'radiogroup',
          'row',
          'tablist',
          'toolbar',
          'tree',
          'treegrid',
        ],
        includeRoles: [
          'button',
          'link',
          'checkbox',
          'menuitem',
          'menuitemcheckbox',
          'menuitemradio',
          'option',
          'radio',
          'switch',
          'tab',
        ],
      },
    ],
    'jsx-a11y/no-autofocus': [
      'warn',
      {
        ignoreNonDOM: true,
      },
    ],
  },
};

export default a11yConfig;
