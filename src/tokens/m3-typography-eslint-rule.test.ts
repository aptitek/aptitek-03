import { describe, it, expect } from 'vitest';
import { ESLint } from 'eslint';

import m3ThemePlugin from '../../scripts/eslint-plugin-m3-theme.js';

const typographyEslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: [
    {
      files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
      languageOptions: {
        parserOptions: { ecmaFeatures: { jsx: true } },
      },
      plugins: {
        'm3-theme': m3ThemePlugin,
      },
      rules: {
        'm3-theme/enforce-typography-tokens': 'error',
      },
    },
  ],
});

describe('m3-theme/enforce-typography-tokens', () => {
  it('reports violations on non-standard fontFamily strings', async () => {
    const code = `import Box from "@mui/material/Box";
export function Card() {
  return (
    <Box sx={{ fontFamily: "monospace" }}>
      <div style={{ fontFamily: "Courier New, monospace" }} />
    </Box>
  );
}`;
    const [result] = await typographyEslint.lintText(code, {
      filePath: 'app/components/molecules/TestCard/TestCard.tsx',
    });
    const violations = result?.messages.filter(
      (m) => m.ruleId === 'm3-theme/enforce-typography-tokens',
    );
    expect(violations).toHaveLength(2);
    expect(violations[0]?.message).toContain(
      'Non-standard fontFamily "monospace"',
    );
    expect(violations[1]?.message).toContain(
      'Non-standard fontFamily "Courier New, monospace"',
    );
  });

  it('permits tokenized FONT_FAMILIES, theme properties, and CSS variables', async () => {
    const code = `import Box from "@mui/material/Box";
import { FONT_FAMILIES } from "~/tokens/typography";
export function Card() {
  return (
    <Box sx={{ fontFamily: FONT_FAMILIES.mono }}>
      <div style={{ fontFamily: "var(--font-family-brand)" }} />
      <span style={{ fontFamily: "inherit" }} />
    </Box>
  );
}`;
    const [result] = await typographyEslint.lintText(code, {
      filePath: 'app/components/molecules/TestCard/TestCard.tsx',
    });
    const violations = result?.messages.filter(
      (m) => m.ruleId === 'm3-theme/enforce-typography-tokens',
    );
    expect(violations).toHaveLength(0);
  });

  it('reports violations on non-standard fontVariationSettings', async () => {
    const code = `import Box from "@mui/material/Box";
export function Card() {
  return (
    <Box sx={{ fontVariationSettings: "'wght' 999" }}>
      <div style={{ fontVariationSettings: "random-value" }} />
    </Box>
  );
}`;
    const [result] = await typographyEslint.lintText(code, {
      filePath: 'app/components/molecules/TestCard/TestCard.tsx',
    });
    const violations = result?.messages.filter(
      (m) => m.ruleId === 'm3-theme/enforce-typography-tokens',
    );
    expect(violations).toHaveLength(2);
    expect(violations[0]?.message).toContain(
      'Non-standard fontVariationSettings',
    );
    expect(violations[1]?.message).toContain(
      'Non-standard fontVariationSettings',
    );
  });

  it('permits tokenized RECURSIVE_PRESETS and formatFontVariation', async () => {
    const code = `import Box from "@mui/material/Box";
import { RECURSIVE_PRESETS, formatFontVariation } from "~/tokens/typography";
export function Card() {
  return (
    <Box sx={{ fontVariationSettings: RECURSIVE_PRESETS.casual }}>
      <div style={{ fontVariationSettings: formatFontVariation({ casl: 1, mono: 0 }) }} />
      <span style={{ fontVariationSettings: "var(--font-variation-mono)" }} />
    </Box>
  );
}`;
    const [result] = await typographyEslint.lintText(code, {
      filePath: 'app/components/molecules/TestCard/TestCard.tsx',
    });
    const violations = result?.messages.filter(
      (m) => m.ruleId === 'm3-theme/enforce-typography-tokens',
    );
    expect(violations).toHaveLength(0);
  });

  it('reports violations on unapproved font sizes and permits M3 type tokens', async () => {
    const code = `import Box from "@mui/material/Box";
export function Card() {
  return (
    <Box sx={{ fontSize: 19 }}>
      <div style={{ fontSize: "17px" }} />
      <span style={{ fontSize: "1.17rem" }} />
      <p style={{ fontSize: 16 }} />
      <h1 style={{ fontSize: "1rem" }} />
    </Box>
  );
}`;
    const [result] = await typographyEslint.lintText(code, {
      filePath: 'app/components/molecules/TestCard/TestCard.tsx',
    });
    const violations = result?.messages.filter(
      (m) => m.ruleId === 'm3-theme/enforce-typography-tokens',
    );
    expect(violations).toHaveLength(3);
    expect(violations[0]?.message).toContain(
      'Non-standard fontSize 19 detected',
    );
    expect(violations[1]?.message).toContain(
      'Non-standard fontSize "17px" detected',
    );
    expect(violations[2]?.message).toContain(
      'Non-standard fontSize "1.17rem" detected',
    );
  });
});
