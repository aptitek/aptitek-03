/**
 * Material Design 3 ESLint Rules: Elevation (Shadow & Tonal) & Z-Index Scale
 *
 * Enforces:
 * 1. MD3 5 strict elevation levels (0 through 5) alongside tonal surface containers.
 * 2. Disallowing raw drop-shadow strings outside M3 elevation tokens (var(--md-sys-elevation-level*),
 *    theme.shadows[0..5], or perimeter highlight rings).
 * 3. Restricting z-index values to MD3 elevation levels (0-5, -1) or semantic theme tokens
 *    (theme.zIndex.modal, theme.zIndex.drawer, etc.).
 * 4. Disallowing legacy elevation levels (> 5) on Paper/Card elevation props.
 */

const APPROVED_ELEVATION_LEVELS = new Set([0, 1, 2, 3, 4, 5]);

const APPROVED_Z_INDEX_NUMBERS = new Set([-1, 0, 1, 2, 3, 4, 5]);

const APPROVED_Z_INDEX_KEYWORDS = new Set([
  'auto',
  'inherit',
  'initial',
  'unset',
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '-1',
]);

const APPROVED_SHADOW_KEYWORDS = new Set([
  'none',
  '0',
  '0px',
  'inherit',
  'initial',
  'unset',
  'transparent',
]);

export const elevationRules = {
  'enforce-elevation-levels': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Enforce Material Design 3 Elevation Levels (0-5), tonal elevation, and semantic z-index scale. Disallow raw box-shadows and arbitrary z-index numbers.',
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
        noRawBoxShadow:
          "Raw box-shadow '{{value}}' detected. MD3 uses tonal elevation and 5 strict elevation levels (0-5). Use M3 elevation tokens (e.g. 'var(--md-sys-elevation-level1..5)', 'theme.shadows[0..5]') or surface container tones.",
        invalidElevationLevel:
          'Elevation level {{level}} is not an approved MD3 elevation level (0-5). Material Design 3 defines 5 strict elevation levels alongside tonal surface elevation.',
        invalidElevationProp:
          "Elevation level '{{value}}' exceeds MD3 elevation levels (0-5). MD3 defines only 5 elevation levels alongside tonal surface containers.",
        noArbitraryZIndex:
          "Arbitrary z-index '{{value}}' detected. MD3 restricts elevation to 5 strict levels (0-5) or semantic theme zIndex tokens ('theme.zIndex.modal', 'theme.zIndex.drawer', etc.) or add to allowed whitelist in eslint config.",
      },
    },
    create(context) {
      const options = context.options?.[0] || {};
      const allowedList = new Set(options.allowed || []);
      const filename = context.filename || context.getFilename?.() || '';

      const isTokenOrTest =
        filename.includes('tokens/shadows') ||
        filename.includes('tokens/theme') ||
        filename.includes('tokens/elevation') ||
        filename.includes('.test.') ||
        filename.includes('.spec.');

      function isAllowed(val) {
        if (val === null || val === undefined) return false;
        const strVal = String(val).trim().toLowerCase();
        if (allowedList.has(strVal)) return true;
        return Array.from(allowedList).some(
          (pat) => pat && strVal.includes(pat.toLowerCase()),
        );
      }

      function checkShadowValue(node, reportNode) {
        if (!node) return;

        if (node.type === 'Literal' && typeof node.value === 'string') {
          const val = node.value.trim();
          if (APPROVED_SHADOW_KEYWORDS.has(val.toLowerCase())) return;
          if (
            val.startsWith('var(--md-sys-elevation-') ||
            val.startsWith('var(--elevation-')
          ) {
            return;
          }
          if (isAllowed(val)) return;

          // Check if perimeter highlight ring
          if (
            /^(0\s+0\s+0\s+1px|inset\s+0\s+0\s+0\s+1px)/i.test(val) ||
            /1px\s+solid/i.test(val)
          ) {
            return;
          }

          context.report({
            node: reportNode,
            messageId: 'noRawBoxShadow',
            data: { value: node.value },
          });
          return;
        }

        if (node.type === 'MemberExpression') {
          const objName = node.object?.name || node.object?.property?.name;
          if (objName === 'shadows' && node.property?.type === 'Literal') {
            const level = node.property.value;
            if (!APPROVED_ELEVATION_LEVELS.has(level) && !isAllowed(level)) {
              context.report({
                node: reportNode,
                messageId: 'invalidElevationLevel',
                data: { level },
              });
            }
          }
        }
      }

      function checkZIndexValue(node, reportNode) {
        if (!node) return;

        if (node.type === 'Literal' && typeof node.value === 'number') {
          const val = node.value;
          if (APPROVED_Z_INDEX_NUMBERS.has(val) || isAllowed(val)) return;

          context.report({
            node: reportNode,
            messageId: 'noArbitraryZIndex',
            data: { value: String(val) },
          });
          return;
        }

        if (
          node.type === 'UnaryExpression' &&
          node.operator === '-' &&
          node.argument?.type === 'Literal' &&
          typeof node.argument.value === 'number'
        ) {
          const num = -node.argument.value;
          if (APPROVED_Z_INDEX_NUMBERS.has(num) || isAllowed(num)) return;
          context.report({
            node: reportNode,
            messageId: 'noArbitraryZIndex',
            data: { value: String(num) },
          });
          return;
        }

        if (node.type === 'Literal' && typeof node.value === 'string') {
          const val = node.value.trim().toLowerCase();
          if (APPROVED_Z_INDEX_KEYWORDS.has(val)) return;
          if (val.startsWith('var(--')) return;
          if (isAllowed(val)) return;

          context.report({
            node: reportNode,
            messageId: 'noArbitraryZIndex',
            data: { value: node.value },
          });
          return;
        }

        if (node.type === 'MemberExpression') {
          const objName = node.object?.name || node.object?.property?.name;
          if (objName === 'zIndex' || objName === 'M3_Z_INDEX') return;
        }
      }

      function checkElevationProp(node) {
        const valNode = node.value?.expression || node.value;
        if (!valNode) return;
        if (valNode.type === 'Literal' && typeof valNode.value === 'number') {
          const val = valNode.value;
          if (!APPROVED_ELEVATION_LEVELS.has(val) && !isAllowed(val)) {
            context.report({
              node,
              messageId: 'invalidElevationProp',
              data: { value: String(val) },
            });
          }
        }
      }

      return {
        Property(node) {
          if (isTokenOrTest) return;
          const key = node.key?.name || node.key?.value;
          if (key === 'boxShadow' || key === 'box-shadow') {
            checkShadowValue(node.value, node);
          } else if (key === 'zIndex' || key === 'z-index') {
            checkZIndexValue(node.value, node);
          }
        },

        JSXAttribute(node) {
          if (isTokenOrTest) return;
          const name = node.name?.name;
          if (name === 'boxShadow') {
            const val = node.value?.expression || node.value;
            checkShadowValue(val, node);
          } else if (name === 'zIndex') {
            const val = node.value?.expression || node.value;
            checkZIndexValue(val, node);
          } else if (name === 'elevation') {
            checkElevationProp(node);
          }
        },
      };
    },
  },

  'no-arbitrary-z-index': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Disallow arbitrary z-index values outside MD3 elevation levels (0-5) or semantic theme tokens.',
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
        noArbitraryZIndex:
          "Arbitrary z-index '{{value}}' detected. MD3 restricts elevation to 5 strict levels (0-5) or semantic theme zIndex tokens ('theme.zIndex.modal', 'theme.zIndex.drawer', etc.).",
      },
    },
    create(context) {
      const options = context.options?.[0] || {};
      const allowedList = new Set(options.allowed || []);
      const filename = context.filename || context.getFilename?.() || '';

      const isTokenOrTest =
        filename.includes('tokens/shadows') ||
        filename.includes('tokens/theme') ||
        filename.includes('tokens/elevation') ||
        filename.includes('.test.') ||
        filename.includes('.spec.');

      function isAllowed(val) {
        if (val === null || val === undefined) return false;
        const strVal = String(val).trim().toLowerCase();
        return (
          allowedList.has(strVal) ||
          Array.from(allowedList).some(
            (pat) => pat && strVal.includes(pat.toLowerCase()),
          )
        );
      }

      function checkZIndex(node, reportNode) {
        if (!node) return;
        if (node.type === 'Literal' && typeof node.value === 'number') {
          if (APPROVED_Z_INDEX_NUMBERS.has(node.value) || isAllowed(node.value))
            return;
          context.report({
            node: reportNode,
            messageId: 'noArbitraryZIndex',
            data: { value: String(node.value) },
          });
        } else if (
          node.type === 'UnaryExpression' &&
          node.operator === '-' &&
          node.argument?.type === 'Literal'
        ) {
          const num = -node.argument.value;
          if (APPROVED_Z_INDEX_NUMBERS.has(num) || isAllowed(num)) return;
          context.report({
            node: reportNode,
            messageId: 'noArbitraryZIndex',
            data: { value: String(num) },
          });
        } else if (node.type === 'Literal' && typeof node.value === 'string') {
          const val = node.value.trim().toLowerCase();
          if (
            APPROVED_Z_INDEX_KEYWORDS.has(val) ||
            val.startsWith('var(--') ||
            isAllowed(val)
          ) {
            return;
          }
          context.report({
            node: reportNode,
            messageId: 'noArbitraryZIndex',
            data: { value: node.value },
          });
        } else if (node.type === 'MemberExpression') {
          const objName = node.object?.name || node.object?.property?.name;
          if (objName === 'zIndex' || objName === 'M3_Z_INDEX') return;
        }
      }

      return {
        Property(node) {
          if (isTokenOrTest) return;
          const key = node.key?.name || node.key?.value;
          if (key === 'zIndex' || key === 'z-index') {
            checkZIndex(node.value, node);
          }
        },
        JSXAttribute(node) {
          if (isTokenOrTest) return;
          if (node.name?.name === 'zIndex') {
            const val = node.value?.expression || node.value;
            checkZIndex(val, node);
          }
        },
      };
    },
  },
};

export default elevationRules;
