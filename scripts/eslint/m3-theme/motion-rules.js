/**
 * Material Design 3 ESLint Rules: Motion & Springs
 * Enforces tokenized motion physics (M3_SPRINGS, M3_MOTION_DURATIONS, M3_MOTION_EASINGS).
 * Theme-agnostic with support for custom allowed values.
 */

export const motionRules = {
  'enforce-motion-tokens': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Enforce Material Design 3 motion tokens and spring physics. Disallow hardcoded inline springs, ad-hoc bezier curves, and untokenized durations in Framer Motion / MUI transitions.',
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
        noHardcodedSpring:
          "Hardcoded spring physics '{ stiffness: {{stiffness}}, damping: {{damping}} }' is forbidden. Import tokenized springs from motion tokens (e.g. 'M3_SPRINGS.press', 'M3_SPRINGS.expressive.spatial.default', 'M3_SPRINGS.hover').",
        noHardcodedBezierArray:
          "Hardcoded bezier curve array [{{values}}] detected. Use 'M3_MOTION_EASINGS.tuples.*' from motion tokens per Material Design 3 motion specifications.",
        noHardcodedBezierString:
          "Hardcoded cubic-bezier string '{{value}}' detected. Use 'M3_MOTION_EASINGS.css.*' or 'theme.transitions.easing.*' from motion tokens.",
        noHardcodedDuration:
          "Hardcoded animation duration '{{value}}' detected in transition. Use Material Design 3 duration tokens from motion tokens (e.g. 'M3_MOTION_DURATIONS.s.medium2').",
      },
    },
    create(context) {
      const options = context.options?.[0] || {};
      const allowedList = new Set(options.allowed || []);
      const filename = context.filename || context.getFilename?.() || '';
      if (
        filename.includes('tokens/motion') ||
        filename.includes('tokens/theme') ||
        filename.includes('.test.') ||
        filename.includes('.spec.')
      ) {
        return {};
      }

      function isAllowed(val) {
        if (val === undefined || val === null) return false;
        return (
          allowedList.has(String(val)) ||
          Array.from(allowedList).some((p) => p && String(val).includes(p))
        );
      }

      function inspectTransitionObject(node) {
        if (!node || node.type !== 'ObjectExpression') return;
        let hasTypeSpring = false;
        let stiffnessVal = null;
        let dampingVal = null;
        let durationNode = null;
        let easeNode = null;
        let hasRepeat = false;

        for (const prop of node.properties || []) {
          if (prop.type !== 'Property') continue;
          const key = prop.key?.name || prop.key?.value;
          if (
            key === 'type' &&
            prop.value?.type === 'Literal' &&
            prop.value.value === 'spring'
          ) {
            hasTypeSpring = true;
          }
          if (
            key === 'stiffness' &&
            prop.value?.type === 'Literal' &&
            typeof prop.value.value === 'number'
          ) {
            stiffnessVal = prop.value.value;
          }
          if (
            key === 'damping' &&
            prop.value?.type === 'Literal' &&
            typeof prop.value.value === 'number'
          ) {
            dampingVal = prop.value.value;
          }
          if (key === 'duration') {
            durationNode = prop.value;
          }
          if (key === 'ease') {
            easeNode = prop.value;
          }
          if (key === 'repeat') {
            hasRepeat = true;
          }
        }

        if (
          (hasTypeSpring && (stiffnessVal !== null || dampingVal !== null)) ||
          (stiffnessVal !== null && dampingVal !== null)
        ) {
          if (!isAllowed('spring') && !isAllowed(stiffnessVal)) {
            context.report({
              node,
              messageId: 'noHardcodedSpring',
              data: {
                stiffness: stiffnessVal ?? 'auto',
                damping: dampingVal ?? 'auto',
              },
            });
          }
        }

        if (
          easeNode?.type === 'ArrayExpression' &&
          easeNode.elements.length === 4
        ) {
          const allNumbers = easeNode.elements.every(
            (el) => el?.type === 'Literal' && typeof el.value === 'number',
          );
          if (allNumbers) {
            const rawText = easeNode.elements.map((el) => el.value).join(', ');
            if (!isAllowed(rawText) && !isAllowed('ease')) {
              context.report({
                node: easeNode,
                messageId: 'noHardcodedBezierArray',
                data: { values: rawText },
              });
            }
          }
        }

        if (
          durationNode?.type === 'Literal' &&
          typeof durationNode.value === 'number' &&
          !hasRepeat
        ) {
          if (
            !isAllowed(String(durationNode.value)) &&
            !isAllowed('duration')
          ) {
            context.report({
              node: durationNode,
              messageId: 'noHardcodedDuration',
              data: { value: String(durationNode.value) },
            });
          }
        }
      }

      return {
        JSXAttribute(node) {
          if (node.name?.name === 'transition') {
            const expr = node.value?.expression;
            if (expr?.type === 'ObjectExpression') {
              inspectTransitionObject(expr);
            }
          }
        },
        Property(node) {
          const key = node.key?.name || node.key?.value;
          if (key === 'transition' && node.value?.type === 'ObjectExpression') {
            inspectTransitionObject(node.value);
          }
          if (key === 'ease' || key === 'easing') {
            if (
              node.value?.type === 'Literal' &&
              typeof node.value.value === 'string' &&
              /cubic-bezier\(/i.test(node.value.value)
            ) {
              if (!isAllowed(node.value.value) && !isAllowed('cubic-bezier')) {
                context.report({
                  node: node.value,
                  messageId: 'noHardcodedBezierString',
                  data: { value: node.value.value },
                });
              }
            }
          }
        },
        VariableDeclarator(node) {
          if (node.init?.type === 'ObjectExpression') {
            inspectTransitionObject(node.init);
          }
        },
      };
    },
  },
};

export default motionRules;
