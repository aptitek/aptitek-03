/**
 * Material Design 3 ESLint Rules: State Layers & Interaction Opacities
 *
 * Enforces:
 * 1. MD3 strict state layer opacities across interaction overlays:
 *    - Hover: 0.08 (8%)
 *    - Focus: 0.12 (12%)
 *    - Pressed: 0.12 (12%)
 *    - Dragged: 0.16 (16%)
 * 2. Disallows arbitrary solid background swaps in :hover, :focus, :active pseudo-classes.
 *    Requires state layer opacity overlays (e.g. alpha(color, 0.08), action.hover, or CSS variables).
 *
 * Theme-agnostic with support for custom allowed values.
 */

const STATE_CONFIG = {
  hover: {
    expectedOpacity: 0.08,
    opacityString: '0.08',
    actionToken: 'hover',
    cssVar: '--md-sys-state-hover-opacity',
  },
  focus: {
    expectedOpacity: 0.12,
    opacityString: '0.12',
    actionToken: 'focus',
    cssVar: '--md-sys-state-focus-opacity',
  },
  pressed: {
    expectedOpacity: 0.12,
    opacityString: '0.12',
    actionToken: 'selected',
    cssVar: '--md-sys-state-pressed-opacity',
  },
  dragged: {
    expectedOpacity: 0.16,
    opacityString: '0.16',
    actionToken: 'selected',
    cssVar: '--md-sys-state-dragged-opacity',
  },
};

function getInteractionState(key) {
  if (typeof key !== 'string') return null;
  const lower = key.toLowerCase();
  if (lower.includes('dragged')) return 'dragged';
  if (lower.includes(':active') || lower.includes('pressed') || lower.includes('mui-active')) {
    return 'pressed';
  }
  if (
    lower.includes(':focus') ||
    lower.includes('focusvisible') ||
    lower.includes('mui-focusvisible')
  ) {
    return 'focus';
  }
  if (lower.includes(':hover') || lower.includes('mui-hovered') || lower === 'hover') {
    return 'hover';
  }
  return null;
}

const APPROVED_BG_KEYWORDS = new Set(['transparent', 'inherit', 'initial', 'unset', 'none']);

export const stateRules = {
  'enforce-state-layers': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Enforce Material Design 3 state layer opacity specifications on hover, focus, pressed, and dragged states. Disallow arbitrary solid background swaps.',
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
        invalidStateOpacity:
          "Invalid interaction state opacity '{{value}}' for '{{state}}'. MD3 specifies exact state layer opacities: hover (0.08), focus (0.12), pressed (0.12), dragged (0.16).",
        noArbitraryStateBackground:
          "Arbitrary '{{property}}' swap ('{{value}}') detected in '{{state}}' state. MD3 requires state layers with exact opacities (hover: 0.08, focus: 0.12, pressed: 0.12, dragged: 0.16) instead of solid background color swaps. Use 'alpha(color, {{expectedOpacity}})' or action tokens ('theme.palette.action.{{actionToken}}').",
      },
    },
    create(context) {
      const options = context.options?.[0] || {};
      const allowedList = new Set(options.allowed || []);
      const filename = context.filename || context.getFilename?.() || '';

      const isTokenOrTest =
        filename.includes('tokens/state') ||
        filename.includes('tokens/theme') ||
        filename.includes('tokens/solarized') ||
        filename.includes('.test.') ||
        filename.includes('.spec.');

      function isAllowed(val) {
        if (val === null || val === undefined) return false;
        const strVal = String(val).trim().toLowerCase();
        if (allowedList.has(strVal)) return true;
        return Array.from(allowedList).some((pat) => pat && strVal.includes(pat.toLowerCase()));
      }

      function checkOpacity(valNode, reportNode, state) {
        const config = STATE_CONFIG[state];
        if (!config) return;

        if (valNode.type === 'Literal') {
          const val = valNode.value;
          if (typeof val === 'number') {
            if (Math.abs(val - config.expectedOpacity) > 0.005 && !isAllowed(val)) {
              context.report({
                node: reportNode,
                messageId: 'invalidStateOpacity',
                data: { value: String(val), state },
              });
            }
          } else if (typeof val === 'string') {
            const trimmed = val.trim();
            if (trimmed === config.opacityString || trimmed.includes(config.cssVar)) {
              return;
            }
            if (APPROVED_BG_KEYWORDS.has(trimmed.toLowerCase()) || isAllowed(trimmed)) {
              return;
            }
            const parsed = parseFloat(trimmed);
            if (!isNaN(parsed) && Math.abs(parsed - config.expectedOpacity) > 0.005) {
              context.report({
                node: reportNode,
                messageId: 'invalidStateOpacity',
                data: { value: trimmed, state },
              });
            }
          }
        }
      }

      function checkBackground(valNode, reportNode, state, propName) {
        const config = STATE_CONFIG[state];
        if (!config) return;

        // 1. Literal string: e.g. "transparent", "action.hover", "rgba(...)"
        if (valNode.type === 'Literal' && typeof valNode.value === 'string') {
          const val = valNode.value.trim();
          if (APPROVED_BG_KEYWORDS.has(val.toLowerCase())) return;
          if (isAllowed(val)) return;

          // Allowed action tokens
          if (
            val === `action.${config.actionToken}` ||
            val === 'action.hover' ||
            val === 'action.focus' ||
            val === 'action.selected'
          ) {
            return;
          }

          // Allowed CSS variable
          if (val.includes(config.cssVar) || val.startsWith('var(--md-sys-state-')) {
            return;
          }

          // Check if rgba with correct opacity: e.g. rgba(..., 0.08)
          const rgbaMatch = /rgba\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*,\s*([\d.]+)\s*\)/i.exec(
            val,
          );
          if (rgbaMatch) {
            const alphaVal = parseFloat(rgbaMatch[1]);
            if (Math.abs(alphaVal - config.expectedOpacity) <= 0.005) return;
          }

          context.report({
            node: reportNode,
            messageId: 'noArbitraryStateBackground',
            data: {
              property: propName,
              value: val,
              state,
              expectedOpacity: config.opacityString,
              actionToken: config.actionToken,
            },
          });
          return;
        }

        // 2. MemberExpression: theme.palette.action.hover, action.hover
        if (valNode.type === 'MemberExpression') {
          const prop = valNode.property?.name;
          const parentProp = valNode.object?.property?.name || valNode.object?.name;
          if (
            parentProp === 'action' &&
            (prop === config.actionToken ||
              prop === 'hover' ||
              prop === 'focus' ||
              prop === 'selected')
          ) {
            return;
          }
          if (isAllowed(prop) || isAllowed(`${parentProp}.${prop}`)) return;

          const rawText =
            (context.sourceCode || context.getSourceCode?.())?.getText(valNode) ||
            `${parentProp}.${prop}`;

          if (isAllowed(rawText)) return;

          context.report({
            node: reportNode,
            messageId: 'noArbitraryStateBackground',
            data: {
              property: propName,
              value: rawText,
              state,
              expectedOpacity: config.opacityString,
              actionToken: config.actionToken,
            },
          });
          return;
        }

        // 3. CallExpression: alpha(color, opacity)
        if (valNode.type === 'CallExpression') {
          const fnName = valNode.callee?.name || valNode.callee?.property?.name;
          if (fnName !== 'alpha') return;

          const alphaArg = valNode.arguments?.[1];
          if (alphaArg?.type === 'Literal' && typeof alphaArg.value === 'number') {
            const alphaVal = alphaArg.value;
            if (Math.abs(alphaVal - config.expectedOpacity) <= 0.005 || isAllowed(alphaVal)) {
              return;
            }
          }
          const rawText =
            (context.sourceCode || context.getSourceCode?.())?.getText(valNode) || 'alpha(...)';

          if (isAllowed(rawText)) return;

          context.report({
            node: reportNode,
            messageId: 'noArbitraryStateBackground',
            data: {
              property: propName,
              value: rawText,
              state,
              expectedOpacity: config.opacityString,
              actionToken: config.actionToken,
            },
          });
        }
      }

      function inspectStateObject(objNode, state) {
        if (!objNode || objNode.type !== 'ObjectExpression') return;

        for (const prop of objNode.properties || []) {
          if (prop.type !== 'Property') continue;
          const key = prop.key?.name || prop.key?.value;

          if (key === 'opacity') {
            checkOpacity(prop.value, prop, state);
          } else if (key === 'backgroundColor' || key === 'bgcolor') {
            checkBackground(prop.value, prop, state, key);
          }
        }
      }

      return {
        Property(node) {
          if (isTokenOrTest) return;
          const key = node.key?.name || node.key?.value;
          const state = getInteractionState(key);
          if (state && node.value?.type === 'ObjectExpression') {
            inspectStateObject(node.value, state);
          }
        },
      };
    },
  },
};

export default stateRules;
