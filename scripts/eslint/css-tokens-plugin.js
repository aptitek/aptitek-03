const HEX_COLOR_PATTERN = /#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/;
const RAW_COLOR_FN_PATTERN = /\b(rgba?|hsla?|hwb|lab|lch|oklab|oklch)\s*\(/i;

export const cssTokensPlugin = {
  meta: {
    name: 'eslint-plugin-css-tokens',
  },
  rules: {
    'no-raw-colors': {
      meta: {
        type: 'problem',
        docs: {
          description:
            'Disallow raw #hex or rgba()/rgb() colors in CSS files that are not base tokens.',
          recommended: true,
        },
        schema: [
          {
            type: 'object',
            properties: {
              allowed: {
                type: 'array',
                items: { type: 'string' },
              },
            },
            additionalProperties: false,
          },
        ],
        messages: {
          noRawHex:
            "Hardcoded hex color '{{value}}' detected in CSS. Use design tokens (e.g. var(--color-*)) instead.",
          noRawColorFn:
            "Hardcoded '{{func}}()' color detected in CSS. Use design tokens (e.g. var(--color-*)) instead.",
        },
      },
      create(context) {
        const options = context.options?.[0] || {};
        const allowedPatterns = (options.allowed || []).map((c) =>
          c.toLowerCase().trim(),
        );

        return {
          Hash(node) {
            const hexVal = `#${node.value}`.toLowerCase();
            if (allowedPatterns.some((p) => hexVal.includes(p))) return;
            context.report({
              loc: node.loc,
              messageId: 'noRawHex',
              data: { value: `#${node.value}` },
            });
          },
          Function(node) {
            if (/^(rgba?|hsla?|hwb|lab|lch|oklab|oklch)$/i.test(node.name)) {
              const fnName = node.name.toLowerCase();
              if (allowedPatterns.some((p) => fnName.includes(p))) return;
              context.report({
                loc: node.loc,
                messageId: 'noRawColorFn',
                data: { func: node.name },
              });
            }
          },
          Declaration(node) {
            if (node.value && node.value.type === 'Raw') {
              const rawVal = (node.value.value || '').toLowerCase();
              if (allowedPatterns.some((p) => rawVal.includes(p))) return;
              const hexMatch = HEX_COLOR_PATTERN.exec(rawVal);
              if (hexMatch) {
                context.report({
                  loc: node.loc,
                  messageId: 'noRawHex',
                  data: { value: hexMatch[0] },
                });
              }
              const fnMatch = RAW_COLOR_FN_PATTERN.exec(rawVal);
              if (fnMatch) {
                context.report({
                  loc: node.loc,
                  messageId: 'noRawColorFn',
                  data: { func: fnMatch[1] },
                });
              }
            }
          },
        };
      },
    },

    'no-universal-transition': {
      meta: {
        type: 'problem',
        docs: {
          description:
            'Disallow broad transitions on universal wildcard selectors (*, ::before, ::after).',
          recommended: true,
        },
        messages: {
          noUniversalTransition:
            "Universal wildcard transition detected on '*' or '::before/::after'. Broad transitions cause severe browser paint thrashing. Scope transitions to explicit component classes.",
        },
      },
      create(context) {
        return {
          Rule(node) {
            const hasWildcard = node.prelude?.children?.some((sel) => {
              return sel.children?.some(
                (child) =>
                  (child.type === 'TypeSelector' && child.name === '*') ||
                  (child.type === 'PseudoElementSelector' &&
                    (child.name === 'before' || child.name === 'after')),
              );
            });
            if (hasWildcard) {
              const hasTransition = node.block?.children?.some(
                (decl) =>
                  decl.type === 'Declaration' &&
                  typeof decl.property === 'string' &&
                  decl.property.startsWith('transition'),
              );
              if (hasTransition) {
                context.report({
                  loc: node.loc,
                  messageId: 'noUniversalTransition',
                });
              }
            }
          },
        };
      },
    },

    'no-tailwind-directives': {
      meta: {
        type: 'problem',
        docs: {
          description:
            'Disallow deprecated Tailwind CSS directives (@theme, @layer, and @import "tailwindcss").',
          recommended: true,
        },
        messages: {
          noTailwindAtRule:
            "Tailwind directive '@{{name}}' detected. Tailwind is disallowed in favor of Material Design 3 tokens.",
          noTailwindImport:
            'Tailwind import \'@import "tailwindcss"\' detected. Tailwind is disallowed in favor of Material Design 3 tokens.',
        },
      },
      create(context) {
        return {
          Atrule(node) {
            if (node.name === 'theme' || node.name === 'layer') {
              context.report({
                loc: node.loc,
                messageId: 'noTailwindAtRule',
                data: { name: node.name },
              });
            } else if (node.name === 'import') {
              const isTailwind = node.prelude?.children?.some(
                (child) =>
                  (typeof child.value === 'string' &&
                    child.value.includes('tailwind')) ||
                  (typeof child.name === 'string' &&
                    child.name.includes('tailwind')),
              );
              if (isTailwind) {
                context.report({
                  loc: node.loc,
                  messageId: 'noTailwindImport',
                });
              }
            }
          },
        };
      },
    },
  },
};

export default cssTokensPlugin;
