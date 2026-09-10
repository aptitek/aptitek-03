/**
 * Material Design 3 Restricted Imports & Syntax Guardrails
 * Theme-agnostic architectural boundaries for styled primitives and theme usage.
 */
export const forbidElementsRule = [
  'error',
  {
    forbid: [
      {
        element: 'button',
        message:
          'Native <button> is forbidden. Use <Button>, <IconButton>, or interactive component from @mui/material instead.',
      },
      {
        element: 'a',
        message:
          'Native <a> is forbidden. Use <Link> or <Button href="..."> from @mui/material instead.',
      },
      {
        element: 'input',
        message:
          'Native <input> is forbidden. Use <TextField> or <InputBase> from @mui/material instead.',
      },
      {
        element: 'select',
        message:
          'Native <select> is forbidden. Use <Select> or <TextField select> from @mui/material instead.',
      },
      {
        element: 'textarea',
        message:
          'Native <textarea> is forbidden. Use <TextField multiline> from @mui/material instead.',
      },
      {
        element: 'img',
        message:
          'Native <img> is forbidden. Use <Box component="img"> or <Avatar> from @mui/material instead.',
      },
      {
        element: 'div',
        message:
          "Native <div> is forbidden. Use MUI's <Card>, <Box>, <Stack>, or semantic HTML5 tags (<section>, <article>, <main>) instead.",
      },
      {
        element: 'span',
        message:
          'Native <span> is forbidden. Use MUI\'s <Typography component="span">, <Box component="span">, or <Chip> instead.',
      },
    ],
  },
];

export const m3ForbidNativeElementsRule = [
  'error',
  {
    ...forbidElementsRule[1],
    exemptFiles: ['A4Layout.astro', 'documents/'],
  },
];

export const restrictedImportsRule = [
  'error',
  {
    paths: [
      {
        name: '@mui/material',
        importNames: ['styled'],
        message:
          'Please import `styled` from `@mui/material/styles` to enforce theme-aware primitives.',
      },
      {
        name: '@emotion/styled',
        message:
          'Please use `styled` from `@mui/material/styles` to ensure direct access to MUI theme tokens.',
      },
      {
        name: '@tailwindcss/vite',
        message:
          'Tailwind CSS is disallowed in favor of Material Design 3 tokens.',
      },
      {
        name: 'tailwindcss',
        message:
          'Tailwind CSS is disallowed in favor of Material Design 3 tokens.',
      },
    ],
    patterns: [
      {
        group: ['@mui/material/internal_*'],
        message: 'Do not import private/internal MUI APIs.',
      },
    ],
  },
];

export const restrictedSyntaxRule = [
  'error',
  {
    selector: "JSXAttribute[name.name='style']",
    message:
      'Inline `style` attributes are prohibited altogether. Raw styles must be placed in clean CSS files or styled primitives.',
  },
  {
    selector:
      "JSXAttribute[name.name='className'] > Literal[value=/(!size-|flex-col|items-center|justify-between)/]",
    message:
      'Tailwind utility syntax is forbidden in className. Use MUI styled() primitives, theme-aware sx, or MD3 component tokens.',
  },
  {
    selector:
      "MemberExpression[object.property.name='palette'][property.name='mode']",
    message:
      "Do not read `theme.palette.mode` directly. Use CSS variables or MUI's `theme.applyStyles('dark', ...)` to avoid hydration mismatches and inline conditionals.",
  },
  {
    selector:
      ':matches(FunctionDeclaration, FunctionExpression, ArrowFunctionExpression) AssignmentPattern[left.name=/^(label|title|ariaLabel|placeholder|alt|helperText)$/] > Literal[value=/[a-zA-Z\u00C0-\u024F]/]',
    message:
      'Hardcoded localized string detected in component default prop value. Make the prop required or provide translation through i18n.',
  },
];
