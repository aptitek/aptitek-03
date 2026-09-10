/**
 * Material Design 3 ESLint Rules: Typography & Font Enforcement
 *
 * Enforces:
 * 1. Single Source of Truth for font families:
 *    Prohibits ad-hoc raw fontFamily strings (e.g. "monospace", "Courier New", "Arial").
 *    Enforces FONT_FAMILIES from typography tokens, theme typography accessors,
 *    or tokenized CSS variables (--font-family-*).
 * 2. Variable Font Presets (if variable fonts are used).
 * 3. M3 Type-Scale Tokens & Font Sizes:
 *    Ensures font sizes adhere to the Material Design 3 type scale (11px to 57px / rems).
 *
 * Theme-agnostic with support for custom allowed font families.
 */

const DEFAULT_APPROVED_FONT_FAMILIES = new Set([
  '"Inter", sans-serif',
  '"Roboto", sans-serif',
  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  '"Recursive", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  '"Recursive", "JetBrains Mono", "Fira Code", SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  '"Recursive", sans-serif',
  '"OCR-B", "Recursive", "Courier New", Courier, monospace',
  '"Milkshake", cursive, sans-serif',
  '"Material Symbols Rounded", sans-serif',
  'inherit',
  'initial',
  'unset',
]);

const APPROVED_FONT_SIZE_PIXELS = new Set([
  8, 10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24, 26, 28, 32, 36, 40, 44, 45, 48,
  57, 64,
]);

const APPROVED_FONT_SIZE_REMS = new Set([
  '0.625rem',
  '0.65rem',
  '0.68rem',
  '0.6875rem',
  '0.7rem',
  '0.71875rem',
  '0.72rem',
  '0.75rem',
  '0.775rem',
  '0.78rem',
  '0.78125rem',
  '0.8rem',
  '0.8125rem',
  '0.82rem',
  '0.825rem',
  '0.84375rem',
  '0.85rem',
  '0.875rem',
  '0.9rem',
  '0.925rem',
  '0.95rem',
  '1rem',
  '1.05rem',
  '1.1rem',
  '1.125rem',
  '1.15rem',
  '1.2rem',
  '1.25rem',
  '1.35rem',
  '1.375rem',
  '1.5rem',
  '1.6rem',
  '1.65rem',
  '1.75rem',
  '2rem',
  '2.25rem',
  '2.5rem',
  '2.8125rem',
  '3rem',
  '3.5625rem',
  '4rem',
]);

const APPROVED_FONT_SIZE_KEYWORDS = new Set([
  'inherit',
  'initial',
  'unset',
  'small',
  'medium',
  'large',
  'x-small',
  'xx-small',
  'x-large',
  'xx-large',
  '1em',
  '1.15em',
  '1.2em',
  '100%',
]);

const APPROVED_VARIATION_PRESETS = new Set([
  "'CASL' 1, 'MONO' 0, 'slnt' 0, 'CRSV' 0.5",
  "'CASL' 1, 'MONO' 0, 'wght' 700, 'slnt' 0, 'CRSV' 0.5",
  "'CASL' 1, 'MONO' 0, 'slnt' -15, 'CRSV' 1",
  "'CASL' 0, 'MONO' 0, 'slnt' 0, 'CRSV' 0",
  "'CASL' 0, 'MONO' 0, 'wght' 700, 'slnt' 0, 'CRSV' 0",
  "'CASL' 0, 'MONO' 0, 'slnt' -15, 'CRSV' 0",
  "'CASL' 0, 'MONO' 1, 'slnt' 0, 'CRSV' 0",
  "'CASL' 1, 'MONO' 1, 'slnt' 0, 'CRSV' 0.5",
  "'CASL' 0, 'MONO' 0.5, 'slnt' 0, 'CRSV' 0",
  'normal',
  'inherit',
  'initial',
  'unset',
  'none',
]);

function isExemptFile(filename) {
  if (!filename) return false;
  return (
    filename.includes('tokens/typography') ||
    filename.includes('tokens/theme') ||
    filename.includes('tokens/solarized') ||
    filename.includes('.test.') ||
    filename.includes('.spec.')
  );
}

export const typographyRules = {
  'enforce-typography-tokens': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Enforce single-source-of-truth FONT_FAMILIES, font variations, and M3 Type Scale Tokens.',
        recommended: true,
      },
      schema: [
        {
          type: 'object',
          properties: {
            allowed: { type: 'array', items: { type: 'string' } },
            allowedFontFamilies: { type: 'array', items: { type: 'string' } },
          },
          additionalProperties: false,
        },
      ],
      messages: {
        noUnapprovedFontFamily:
          'Non-standard fontFamily "{{value}}" detected. Use tokenized FONT_FAMILIES or CSS variable var(--font-family-...).',
        noUnapprovedFontVariation:
          'Non-standard fontVariationSettings "{{value}}" detected. Use tokenized font variation presets or formatFontVariation().',
        noUnapprovedFontSize:
          'Non-standard fontSize "{{value}}" detected. Use Material Design 3 type-scale tokens from \'~/tokens/typography\' (e.g. M3_TYPESCALE.*.fontSize) or standard M3 pixel/rem sizes.',
        noUnapprovedNumericFontSize:
          "Non-standard fontSize {{value}} detected. Use Material Design 3 type-scale tokens from '~/tokens/typography' (e.g. M3_TYPESCALE.bodyLarge.fontSize) or standard M3 pixel sizes (11, 12, 14, 16, 22, 24, 28, 32, 36, 45, 57).",
      },
    },
    create(context) {
      const options = context.options?.[0] || {};
      const customFonts = new Set([
        ...(options.allowed || []),
        ...(options.allowedFontFamilies || []),
      ]);
      const filename = context.filename || context.getFilename?.() || '';
      if (isExemptFile(filename)) {
        return {};
      }

      function checkFontFamily(node) {
        if (node.type === 'Literal' && typeof node.value === 'string') {
          const raw = node.value.trim();
          if (
            DEFAULT_APPROVED_FONT_FAMILIES.has(raw) ||
            customFonts.has(raw) ||
            Array.from(customFonts).some((f) => raw.includes(f))
          ) {
            return;
          }
          if (raw.startsWith('var(--font-family-')) return;
          if (raw === 'inherit' || raw === 'initial' || raw === 'unset') return;

          context.report({
            node,
            messageId: 'noUnapprovedFontFamily',
            data: { value: raw },
          });
        }
      }

      function checkFontVariationSettings(node) {
        if (node.type === 'Literal' && typeof node.value === 'string') {
          const raw = node.value.trim();
          if (APPROVED_VARIATION_PRESETS.has(raw)) return;
          if (raw.startsWith('var(--font-variation-')) return;

          context.report({
            node,
            messageId: 'noUnapprovedFontVariation',
            data: { value: raw },
          });
        }
      }

      function checkFontSize(node) {
        if (node.type === 'Literal') {
          if (typeof node.value === 'number') {
            if (APPROVED_FONT_SIZE_PIXELS.has(node.value)) return;
            context.report({
              node,
              messageId: 'noUnapprovedNumericFontSize',
              data: { value: String(node.value) },
            });
            return;
          }

          if (typeof node.value === 'string') {
            let val = node.value.trim();
            val = val.replace(/\s*!important$/i, '');
            if (APPROVED_FONT_SIZE_KEYWORDS.has(val)) return;
            if (val.startsWith('var(--md-sys-typescale-')) return;
            if (val.startsWith('clamp(')) return;

            const pxMatch = val.match(/^(-?\d+(\.\d+)?)px$/);
            if (pxMatch) {
              const num = parseFloat(pxMatch[1]);
              if (APPROVED_FONT_SIZE_PIXELS.has(num)) return;
              context.report({
                node,
                messageId: 'noUnapprovedFontSize',
                data: { value: node.value },
              });
              return;
            }

            if (val.endsWith('rem')) {
              if (APPROVED_FONT_SIZE_REMS.has(val)) return;
              context.report({
                node,
                messageId: 'noUnapprovedFontSize',
                data: { value: node.value },
              });
              return;
            }

            context.report({
              node,
              messageId: 'noUnapprovedFontSize',
              data: { value: node.value },
            });
          }
        }
      }

      return {
        Property(node) {
          const keyName = node.key?.name || node.key?.value;
          if (!keyName || typeof keyName !== 'string') return;

          const normalized = keyName.toLowerCase();
          if (normalized === 'fontfamily' || normalized === 'font-family') {
            checkFontFamily(node.value);
          } else if (
            normalized === 'fontvariationsettings' ||
            normalized === 'font-variation-settings'
          ) {
            checkFontVariationSettings(node.value);
          } else if (normalized === 'fontsize' || normalized === 'font-size') {
            checkFontSize(node.value);
          }
        },

        JSXAttribute(node) {
          const attrName = node.name?.name;
          if (!attrName || typeof attrName !== 'string') return;

          const normalized = attrName.toLowerCase();
          const attrVal =
            node.value?.type === 'JSXExpressionContainer'
              ? node.value.expression
              : node.value;

          if (!attrVal) return;

          if (normalized === 'fontfamily') {
            checkFontFamily(attrVal);
          } else if (normalized === 'fontvariationsettings') {
            checkFontVariationSettings(attrVal);
          } else if (normalized === 'fontsize') {
            checkFontSize(attrVal);
          }
        },
      };
    },
  },
};

export default typographyRules;
