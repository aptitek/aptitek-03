import { describe, it, expect } from 'vitest';
import { ESLint } from 'eslint';

import m3ThemePlugin from '../../scripts/eslint-plugin-m3-theme.js';

const shapeEslint = new ESLint({
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
        'm3-theme/enforce-shape-tokens': 'error',
      },
    },
  ],
});

describe('m3-theme/enforce-shape-tokens advanced enforcement', () => {
  it('reports violations on individual corner radius properties with closest token suggestions', async () => {
    const code = `import Box from "@mui/material/Box";
export function Card() {
  return (
    <Box sx={{ borderTopLeftRadius: 10, borderBottomRightRadius: "14px" }}>
      <div style={{ borderTopRightRadius: "6px" }} />
    </Box>
  );
}`;
    const [result] = await shapeEslint.lintText(code, {
      filePath: 'app/components/molecules/TestCard/TestCard.tsx',
    });
    const violations = result?.messages.filter((m) => m.ruleId === 'm3-theme/enforce-shape-tokens');
    expect(violations).toHaveLength(3);
    expect(violations[0]?.message).toContain("Non-standard corner radius '10'");
    expect(violations[0]?.message).toContain('M3_SHAPE_CORNERS.small');
    expect(violations[1]?.message).toContain("Non-standard corner radius '14px'");
    expect(violations[2]?.message).toContain("Non-standard corner radius '6px'");
    expect(violations[2]?.message).toContain('M3_SHAPE_CORNERS.small');
  });

  it('reports hardcoded pixel values inside template literals', async () => {
    const code = `export function Card() {
  return <div style={{ borderRadius: \`10px\` }} />;
}`;
    const [result] = await shapeEslint.lintText(code, {
      filePath: 'app/components/molecules/TestCard/TestCard.tsx',
    });
    const violations = result?.messages.filter((m) => m.ruleId === 'm3-theme/enforce-shape-tokens');
    expect(violations).toHaveLength(1);
    expect(violations[0]?.message).toContain("Non-standard corner radius '10px'");
  });

  it('reports dynamic import and require of material-shapes-ts outside tokens', async () => {
    const code = `export async function loadShapes() {
  const shapes = await import("material-shapes-ts");
  const shapes2 = require("material-shapes-ts");
  return { shapes, shapes2 };
}`;
    const [result] = await shapeEslint.lintText(code, {
      filePath: 'app/components/molecules/TestCard/TestCard.tsx',
    });
    const violations = result?.messages.filter((m) => m.ruleId === 'm3-theme/enforce-shape-tokens');
    expect(violations).toHaveLength(2);
    expect(violations[0]?.message).toContain(
      "Direct import from 'material-shapes-ts' is forbidden",
    );
    expect(violations[1]?.message).toContain(
      "Direct import from 'material-shapes-ts' is forbidden",
    );
  });

  it('permits standard tokens across individual corner properties', async () => {
    const code = `import Box from "@mui/material/Box";
import { M3_SHAPE_CORNERS } from "~/tokens/shapes";
export function Card() {
  return (
    <Box
      sx={{
        borderTopLeftRadius: M3_SHAPE_CORNERS.largeIncreased,
        borderTopRightRadius: "20px",
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: "var(--md-sys-shape-corner-medium)",
      }}
    />
  );
}`;
    const [result] = await shapeEslint.lintText(code, {
      filePath: 'app/components/molecules/TestCard/TestCard.tsx',
    });
    const violations = result?.messages.filter((m) => m.ruleId === 'm3-theme/enforce-shape-tokens');
    expect(violations).toHaveLength(0);
  });
});
