/**
 * Material Design 3 ESLint Rules: Forbidden Native Elements
 * Enforces use of Material Design 3 / MUI components over native HTML elements.
 *
 * Forbids native elements (such as <button>, <a>, <input>, <select>, <textarea>, <img>)
 * in favor of their Material Design 3 / MUI counterparts.
 * Works seamlessly across both Astro templates (.astro) and React JSX/TSX (.jsx, .tsx).
 */

const DEFAULT_FORBID_MAP = new Map([
  [
    'button',
    'Native <button> is forbidden. Use <Button>, <IconButton>, or interactive component from @mui/material instead.',
  ],
  ['a', 'Native <a> is forbidden. Use <Link> or <Button href="..."> from @mui/material instead.'],
  [
    'input',
    'Native <input> is forbidden. Use <TextField> or <InputBase> from @mui/material instead.',
  ],
  [
    'select',
    'Native <select> is forbidden. Use <Select> or <TextField select> from @mui/material instead.',
  ],
  [
    'textarea',
    'Native <textarea> is forbidden. Use <TextField multiline> from @mui/material instead.',
  ],
  [
    'img',
    'Native <img> is forbidden. Use <Box component="img"> or <Avatar> from @mui/material instead.',
  ],
  [
    'div',
    "Native <div> is forbidden. Use MUI's <Card>, <Box>, <Stack>, or semantic HTML5 tags (<section>, <article>, <main>) instead.",
  ],
  [
    'span',
    'Native <span> is forbidden. Use MUI\'s <Typography component="span">, <Box component="span">, or <Chip> instead.',
  ],
]);

function createForbidNativeElementsRule() {
  return {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Disallow native HTML elements that have Material Design 3 / MUI component alternatives (e.g. <button>, <a>, <input>, <select>, <textarea>, <img>, <div>, <span>).',
      },
      schema: [
        {
          type: 'object',
          properties: {
            forbid: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  element: { type: 'string' },
                  message: { type: 'string' },
                  alternative: { type: 'string' },
                },
                required: ['element'],
                additionalProperties: false,
              },
            },
            exemptFiles: {
              type: 'array',
              items: { type: 'string' },
            },
          },
          additionalProperties: false,
        },
      ],
      messages: {
        forbiddenElement: '{{message}}',
        defaultForbidden:
          "Native HTML element '<{{element}}>' is forbidden when a Material Design 3 / MUI alternative is available. Use {{alternative}} instead.",
      },
    },
    create(context) {
      const options = context.options?.[0] || {};
      const customExempt = options.exemptFiles || [];
      const defaultExempt = [
        '.test.',
        '.spec.',
        'tests/',
        '.stories.',
        '.storybook/',
        'documents/',
      ];
      const allExempt = [...defaultExempt, ...customExempt];

      const filename = context.filename || context.getFilename?.() || '';
      if (allExempt.some((exempt) => filename.includes(exempt))) return {};

      // Build active forbid map
      const forbidConfig = options.forbid;
      const forbidMap = forbidConfig
        ? new Map(
            forbidConfig.map((item) => [
              item.element,
              item.message ||
                (item.alternative
                  ? `Use ${item.alternative} instead.`
                  : DEFAULT_FORBID_MAP.get(item.element) ||
                    'Use a Material Design 3 / MUI component instead.'),
            ]),
          )
        : DEFAULT_FORBID_MAP;

      return {
        JSXOpeningElement(node) {
          if (node.name?.type === 'JSXIdentifier') {
            const tagName = node.name.name;
            // Native HTML tags are lowercase in JSX and Astro; React/MUI components are Capitalized
            if (forbidMap.has(tagName)) {
              const customMessage = forbidMap.get(tagName);
              context.report({
                node,
                messageId: 'forbiddenElement',
                data: {
                  message: customMessage,
                },
              });
            }
          }
        },
      };
    },
  };
}

export const elementRules = {
  'forbid-native-elements': createForbidNativeElementsRule(),
  'no-native-html-elements': createForbidNativeElementsRule(),
};
