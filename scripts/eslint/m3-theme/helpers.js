/**
 * Material Design 3 ESLint Plugin Helpers
 * Theme-agnostic surface container whitelist, interactive context detection, and backdrop inspection.
 */

export function isInteractiveContext(node) {
  let current = node?.parent;
  while (current) {
    if (current.type === 'Property') {
      const key = current.key?.name || current.key?.value;
      if (typeof key === 'string' && isInteractiveKey(key)) return true;
    } else if (current.type === 'VariableDeclarator' && current.id?.name) {
      if (/Ripple|StateLayer/i.test(current.id.name)) return true;
    }
    current = current.parent;
  }
  return false;
}

export function isInteractiveKey(key) {
  return (
    key.startsWith('&:') ||
    key.startsWith('&.') ||
    key.startsWith('&[') ||
    key.includes(':hover') ||
    key.includes(':focus') ||
    key.includes(':active') ||
    key.includes('.Mui-selected') ||
    key.includes('.Mui-disabled') ||
    key.includes('.Mui-focusVisible') ||
    /^(hover|focus|active|disabled|selected)$/.test(key)
  );
}

/**
 * Standard Material Design 3 surface containers and semantic system backgrounds.
 * Clean, theme-agnostic core defaults.
 */
export const DEFAULT_ALLOWED_BACKGROUNDS = new Set([
  'surfaceContainer',
  'surfaceContainerLowest',
  'surfaceContainerLow',
  'surfaceContainerHigh',
  'surfaceContainerHighest',
  'surface',
  'surfaceDim',
  'surfaceBright',
  'surfaceVariant',
  'inverseSurface',
  'inverseOnSurface',
  'scrim',
  'outline',
  'outlineVariant',
  'background.paper',
  'background.default',
  'paper',
  'default',
  'primary.main',
  'primary.light',
  'primary.dark',
  'primary.contrastText',
  'secondary.main',
  'secondary.light',
  'secondary.dark',
  'secondary.contrastText',
  'tertiary.main',
  'tertiary.light',
  'tertiary.dark',
  'tertiary.contrastText',
  'error.main',
  'error.light',
  'error.dark',
  'error.contrastText',
  'warning.main',
  'warning.light',
  'warning.dark',
  'warning.contrastText',
  'info.main',
  'info.light',
  'info.dark',
  'info.contrastText',
  'success.main',
  'success.light',
  'success.dark',
  'success.contrastText',
  'divider',
  'transparent',
  'inherit',
  'currentColor',
]);

export function checkContainerBackground(node, allowedSet) {
  if (!node) return null;
  if (node.type === 'Literal' && typeof node.value === 'string') {
    const val = node.value.trim();
    if (
      allowedSet.has(val) ||
      DEFAULT_ALLOWED_BACKGROUNDS.has(val) ||
      Array.from(allowedSet).some((pat) => pat && val.includes(pat))
    ) {
      return null;
    }
    if (val.startsWith('var(--')) return null;
    if (/^action\.(hover|selected|disabledBackground|focus)$/.test(val)) {
      return { type: 'action', token: val };
    }
    return { type: 'unallowed', token: val };
  }
  if (node.type === 'MemberExpression') {
    const propName = node.property?.name || '';
    if (/^(hover|selected|disabledBackground|focus)$/.test(propName)) {
      if (node.object?.property?.name === 'action') {
        return { type: 'action', token: `action.${propName}` };
      }
    }
    const fullPath = `${node.object?.property?.name || ''}.${propName}`;
    if (
      allowedSet.has(propName) ||
      allowedSet.has(fullPath) ||
      DEFAULT_ALLOWED_BACKGROUNDS.has(propName) ||
      DEFAULT_ALLOWED_BACKGROUNDS.has(fullPath) ||
      Array.from(allowedSet).some(
        (pat) => pat && (propName.includes(pat) || fullPath.includes(pat)),
      )
    ) {
      return null;
    }
    const objName = node.object?.name || node.object?.property?.name;
    if (/^(grey|common|roles|targetPalette|palette)$/.test(objName)) {
      return null;
    }
    return null;
  }
  if (node.type === 'CallExpression' && node.callee?.name === 'alpha') {
    return checkContainerBackground(node.arguments?.[0], allowedSet);
  }
  if (node.type === 'LogicalExpression') {
    return (
      checkContainerBackground(node.right, allowedSet) ||
      checkContainerBackground(node.left, allowedSet)
    );
  }
  if (node.type === 'ConditionalExpression') {
    return (
      checkContainerBackground(node.consequent, allowedSet) ||
      checkContainerBackground(node.alternate, allowedSet)
    );
  }
  if (node.type === 'ArrowFunctionExpression' || node.type === 'FunctionExpression') {
    return checkContainerBackground(node.body, allowedSet);
  }
  return null;
}

export function hasBackdropFilter(objectNode) {
  if (!objectNode || objectNode.type !== 'ObjectExpression') return false;
  return objectNode.properties.some((prop) => {
    if (prop.type === 'Property') {
      const name = prop.key?.name || prop.key?.value;
      return name === 'backdropFilter' || name === 'WebkitBackdropFilter';
    }
    return false;
  });
}

export function isAlphaPaperCall(node) {
  if (!node) return false;
  if (node.type === 'CallExpression' && node.callee?.name === 'alpha') {
    const firstArg = node.arguments?.[0];
    if (
      firstArg?.type === 'MemberExpression' &&
      firstArg.property &&
      /^(paper|default)$/.test(firstArg.property.name)
    ) {
      return true;
    }
  }
  if (node.type === 'ArrowFunctionExpression' && node.body) {
    return isAlphaPaperCall(node.body);
  }
  return false;
}

export function isInsideApplyStylesDark(node) {
  let current = node?.parent;
  while (current) {
    if (
      current.type === 'CallExpression' &&
      current.callee?.property?.name === 'applyStyles' &&
      current.arguments?.[0]?.value === 'dark'
    ) {
      return true;
    }
    current = current.parent;
  }
  return false;
}

export function createContainerBackgroundRule() {
  return {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Enforce that container backgrounds use approved Material Design 3 surface containers via whitelist.',
      },
      schema: [
        {
          type: 'object',
          properties: { allowed: { type: 'array', items: { type: 'string' } } },
          additionalProperties: false,
        },
      ],
      messages: {
        noActionBackground:
          "Action token '{{token}}' is an interactive state overlay, not a surface container. Use Material Design 3 surface containers (e.g. 'theme.palette.surfaceContainer') or add to allowed whitelist.",
        unallowedBackground:
          "Container background '{{token}}' is not in the allowed theme whitelist. Use Material Design 3 surface containers (e.g. 'theme.palette.surfaceContainer') or add to allowed whitelist in eslint config.",
      },
    },
    create(context) {
      const options = context.options?.[0] || {};
      const allowedSet = new Set(options.allowed || []);

      function inspectNode(valueNode, reportNode) {
        if (isInteractiveContext(valueNode)) return;
        const result = checkContainerBackground(valueNode, allowedSet);
        if (result) {
          const messageId = result.type === 'action' ? 'noActionBackground' : 'unallowedBackground';
          context.report({
            node: reportNode,
            messageId,
            data: { token: result.token },
          });
        }
      }

      return {
        Property(node) {
          const key = node.key?.name || node.key?.value;
          if (key === 'backgroundColor' || key === 'bgcolor') {
            inspectNode(node.value, node);
          }
        },
        JSXAttribute(node) {
          const name = node.name?.name;
          if (name === 'bgcolor' || name === 'backgroundColor') {
            inspectNode(node.value?.expression || node.value, node);
          }
        },
      };
    },
  };
}
