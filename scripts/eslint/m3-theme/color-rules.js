/**
 * Material Design 3 ESLint Rules: Color System & Elevation Shadows
 * Theme-agnostic color checks, dynamic role colors, alpha paper surfaces, and dark-mode elevation.
 */

import {
  hasBackdropFilter,
  isAlphaPaperCall,
  isInsideApplyStylesDark,
} from './helpers.js';

export const colorRules = {
  'allowed-theme-colors': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Enforce that raw colors match approved whitelist in eslint config.',
      },
      schema: [
        {
          type: 'object',
          properties: { allowed: { type: 'array', items: { type: 'string' } } },
          additionalProperties: false,
        },
      ],
      messages: {
        unallowedColor:
          "Hardcoded color '{{value}}' is not in the allowed color whitelist. Use theme semantic tokens, CSS variables, or add '{{value}}' to the allowed whitelist in eslint config.",
      },
    },
    create(context) {
      const options = context.options?.[0] || {};
      const allowedPatterns = (options.allowed || []).map((c) =>
        c.toLowerCase().trim(),
      );
      const HEX_REGEX = /^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
      const FN_REGEX = /^(rgb|hsl)a?\s*\(/i;

      function checkColorValue(val, targetNode) {
        if (typeof val !== 'string') return;
        const trimmed = val.trim().toLowerCase();
        if (
          trimmed.startsWith('var(--') ||
          trimmed === 'transparent' ||
          trimmed === 'inherit' ||
          trimmed === 'currentcolor'
        ) {
          return;
        }
        if (allowedPatterns.some((pattern) => trimmed.includes(pattern))) {
          return;
        }
        if (HEX_REGEX.test(val.trim()) || FN_REGEX.test(val.trim())) {
          context.report({
            node: targetNode,
            messageId: 'unallowedColor',
            data: { value: val.trim() },
          });
        }
      }

      return {
        Literal(node) {
          if (typeof node.value === 'string') checkColorValue(node.value, node);
        },
        TemplateElement(node) {
          if (typeof node.value?.raw === 'string') {
            checkColorValue(node.value.raw, node);
          }
        },
      };
    },
  },

  'no-static-role-colors': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Disallow direct references to static ROLE_COLORS. Use dynamic theme tokens or CSS variables.',
      },
      messages: {
        noStaticRoleColors:
          "Static '{{name}}' is forbidden in UI components. Use 'theme.palette.roles' or CSS variables to ensure full compatibility with dynamic theming and debug theme switching.",
      },
    },
    create(context) {
      return {
        ImportSpecifier(node) {
          if (
            node.imported?.name === 'ROLE_COLORS' ||
            node.imported?.name === 'DEFAULT_ROLE_COLORS'
          ) {
            context.report({
              node,
              messageId: 'noStaticRoleColors',
              data: { name: node.imported.name },
            });
          }
        },
        Identifier(node) {
          if (
            node.name === 'ROLE_COLORS' ||
            node.name === 'DEFAULT_ROLE_COLORS'
          ) {
            const pType = node.parent?.type;
            if (
              pType !== 'ImportSpecifier' &&
              pType !== 'ExportSpecifier' &&
              pType !== 'TSInterfaceDeclaration' &&
              pType !== 'TSTypeAliasDeclaration'
            ) {
              context.report({
                node,
                messageId: 'noStaticRoleColors',
                data: { name: node.name },
              });
            }
          }
        },
      };
    },
  },

  'no-alpha-paper-surface': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Disallow arbitrary alpha on background.paper/default without a backdropFilter.',
      },
      messages: {
        noAlphaPaper:
          "Arbitrary opacity on background.paper/default is forbidden for container surfaces. Use Material Design 3 surface container tokens ('theme.palette.surfaceContainerLow', 'surfaceContainer', etc.) instead.",
      },
    },
    create(context) {
      return {
        Property(node) {
          const key = node.key?.name || node.key?.value;
          if (key !== 'backgroundColor' && key !== 'bgcolor') return;
          if (!isAlphaPaperCall(node.value)) return;
          const parentObject =
            node.parent?.type === 'ObjectExpression' ? node.parent : null;
          if (parentObject && !hasBackdropFilter(parentObject)) {
            context.report({ node, messageId: 'noAlphaPaper' });
          }
        },
      };
    },
  },

  'no-dark-mode-black-shadow': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Disallow black drop-shadows in dark mode. Elevation in dark theme uses surface containers or perimeter highlight rings.',
      },
      messages: {
        noDarkBlackShadow:
          "Dark mode elevation violation: Black drop-shadows are forbidden in dark mode. Use surface container elevation tones or perimeter highlight rings ('0 0 0 1px ...') per Material Design 3 elevation spec.",
      },
    },
    create(context) {
      return {
        Property(node) {
          const key = node.key?.name || node.key?.value;
          if (key !== 'boxShadow' && key !== 'filter') return;
          if (!isInsideApplyStylesDark(node)) return;
          const rawVal =
            (context.sourceCode || context.getSourceCode?.())?.getText(
              node.value,
            ) || '';
          if (
            /rgba\(\s*0\s*,\s*0\s*,\s*0\s*,/i.test(rawVal) ||
            /common\.black/i.test(rawVal)
          ) {
            context.report({ node, messageId: 'noDarkBlackShadow' });
          }
        },
      };
    },
  },

  'no-hardcoded-box-shadow': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Disallow raw shadow strings in component styles. Use theme.shadows[...] instead.',
      },
      messages: {
        noHardcodedShadow:
          "Hardcoded boxShadow string detected. Use '(theme) => theme.shadows[1]' or semantic elevation tokens to support proper dark-mode elevation.",
      },
    },
    create(context) {
      return {
        Property(node) {
          const key = node.key?.name || node.key?.value;
          if (key !== 'boxShadow') return;
          if (
            node.value?.type === 'Literal' &&
            typeof node.value.value === 'string' &&
            /rgba\(\s*0\s*,\s*0\s*,\s*0\s*,/i.test(node.value.value)
          ) {
            context.report({ node, messageId: 'noHardcodedShadow' });
          }
        },
      };
    },
  },
};

export default colorRules;
