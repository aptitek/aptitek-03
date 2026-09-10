/**
 * Material Design 3 ESLint Rules: Spacing, Dimensions & Line Thickness (Strokes)
 *
 * Enforces:
 * 1. M3 8dp baseline grid and granular half-step tokens across padding, margin, and gap.
 * 2. M3 Line thickness / stroke scale (hairline, thin, medium, thick, heavy, expressive).
 * 3. M3 / WCAG 2.5.5 minimum 48x48 dp touch target boundary on interactive elements.
 *
 * Theme-agnostic with support for custom allowed values.
 */

const APPROVED_SPACING_PIXELS = new Set([
  0, 1, 2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96, 120, 160,
]);

const APPROVED_MUI_MULTIPLIERS = new Set([
  0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 10, 12, 15,
  20,
]);

const SVG_SHAPE_TAGS = new Set([
  'path',
  'circle',
  'line',
  'polyline',
  'polygon',
  'rect',
  'ellipse',
]);

const APPROVED_STROKE_WIDTHS = new Set([0, 0.5, 1, 1.5, 2, 3, 4, 6]);

const APPROVED_KEYWORDS = new Set([
  '0',
  'auto',
  'none',
  'inherit',
  'initial',
  'unset',
  '100%',
  '100vh',
  '100vw',
  'max-content',
  'min-content',
  'fit-content',
]);

const SPACING_PROPERTIES = new Set([
  'p',
  'px',
  'py',
  'pt',
  'pr',
  'pb',
  'pl',
  'padding',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'paddingInline',
  'paddingInlineStart',
  'paddingInlineEnd',
  'paddingBlock',
  'paddingBlockStart',
  'paddingBlockEnd',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'padding-inline',
  'padding-inline-start',
  'padding-inline-end',
  'padding-block',
  'padding-block-start',
  'padding-block-end',
  'm',
  'mx',
  'my',
  'mt',
  'mr',
  'mb',
  'ml',
  'margin',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'marginInline',
  'marginInlineStart',
  'marginInlineEnd',
  'marginBlock',
  'marginBlockStart',
  'marginBlockEnd',
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
  'margin-inline',
  'margin-inline-start',
  'margin-inline-end',
  'margin-block',
  'margin-block-start',
  'margin-block-end',
  'gap',
  'rowGap',
  'columnGap',
  'row-gap',
  'column-gap',
  'top',
  'bottom',
  'left',
  'right',
  'inset',
]);

const STROKE_PROPERTIES = new Set([
  'borderWidth',
  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth',
  'border-width',
  'border-top-width',
  'border-right-width',
  'border-bottom-width',
  'border-left-width',
  'strokeWidth',
  'stroke-width',
]);

const SCALE_ENTRIES = [
  { name: 'none', val: 0 },
  { name: 'hairline', val: 2 },
  { name: 'micro', val: 4 },
  { name: 'compactHalf', val: 6 },
  { name: 'compact', val: 8 },
  { name: 'mediumHalf', val: 10 },
  { name: 'medium', val: 12 },
  { name: 'standard', val: 16 },
  { name: 'largeHalf', val: 20 },
  { name: 'large', val: 24 },
  { name: 'extraLarge', val: 32 },
  { name: 'sectionHalf', val: 40 },
  { name: 'extraExtraLarge', val: 48 },
  { name: 'hugeHalf', val: 56 },
  { name: 'huge', val: 64 },
  { name: 'massive', val: 80 },
  { name: 'macro', val: 96 },
  { name: 'giant', val: 120 },
  { name: 'jumbo', val: 160 },
];

function getClosestSpacingHint(num) {
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
  return ` (closest: 'M3_SPACINGS.${closest.name}' [${closest.val}px])`;
}

export const spacingRules = {
  'enforce-spacing-tokens': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Enforce Material Design 3 Spacing Grid, semantic friendship scale, and Stroke line thickness. Disallow untokenized magic numbers and arbitrary pixel values in padding, margin, gap, and borderWidth.',
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
        noUnapprovedSpacing:
          "Non-standard spacing value '{{value}}' detected{{suggestionHint}}. Use Material Design 3 spacing tokens from spacing tokens (e.g. 'M3_SPACINGS.standard' [16px]) or standard MUI spacing multipliers (e.g. 1, 1.5, 2, 3, 4).",
        noUnapprovedStroke:
          "Non-standard stroke width '{{value}}' detected. Use Material Design 3 stroke tokens from spacing tokens (e.g. 'M3_STROKES.thin' [1px], 'M3_STROKES.medium' [2px], 'M3_STROKES.thick' [3px]).",
      },
    },
    create(context) {
      const options = context.options?.[0] || {};
      const allowedList = new Set(options.allowed || []);
      const filename = context.filename || context.getFilename?.() || '';

      const isTokenOrTest =
        filename.includes('tokens/spacing') ||
        filename.includes('tokens/theme') ||
        filename.includes('tokens/solarized') ||
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

      function checkStrokeValue(valNode, reportNode) {
        if (!valNode) return;
        if (valNode.type === 'Literal') {
          const raw = valNode.value;
          if (typeof raw === 'number') {
            if (APPROVED_STROKE_WIDTHS.has(raw) || isAllowed(raw)) return;
            context.report({
              node: reportNode,
              messageId: 'noUnapprovedStroke',
              data: { value: String(raw) },
            });
            return;
          }
          if (typeof raw === 'string') {
            const cleanStr = raw.replace(/\s*!important\s*$/i, '').trim();
            if (
              cleanStr.startsWith('var(--') ||
              APPROVED_KEYWORDS.has(cleanStr) ||
              isAllowed(raw) ||
              isAllowed(cleanStr)
            ) {
              return;
            }
            const pxMatch = /^(\d+(?:\.\d+)?)px$/i.exec(cleanStr);
            if (pxMatch && APPROVED_STROKE_WIDTHS.has(parseFloat(pxMatch[1]))) {
              return;
            }
            context.report({
              node: reportNode,
              messageId: 'noUnapprovedStroke',
              data: { value: raw },
            });
          }
        }
      }

      function checkSpacingValue(valNode, reportNode) {
        if (!valNode) return;

        if (valNode.type === 'Literal' && typeof valNode.value === 'number') {
          const num = valNode.value;
          const absNum = Math.abs(num);
          const isMultiplier = APPROVED_MUI_MULTIPLIERS.has(absNum);
          const isPixel = APPROVED_SPACING_PIXELS.has(absNum);
          if (isMultiplier || isPixel || isAllowed(num)) return;

          context.report({
            node: reportNode,
            messageId: 'noUnapprovedSpacing',
            data: {
              value: String(num),
              suggestionHint: getClosestSpacingHint(absNum),
            },
          });
          return;
        }

        if (valNode.type === 'Literal' && typeof valNode.value === 'string') {
          const rawStr = valNode.value.trim().toLowerCase();
          const cleanStr = rawStr.replace(/\s*!important\s*$/i, '').trim();

          if (
            cleanStr.startsWith('var(--') ||
            cleanStr.startsWith('calc(') ||
            APPROVED_KEYWORDS.has(cleanStr) ||
            isAllowed(rawStr) ||
            isAllowed(cleanStr)
          ) {
            return;
          }

          // Single pixel string (e.g. 11px, 13px, -2px, -4px)
          const pxMatch = /^-?(\d+(?:\.\d+)?)px$/i.exec(cleanStr);
          if (pxMatch) {
            const num = parseFloat(pxMatch[1]);
            if (APPROVED_SPACING_PIXELS.has(num)) return;
            context.report({
              node: reportNode,
              messageId: 'noUnapprovedSpacing',
              data: {
                value: rawStr,
                suggestionHint: getClosestSpacingHint(num),
              },
            });
            return;
          }

          // Multi-value shorthand (e.g. "8px 16px", "12px 24px", "4px 8px 12px 16px")
          const parts = cleanStr.split(/\s+/).filter(Boolean);
          if (parts.length >= 2 && parts.length <= 4) {
            const allApproved = parts.every((p) => {
              if (APPROVED_KEYWORDS.has(p) || p.startsWith('var(--')) {
                return true;
              }
              const m = /^(\d+(?:\.\d+)?)px$/i.exec(p);
              return m ? APPROVED_SPACING_PIXELS.has(parseFloat(m[1])) : false;
            });
            if (allApproved) return;

            context.report({
              node: reportNode,
              messageId: 'noUnapprovedSpacing',
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
              messageId: 'noUnapprovedSpacing',
              data: {
                value: rawStr,
                suggestionHint: getClosestSpacingHint(num),
              },
            });
          }
          return;
        }

        if (valNode.type === 'TemplateLiteral') {
          for (const quasi of valNode.quasis || []) {
            const rawStr = quasi.value?.raw?.trim().toLowerCase();
            if (!rawStr) continue;
            const matches = rawStr.match(/\b\d+px\b/gi) || [];
            for (const m of matches) {
              const num = parseFloat(m);
              const absNum = Math.abs(num);
              const isApproved =
                APPROVED_SPACING_PIXELS.has(absNum) ||
                APPROVED_MUI_MULTIPLIERS.has(absNum);
              if (!isApproved && !isAllowed(m) && !isAllowed(num)) {
                context.report({
                  node: reportNode,
                  messageId: 'noUnapprovedSpacing',
                  data: {
                    value: m,
                    suggestionHint: getClosestSpacingHint(absNum),
                  },
                });
              }
            }
          }
        }
      }

      return {
        Property(node) {
          if (isTokenOrTest) return;
          const key = node.key?.name || node.key?.value;
          if (typeof key !== 'string') return;

          if (SPACING_PROPERTIES.has(key)) {
            checkSpacingValue(node.value, node);
          } else if (STROKE_PROPERTIES.has(key)) {
            checkStrokeValue(node.value, node);
          }
        },

        JSXAttribute(node) {
          if (isTokenOrTest) return;
          const name = node.name?.name;
          if (typeof name !== 'string') return;

          if (SPACING_PROPERTIES.has(name)) {
            const val = node.value?.expression || node.value;
            checkSpacingValue(val, node);
          } else if (STROKE_PROPERTIES.has(name)) {
            const parentTagName = node.parent?.name?.name?.toLowerCase();
            if (SVG_SHAPE_TAGS.has(parentTagName)) return;
            const val = node.value?.expression || node.value;
            checkStrokeValue(val, node);
          }
        },
      };
    },
  },

  'enforce-minimum-touch-target': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Enforce Material Design 3 and WCAG 2.5.5 minimum 48x48 dp touch target boundary on interactive elements (buttons, icon buttons, touch targets), even when inner visual elements are smaller.',
      },
      schema: [
        {
          type: 'object',
          properties: {
            allowed: { type: 'array', items: { type: 'string' } },
            allowDense: { type: 'boolean' },
          },
          additionalProperties: false,
        },
      ],
      messages: {
        noSub48TouchTarget:
          "Interactive element '{{name}}' has touch target dimension '{{value}}' below MD3/WCAG 48x48 dp minimum. Ensure a minimum touch target of 48px (e.g. 'minWidth: 48', 'minHeight: 48', or 'M3_DIMENSIONS.touchTarget') even if the visual element is smaller.",
      },
    },
    create(context) {
      const options = context.options?.[0] || {};
      const allowedList = new Set(
        (options.allowed || []).map((x) => String(x).toLowerCase().trim()),
      );
      const minThreshold = options.allowDense ? 40 : 48;
      const filename = context.filename || context.getFilename?.() || '';

      const isTokenOrTest =
        filename.includes('tokens/spacing') ||
        filename.includes('tokens/theme') ||
        filename.includes('tokens/solarized') ||
        filename.includes('.test.') ||
        filename.includes('.spec.');

      const INTERACTIVE_TAG_NAMES = new Set([
        'button',
        'a',
        'iconbutton',
        'buttonbase',
        'fab',
        'floatingactionbutton',
        'ghostactionbutton',
        'holdbutton',
        'touchtarget',
        'toucharea',
        'tab',
        'switch',
        'checkbox',
        'radio',
      ]);

      function isInteractiveTag(tagName) {
        if (!tagName || typeof tagName !== 'string') return false;
        return INTERACTIVE_TAG_NAMES.has(tagName.toLowerCase());
      }

      function isInteractiveElement(jsxElementNode) {
        const opening = jsxElementNode.openingElement;
        if (!opening) return false;
        const tagName = opening.name?.name;
        if (isInteractiveTag(tagName)) return true;

        for (const attr of opening.attributes || []) {
          if (attr.type === 'JSXAttribute') {
            const attrName = attr.name?.name;
            if (attrName === 'onClick') return true;
            if (
              attrName === 'role' &&
              attr.value?.type === 'Literal' &&
              (attr.value.value === 'button' || attr.value.value === 'tab')
            ) {
              return true;
            }
          }
        }
        return false;
      }

      function isAllowed(val) {
        if (val === null || val === undefined) return false;
        const strVal = String(val).trim().toLowerCase();
        if (allowedList.has(strVal)) return true;
        return Array.from(allowedList).some(
          (pat) => pat && strVal.includes(pat),
        );
      }

      function extractDimensionNumber(node) {
        if (!node) return null;
        if (node.type === 'Literal') {
          if (typeof node.value === 'number') return node.value;
          if (typeof node.value === 'string') {
            const match = /^(\d+(?:\.\d+)?)px$/i.exec(node.value.trim());
            if (match) return parseFloat(match[1]);
          }
        }
        return null;
      }

      function inspectInteractiveDimensions(objNode, targetName) {
        if (!objNode || objNode.type !== 'ObjectExpression') return;

        let has48MinWidth = false;
        let has48MinHeight = false;

        const subThresholdDimensions = [];

        for (const prop of objNode.properties || []) {
          if (prop.type !== 'Property') continue;
          const key = prop.key?.name || prop.key?.value;
          if (typeof key !== 'string') continue;

          const num = extractDimensionNumber(prop.value);
          const rawText =
            (context.sourceCode || context.getSourceCode?.())?.getText(
              prop.value,
            ) || String(num);

          if (isAllowed(rawText) || (num !== null && isAllowed(num))) continue;

          if (key === 'minWidth' || key === 'min-width') {
            if (num !== null && num >= minThreshold) has48MinWidth = true;
            else if (num !== null && num < minThreshold) {
              subThresholdDimensions.push({ prop, key, num, raw: rawText });
            }
          } else if (key === 'minHeight' || key === 'min-height') {
            if (num !== null && num >= minThreshold) has48MinHeight = true;
            else if (num !== null && num < minThreshold) {
              subThresholdDimensions.push({ prop, key, num, raw: rawText });
            }
          } else if (key === 'width' || key === 'height') {
            if (num !== null && num < minThreshold) {
              subThresholdDimensions.push({ prop, key, num, raw: rawText });
            }
          }
        }

        for (const item of subThresholdDimensions) {
          if (
            (item.key === 'width' && has48MinWidth) ||
            (item.key === 'height' && has48MinHeight)
          ) {
            continue;
          }

          context.report({
            node: item.prop,
            messageId: 'noSub48TouchTarget',
            data: {
              name: targetName,
              value: item.raw,
            },
          });
        }
      }

      function extractStyledObject(arg) {
        if (!arg) return null;
        if (arg.type === 'ObjectExpression') return arg;
        if (
          (arg.type === 'ArrowFunctionExpression' ||
            arg.type === 'FunctionExpression') &&
          arg.body?.type === 'ObjectExpression'
        ) {
          return arg.body;
        }
        return null;
      }

      function inspectStyledOrVariable(node) {
        if (node.type !== 'CallExpression') return;
        const callee = node.callee;
        const isStyled =
          callee?.name === 'styled' || callee?.callee?.name === 'styled';
        if (!isStyled) return;

        const styledArg =
          callee.name === 'styled'
            ? node.arguments?.[0]
            : callee.arguments?.[0];
        const targetName = styledArg?.name || styledArg?.value || 'Component';
        if (
          !isInteractiveTag(targetName) &&
          !/Button|Fab|TouchTarget|Interactive/i.test(targetName)
        ) {
          return;
        }

        for (const arg of node.arguments || []) {
          const obj = extractStyledObject(arg);
          if (obj) inspectInteractiveDimensions(obj, targetName);
        }
      }

      return {
        JSXElement(node) {
          if (isTokenOrTest) return;
          if (!isInteractiveElement(node)) return;

          const tagName =
            node.openingElement?.name?.name || 'InteractiveElement';

          for (const attr of node.openingElement?.attributes || []) {
            if (attr.type === 'JSXAttribute') {
              const attrName = attr.name?.name;
              if (attrName === 'sx' || attrName === 'style') {
                const expr = attr.value?.expression;
                if (expr?.type === 'ObjectExpression') {
                  inspectInteractiveDimensions(expr, tagName);
                }
              }
            }
          }
        },

        CallExpression(node) {
          if (isTokenOrTest) return;
          inspectStyledOrVariable(node);
        },
      };
    },
  },
};

export default spacingRules;
