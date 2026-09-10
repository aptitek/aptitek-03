/**
 * Material Design 3 ESLint Rules: Icons
 * Disallows raw svg elements for icons and enforces rounded, unfilled Material Design 3 icons.
 * Theme-agnostic with configurable file exemptions.
 */

export const iconRules = {
  'no-raw-svg-icons': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Disallow raw <svg> elements and custom SVG glyph paths for icons. Use standard Material Design 3 rounded icons or <Icon /> instead.',
      },
      schema: [
        {
          type: 'object',
          properties: {
            exemptFiles: { type: 'array', items: { type: 'string' } },
          },
          additionalProperties: false,
        },
      ],
      messages: {
        noRawSvgIcon:
          "Raw <svg> elements for icons are forbidden. Use standard Material Design 3 rounded icons from '@mui/icons-material/*Rounded' or '<Icon />' instead.",
        noCustomStyledSvgIcon:
          "Custom styled('svg') icon '{{name}}' is forbidden. Use standard Material Design 3 rounded icons or '<Icon />' instead.",
        noCustomGlyphPath:
          "Hardcoding custom SVG icon path glyphs ('{{name}}') is forbidden. Use standard Material Design 3 rounded icons instead.",
      },
    },
    create(context) {
      const options = context.options?.[0] || {};
      const customExempt = options.exemptFiles || [];
      const defaultExempt = [
        '.test.',
        '.spec.',
        'ShapeDefs',
        'ClipDefs',
        'm3-eslint-rules',
        'm3-theme-rules',
      ];
      const allExempt = [...defaultExempt, ...customExempt];

      const filename = context.filename || context.getFilename?.() || '';
      if (allExempt.some((exempt) => filename.includes(exempt))) return {};

      return {
        JSXOpeningElement(node) {
          if (node.name?.type === 'JSXIdentifier' && node.name.name === 'svg') {
            context.report({ node, messageId: 'noRawSvgIcon' });
          }
        },
        CallExpression(node) {
          if (node.callee?.name === 'styled' && node.arguments?.[0]?.value === 'svg') {
            if (node.parent?.type === 'VariableDeclarator') {
              const varName = node.parent.id?.name || '';
              if (/(Icon|Glyph)$/i.test(varName)) {
                context.report({
                  node: node.parent,
                  messageId: 'noCustomStyledSvgIcon',
                  data: { name: varName },
                });
              }
            }
          }
        },
        VariableDeclarator(node) {
          if (node.id?.type === 'Identifier' && /(_ICON_PATH|_GLYPH_PATH)$/i.test(node.id.name)) {
            context.report({
              node,
              messageId: 'noCustomGlyphPath',
              data: { name: node.id.name },
            });
          }
        },
      };
    },
  },

  'enforce-rounded-icons': {
    meta: {
      type: 'problem',
      fixable: 'code',
      docs: {
        description:
          'Enforce rounded, unfilled icons from @mui/icons-material per Material Design 3 specifications.',
      },
      messages: {
        useRoundedIcon:
          "Material Design 3 requires rounded icons. Use '@mui/icons-material/{{suggested}}' instead of '@mui/icons-material/{{current}}'.",
        useUnfilledIcon:
          "Material Design 3 requires unfilled (FILL: 0) icons. Use '@mui/icons-material/{{suggested}}' instead of '@mui/icons-material/{{current}}'.",
      },
    },
    create(context) {
      const brandExceptions = new Set(['GitHub']);
      const filledToOutlineMap = {
        CheckCircleRounded: 'CheckCircleOutlineRounded',
        DeleteRounded: 'DeleteOutlineRounded',
        ErrorRounded: 'ErrorOutlineRounded',
        InfoRounded: 'InfoOutlineRounded',
        LockRounded: 'LockOutlineRounded',
      };

      function createIconFix(node, iconModule, suggested, fixer) {
        const fixes = [fixer.replaceText(node.source, `"@mui/icons-material/${suggested}"`)];
        const defaultSpec = node.specifiers?.find((s) => s.type === 'ImportDefaultSpecifier');
        if (defaultSpec && defaultSpec.local.name === `${iconModule}Icon`) {
          fixes.push(fixer.replaceText(defaultSpec.local, `${suggested}Icon`));
        }
        return fixes;
      }

      return {
        ImportDeclaration(node) {
          const importSource = node.source.value;
          if (
            typeof importSource !== 'string' ||
            !importSource.startsWith('@mui/icons-material/')
          ) {
            return;
          }
          const iconModule = importSource.slice('@mui/icons-material/'.length);
          if (brandExceptions.has(iconModule)) return;

          if (!iconModule.endsWith('Rounded')) {
            const suggested = `${iconModule}Rounded`;
            context.report({
              node,
              messageId: 'useRoundedIcon',
              data: { current: iconModule, suggested },
              fix: (fixer) => createIconFix(node, iconModule, suggested, fixer),
            });
          } else if (filledToOutlineMap[iconModule]) {
            const suggested = filledToOutlineMap[iconModule];
            context.report({
              node,
              messageId: 'useUnfilledIcon',
              data: { current: iconModule, suggested },
              fix: (fixer) => createIconFix(node, iconModule, suggested, fixer),
            });
          }
        },
      };
    },
  },
};

export default iconRules;
