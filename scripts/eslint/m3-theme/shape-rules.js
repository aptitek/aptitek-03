/**
 * Material Design 3 ESLint Rules: Shapes & Corner Radii
 * Enforces Material Design 3 Shape Corner Radius Scale and centralized expressive shape morphing.
 * Theme-agnostic with support for custom allowed values.
 */

const APPROVED_CORNER_NUMBERS = new Set([
  0, 4, 8, 12, 16, 20, 28, 32, 48, 9999,
]);

const APPROVED_CORNER_STRINGS = new Set([
  '0',
  '0px',
  '4px',
  '8px',
  '12px',
  '16px',
  '20px',
  '28px',
  '32px',
  '48px',
  '9999px',
  '50%',
  '100%',
  'inherit',
  'initial',
  'unset',
]);

const CORNER_PROPERTY_NAMES = new Set([
  'borderRadius',
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderBottomLeftRadius',
  'borderBottomRightRadius',
  'borderStartStartRadius',
  'borderStartEndRadius',
  'borderEndStartRadius',
  'borderEndEndRadius',
]);

const SCALE_ENTRIES = [
  { name: 'none', val: 0 },
  { name: 'extraSmall', val: 4 },
  { name: 'small', val: 8 },
  { name: 'medium', val: 12 },
  { name: 'large', val: 16 },
  { name: 'largeIncreased', val: 20 },
  { name: 'extraLarge', val: 28 },
  { name: 'extraLargeIncreased', val: 32 },
  { name: 'extraExtraLarge', val: 48 },
  { name: 'full', val: 9999 },
];

function getClosestTokenHint(num) {
  if (typeof num !== 'number' || isNaN(num)) return '';
  let closest = SCALE_ENTRIES[0];
  let minDiff = Math.abs(num - closest.val);
  for (const entry of SCALE_ENTRIES) {
    const diff = Math.abs(num - entry.val);
    if (diff < minDiff) {
      minDiff = diff;
      closest = entry;
    }
  }
  return ` (closest: 'M3_SHAPE_CORNERS.${closest.name}' [${closest.val}px])`;
}

export const shapeRules = {
  'enforce-shape-tokens': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Enforce Material Design 3 Shape Corner Radius Scale and centralized expressive shape morphing. Disallow non-standard borderRadius numbers and raw material-shapes-ts imports outside tokens.',
      },
      schema: [
        {
          type: 'object',
          properties: {
            allowed: { type: 'array', items: { type: 'string' } },
          },
          additionalProperties: false,
        },
      ],
      messages: {
        noUnapprovedCornerRadius:
          "Non-standard corner radius '{{value}}' detected{{suggestionHint}}. Use Material Design 3 corner scale tokens from shape tokens (e.g. 'M3_SHAPE_CORNERS.small' [8px], 'medium' [12px], 'large' [16px], 'largeIncreased' [20px], 'extraLarge' [28px], 'full' [9999px]) or add to allowed whitelist in eslint config.",
        noDirectMaterialShapesImport:
          "Direct import from 'material-shapes-ts' is forbidden in UI components. Use the centralized expressive shape engine from shape tokens ('animateExpressiveMorph', 'getMorphPath', 'MaterialShapes').",
      },
    },
    create(context) {
      const options = context.options?.[0] || {};
      const allowedList = new Set(options.allowed || []);
      const filename = context.filename || context.getFilename?.() || '';

      const isTokenOrTest =
        filename.includes('tokens/shapes') ||
        filename.includes('tokens/theme') ||
        filename.includes('.test.') ||
        filename.includes('.spec.');

      function isAllowed(val) {
        if (val === undefined || val === null) return false;
        const str = String(val).trim();
        return (
          allowedList.has(str) ||
          Array.from(allowedList).some((pat) => pat && str.includes(pat))
        );
      }

      function checkRadiusValue(valNode, reportNode) {
        if (!valNode) return;

        // Number literal check
        if (valNode.type === 'Literal' && typeof valNode.value === 'number') {
          const num = valNode.value;
          if (APPROVED_CORNER_NUMBERS.has(num) || isAllowed(num)) return;
          context.report({
            node: reportNode,
            messageId: 'noUnapprovedCornerRadius',
            data: {
              value: String(num),
              suggestionHint: getClosestTokenHint(num),
            },
          });
          return;
        }

        // String literal check
        if (valNode.type === 'Literal' && typeof valNode.value === 'string') {
          const rawStr = valNode.value.trim().toLowerCase();
          const cleanStr = rawStr.replace(/\s*!important\s*$/i, '').trim();

          if (
            cleanStr.startsWith('var(--') ||
            APPROVED_CORNER_STRINGS.has(cleanStr) ||
            isAllowed(rawStr) ||
            isAllowed(cleanStr)
          ) {
            return;
          }

          // Flag explicit single pixel values (e.g. 6px, 10px, 14px, 15px)
          const pxMatch = /^(\d+(?:\.\d+)?)px$/i.exec(cleanStr);
          if (pxMatch) {
            const num = parseFloat(pxMatch[1]);
            if (APPROVED_CORNER_NUMBERS.has(num)) return;
            context.report({
              node: reportNode,
              messageId: 'noUnapprovedCornerRadius',
              data: {
                value: rawStr,
                suggestionHint: getClosestTokenHint(num),
              },
            });
            return;
          }

          // For multi-corner strings like "16px 16px 0 0", "8px 8px 0 0"
          const parts = cleanStr.split(/\s+/).filter(Boolean);
          if (parts.length >= 2 && parts.length <= 4) {
            const allApproved = parts.every((p) => {
              if (p === '0' || p === '0px') return true;
              const m = /^(\d+(?:\.\d+)?)px$/i.exec(p);
              return m ? APPROVED_CORNER_NUMBERS.has(parseFloat(m[1])) : false;
            });
            if (allApproved) return;

            context.report({
              node: reportNode,
              messageId: 'noUnapprovedCornerRadius',
              data: {
                value: rawStr,
                suggestionHint: '',
              },
            });
            return;
          }

          if (/\d+px/i.test(cleanStr)) {
            const numMatch = /\d+/i.exec(cleanStr);
            const num = numMatch ? parseInt(numMatch[0], 10) : NaN;
            context.report({
              node: reportNode,
              messageId: 'noUnapprovedCornerRadius',
              data: {
                value: rawStr,
                suggestionHint: getClosestTokenHint(num),
              },
            });
          }
          return;
        }

        // Template literal check (e.g. `10px` or `${x}px`)
        if (valNode.type === 'TemplateLiteral') {
          for (const quasi of valNode.quasis || []) {
            const rawStr = quasi.value?.raw?.trim().toLowerCase();
            if (!rawStr) continue;
            const matches = rawStr.match(/\b\d+px\b/gi) || [];
            for (const m of matches) {
              const num = parseFloat(m);
              const isApproved = APPROVED_CORNER_NUMBERS.has(num);
              if (!isApproved && !isAllowed(m) && !isAllowed(num)) {
                context.report({
                  node: reportNode,
                  messageId: 'noUnapprovedCornerRadius',
                  data: {
                    value: m,
                    suggestionHint: getClosestTokenHint(num),
                  },
                });
              }
            }
          }
        }
      }

      return {
        ImportDeclaration(node) {
          if (isTokenOrTest) return;
          if (node.source?.value === 'material-shapes-ts') {
            context.report({
              node,
              messageId: 'noDirectMaterialShapesImport',
            });
          }
        },

        ImportExpression(node) {
          if (isTokenOrTest) return;
          if (
            node.source?.type === 'Literal' &&
            node.source.value === 'material-shapes-ts'
          ) {
            context.report({
              node,
              messageId: 'noDirectMaterialShapesImport',
            });
          }
        },

        CallExpression(node) {
          if (isTokenOrTest) return;
          const isRequire =
            node.callee?.name === 'require' &&
            node.arguments?.[0]?.type === 'Literal' &&
            node.arguments[0].value === 'material-shapes-ts';
          if (isRequire) {
            context.report({
              node,
              messageId: 'noDirectMaterialShapesImport',
            });
          }
        },

        Property(node) {
          if (isTokenOrTest) return;
          const key = node.key?.name || node.key?.value;
          if (CORNER_PROPERTY_NAMES.has(key)) {
            checkRadiusValue(node.value, node);
          }
        },

        JSXAttribute(node) {
          if (isTokenOrTest) return;
          const name = node.name?.name;
          if (CORNER_PROPERTY_NAMES.has(name)) {
            const val = node.value?.expression || node.value;
            checkRadiusValue(val, node);
          }
        },
      };
    },
  },
};

export default shapeRules;
