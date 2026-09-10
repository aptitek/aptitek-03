import { describe, it, expect } from 'vitest';
import { ESLint } from 'eslint';

import m3ThemePlugin from '../../scripts/eslint-plugin-m3-theme.js';

const elevationEslint = new ESLint({
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
        'm3-theme/enforce-elevation-levels': 'error',
        'm3-theme/no-arbitrary-z-index': 'error',
        'm3-theme/no-hardcoded-box-shadow': 'error',
      },
    },
  ],
});

const elevationAllowedEslint = new ESLint({
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
        'm3-theme/enforce-elevation-levels': [
          'error',
          { allowed: ['10', 'custom-shadow-override'] },
        ],
        'm3-theme/no-arbitrary-z-index': ['error', { allowed: ['9999'] }],
      },
    },
  ],
});

describe('m3-theme/enforce-elevation-levels', () => {
  it('reports raw drop-shadow strings on boxShadow properties', async () => {
    const code = `import Box from "@mui/material/Box";
export function Card() {
  return (
    <Box sx={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)" }}>
      <div style={{ boxShadow: "0px 2px 8px #000000" }} />
    </Box>
  );
}`;
    const [result] = await elevationEslint.lintText(code, {
      filePath: 'app/components/molecules/ElevationCard/ElevationCard.tsx',
    });
    const violations = result?.messages.filter(
      (m) =>
        m.ruleId === 'm3-theme/enforce-elevation-levels' &&
        m.message.includes('Raw box-shadow'),
    );
    expect(violations).toHaveLength(2);
    expect(violations[0]?.message).toContain(
      "Raw box-shadow '0 4px 12px rgba(0, 0, 0, 0.5)'",
    );
    expect(violations[0]?.message).toContain(
      'MD3 uses tonal elevation and 5 strict elevation levels',
    );
    expect(violations[1]?.message).toContain(
      "Raw box-shadow '0px 2px 8px #000000'",
    );
  });

  it('reports legacy MUI elevation levels (> 5) on theme.shadows access and JSX elevation props', async () => {
    const code = `import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
export const StyledCard = styled("div")(({ theme }) => ({
  boxShadow: theme.shadows[8],
}));
export function PaperCard() {
  return <Paper elevation={12} />;
}`;
    const [result] = await elevationEslint.lintText(code, {
      filePath: 'app/components/molecules/ElevationCard/ElevationCard.tsx',
    });
    const violations = result?.messages.filter(
      (m) => m.ruleId === 'm3-theme/enforce-elevation-levels',
    );
    expect(violations.length).toBeGreaterThanOrEqual(2);
    const shadowsViolation = violations.find((v) =>
      v.message.includes(
        'Elevation level 8 is not an approved MD3 elevation level',
      ),
    );
    const propViolation = violations.find((v) =>
      v.message.includes("Elevation level '12' exceeds MD3 elevation levels"),
    );
    expect(shadowsViolation).toBeDefined();
    expect(propViolation).toBeDefined();
  });

  it('reports arbitrary numeric z-index values outside MD3 levels (0-5)', async () => {
    const code = `import Box from "@mui/material/Box";
export function Overlay() {
  return (
    <Box sx={{ zIndex: 10 }}>
      <div style={{ zIndex: 9999 }} />
    </Box>
  );
}`;
    const [result] = await elevationEslint.lintText(code, {
      filePath: 'app/components/molecules/ElevationCard/ElevationCard.tsx',
    });
    const violations = result?.messages.filter(
      (m) =>
        m.ruleId === 'm3-theme/enforce-elevation-levels' &&
        m.message.includes('Arbitrary z-index'),
    );
    expect(violations).toHaveLength(2);
    expect(violations[0]?.message).toContain("Arbitrary z-index '10' detected");
    expect(violations[1]?.message).toContain(
      "Arbitrary z-index '9999' detected",
    );
  });

  it('permits standard M3 elevation tokens, theme.shadows[0..5], highlight rings, and semantic z-index', async () => {
    const code = `import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
export const Card = styled("div")(({ theme }) => ({
  boxShadow: theme.shadows[2],
  zIndex: theme.zIndex.modal,
}));
export function ProperElevation() {
  return (
    <Box
      sx={{
        boxShadow: "var(--md-sys-elevation-level1)",
        zIndex: 3,
      }}
    >
      <Paper elevation={4} sx={{ boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.1)", zIndex: "auto" }} />
    </Box>
  );
}`;
    const [result] = await elevationEslint.lintText(code, {
      filePath: 'app/components/molecules/ElevationCard/ElevationCard.tsx',
    });
    const violations = result?.messages.filter(
      (m) => m.ruleId === 'm3-theme/enforce-elevation-levels',
    );
    expect(violations).toHaveLength(0);
  });

  it('permits values added to the allowed whitelist option', async () => {
    const code = `import Box from "@mui/material/Box";
export function CustomOverlay() {
  return <Box sx={{ zIndex: 10, boxShadow: "custom-shadow-override" }} />;
}`;
    const [result] = await elevationAllowedEslint.lintText(code, {
      filePath: 'app/components/molecules/ElevationCard/ElevationCard.tsx',
    });
    const violations = result?.messages.filter(
      (m) => m.ruleId === 'm3-theme/enforce-elevation-levels',
    );
    expect(violations).toHaveLength(0);
  });
});

describe('m3-theme/no-arbitrary-z-index', () => {
  it('reports arbitrary z-index numbers while allowing whitelisted exceptions', async () => {
    const code = `export const style = { zIndex: 20 };`;
    const [result] = await elevationEslint.lintText(code, {
      filePath:
        'app/components/molecules/ElevationCard/ElevationCard.styles.ts',
    });
    const violations = result?.messages.filter(
      (m) => m.ruleId === 'm3-theme/no-arbitrary-z-index',
    );
    expect(violations).toHaveLength(1);
    expect(violations[0]?.message).toContain("Arbitrary z-index '20' detected");

    const allowedCode = `export const allowedStyle = { zIndex: 9999 };`;
    const [allowedResult] = await elevationAllowedEslint.lintText(allowedCode, {
      filePath:
        'app/components/molecules/ElevationCard/ElevationCard.styles.ts',
    });
    const allowedViolations = allowedResult?.messages.filter(
      (m) => m.ruleId === 'm3-theme/no-arbitrary-z-index',
    );
    expect(allowedViolations).toHaveLength(0);
  });
});
