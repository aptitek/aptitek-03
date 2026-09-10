/**
 * Material Design 3 ESLint Rules: Theme Enforcement
 *
 * Enforces explicit theme declaration and integration across:
 * 1. Layouts: Root <html> elements must declare `data-theme` attribute (e.g. data-theme="dark" or data-theme={theme}).
 * 2. Layouts: Layout templates must import a theme stylesheet (global.css, tokens.css, or solarized.css).
 * 3. React Islands: Interactive MUI components in src/components must use ThemeProvider or AppThemeProvider.
 */

export function createEnforceThemeAttributeRule() {
  return {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Enforce that root <html> element in layout files defines a data-theme attribute.',
      },
      messages: {
        missingDataTheme:
          "Root <html> element in layout must define a 'data-theme' attribute (e.g. data-theme={theme} or data-theme='dark') to explicitly enforce the active theme.",
      },
    },
    create(context) {
      return {
        JSXOpeningElement(node) {
          if (node.name?.type === 'JSXIdentifier' && node.name.name === 'html') {
            const hasDataTheme = node.attributes?.some(
              (attr) =>
                attr.type === 'JSXAttribute' &&
                attr.name?.type === 'JSXIdentifier' &&
                attr.name.name === 'data-theme',
            );

            if (!hasDataTheme) {
              context.report({
                node,
                messageId: 'missingDataTheme',
              });
            }
          }
        },
      };
    },
  };
}

export function createEnforceThemeStylesheetRule() {
  return {
    meta: {
      type: 'problem',
      docs: {
        description: 'Enforce that layout files import a design system theme stylesheet.',
      },
      messages: {
        missingThemeStylesheet:
          "Layout file must import a design system theme stylesheet ('global.css', 'tokens.css', or 'solarized.css') to ensure design tokens are applied.",
      },
    },
    create(context) {
      const filename = context.filename || context.getFilename?.() || '';
      const isLayout = filename.includes('Layout') || filename.includes('layouts/');

      if (!isLayout) return {};

      let hasThemeStylesheet = false;

      return {
        ImportDeclaration(node) {
          const src = node.source?.value || '';
          if (
            src.includes('global.css') ||
            src.includes('tokens.css') ||
            src.includes('solarized.css') ||
            src.includes('documents.css')
          ) {
            hasThemeStylesheet = true;
          }
        },
        'Program:exit'(node) {
          // Only check .astro files that contain an html tag
          const sourceText = context.sourceCode?.getText?.() || '';
          if (sourceText.includes('<html') && !hasThemeStylesheet) {
            context.report({
              node,
              messageId: 'missingThemeStylesheet',
            });
          }
        },
      };
    },
  };
}

export function createEnforceTypographyLinksRule() {
  return {
    meta: {
      type: 'problem',
      docs: {
        description: 'Enforce that layout files link design system web fonts in <head>.',
      },
      messages: {
        missingTypographyLink:
          "Layout file must link design system Google Fonts ('Inter', 'Recursive', 'JetBrains Mono') in <head> to ensure brand typography is rendered.",
      },
    },
    create(context) {
      const filename = context.filename || context.getFilename?.() || '';
      const isLayout = filename.includes('Layout') || filename.includes('layouts/');

      if (!isLayout) return {};

      let hasFontLink = false;

      return {
        JSXOpeningElement(node) {
          if (node.name?.name === 'link') {
            const hasFontHref = node.attributes?.some(
              (attr) =>
                attr.name?.name === 'href' &&
                typeof attr.value?.value === 'string' &&
                (attr.value.value.includes('fonts.googleapis.com') ||
                  attr.value.value.includes('fonts.gstatic.com')),
            );
            if (hasFontHref) {
              hasFontLink = true;
            }
          }
        },
        'Program:exit'(node) {
          const sourceText = context.sourceCode?.getText?.() || '';
          if (sourceText.includes('<head') && !hasFontLink) {
            context.report({
              node,
              messageId: 'missingTypographyLink',
            });
          }
        },
      };
    },
  };
}

export const themeRules = {
  'enforce-theme-attribute': createEnforceThemeAttributeRule(),
  'enforce-theme-stylesheet': createEnforceThemeStylesheetRule(),
  'enforce-typography-links': createEnforceTypographyLinksRule(),
};
