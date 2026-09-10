import { describe, it, expect } from 'vitest';
import { ESLint } from 'eslint';

import m3ThemePlugin from '../../scripts/eslint-plugin-m3-theme.js';

const spacingEslint = new ESLint({
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
        'm3-theme/enforce-spacing-tokens': 'error',
        'm3-theme/enforce-minimum-touch-target': 'error',
      },
    },
  ],
});

const spacingDenseEslint = new ESLint({
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
        'm3-theme/enforce-minimum-touch-target': ['error', { allowDense: true }],
      },
    },
  ],
});

const spacingAllowedEslint = new ESLint({
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
        'm3-theme/enforce-spacing-tokens': ['error', { allowed: ['11px', '77'] }],
        'm3-theme/enforce-minimum-touch-target': ['error', { allowed: ['24px', '32'] }],
      },
    },
  ],
});

describe('m3-theme/enforce-spacing-tokens', () => {
  it('reports violations on non-standard numeric and string padding, margin, and gap', async () => {
    const code = `import Box from "@mui/material/Box";
export function Card() {
  return (
    <Box sx={{ p: 11, gap: "13px" }}>
      <div style={{ margin: "35px" }} />
    </Box>
  );
}`;
    const [result] = await spacingEslint.lintText(code, {
      filePath: 'app/components/molecules/TestCard/TestCard.tsx',
    });
    const violations = result?.messages.filter(
      (m) => m.ruleId === 'm3-theme/enforce-spacing-tokens',
    );
    expect(violations).toHaveLength(3);
    expect(violations[0]?.message).toContain("Non-standard spacing value '11'");
    expect(violations[0]?.message).toContain('M3_SPACINGS.medium');
    expect(violations[1]?.message).toContain("Non-standard spacing value '13px'");
    expect(violations[2]?.message).toContain("Non-standard spacing value '35px'");
  });

  it('reports violations on non-standard stroke widths', async () => {
    const code = `import Box from "@mui/material/Box";
export function Card() {
  return <Box sx={{ borderWidth: 7 }}><div style={{ borderWidth: "5px" }} /></Box>;
}`;
    const [result] = await spacingEslint.lintText(code, {
      filePath: 'app/components/molecules/TestCard/TestCard.tsx',
    });
    const violations = result?.messages.filter(
      (m) => m.ruleId === 'm3-theme/enforce-spacing-tokens',
    );
    expect(violations).toHaveLength(2);
    expect(violations[0]?.message).toContain("Non-standard stroke width '7'");
    expect(violations[1]?.message).toContain("Non-standard stroke width '5px'");
  });

  it('permits standard M3 spacing numbers, MUI multipliers, and CSS custom properties', async () => {
    const code = `import Box from "@mui/material/Box";
import { M3_SPACINGS, M3_SPACING_FRIENDSHIPS } from "~/tokens/spacing";
export function Card() {
  return (
    <Box
      sx={{
        p: 2,
        gap: 1.5,
        m: "16px",
        paddingTop: M3_SPACINGS.large,
        paddingBottom: M3_SPACING_FRIENDSHIPS.bestFriends,
        margin: "8px 16px",
        rowGap: "var(--md-sys-spacing-standard)",
      }}
    />
  );
}`;
    const [result] = await spacingEslint.lintText(code, {
      filePath: 'app/components/molecules/TestCard/TestCard.tsx',
    });
    const violations = result?.messages.filter(
      (m) => m.ruleId === 'm3-theme/enforce-spacing-tokens',
    );
    expect(violations).toHaveLength(0);
  });

  it('permits standard M3 stroke widths and border styles', async () => {
    const code = `import Box from "@mui/material/Box";
import { M3_STROKES } from "~/tokens/spacing";
export function Card() {
  return (
    <Box
      sx={{
        borderWidth: M3_STROKES.thin,
        borderTopWidth: 2,
        borderBottomWidth: "0.5px",
        borderRightWidth: "var(--md-sys-stroke-medium)",
      }}
    />
  );
}`;
    const [result] = await spacingEslint.lintText(code, {
      filePath: 'app/components/molecules/TestCard/TestCard.tsx',
    });
    const violations = result?.messages.filter(
      (m) => m.ruleId === 'm3-theme/enforce-spacing-tokens',
    );
    expect(violations).toHaveLength(0);
  });

  it('permits custom spacing when added to the allowed whitelist option', async () => {
    const code = `export function Card() {
  return <div style={{ padding: "11px", margin: 77 }} />;
}`;
    const [result] = await spacingAllowedEslint.lintText(code, {
      filePath: 'app/components/molecules/TestCard/TestCard.tsx',
    });
    const violations = result?.messages.filter(
      (m) => m.ruleId === 'm3-theme/enforce-spacing-tokens',
    );
    expect(violations).toHaveLength(0);
  });
});

describe('m3-theme/enforce-minimum-touch-target', () => {
  it('reports interactive elements with touch target dimensions below 48x48 dp', async () => {
    const code = `import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

export const SmallAction = styled(IconButton)({
  minWidth: 32,
  minHeight: 32,
});

export function Actions() {
  return (
    <div>
      <IconButton sx={{ width: 24, height: 24 }} />
      <button style={{ minWidth: "36px" }} />
      <div role="button" sx={{ width: 30, height: 30 }} />
    </div>
  );
}`;
    const [result] = await spacingEslint.lintText(code, {
      filePath: 'app/components/molecules/ActionGroup/ActionGroup.tsx',
    });
    const violations = result?.messages.filter(
      (m) => m.ruleId === 'm3-theme/enforce-minimum-touch-target',
    );
    expect(violations.length).toBeGreaterThanOrEqual(4);
    expect(violations[0]?.message).toContain('below MD3/WCAG 48x48 dp minimum');
  });

  it('permits 48x48 dp minimum touch targets and explicit 48px containers', async () => {
    const code = `import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { M3_DIMENSIONS } from "~/tokens/spacing";

export const FabButton = styled(IconButton)({
  width: 48,
  height: 48,
});

export function ProperButtons() {
  return (
    <div>
      {/* 24px icon visually inside 48px touch target */}
      <IconButton sx={{ width: 24, height: 24, minWidth: 48, minHeight: 48 }} />
      <Button sx={{ minHeight: M3_DIMENSIONS.touchTarget }} />
      <button style={{ minWidth: 48, minHeight: 48 }} />
    </div>
  );
}`;
    const [result] = await spacingEslint.lintText(code, {
      filePath: 'app/components/molecules/ActionGroup/ActionGroup.tsx',
    });
    const violations = result?.messages.filter(
      (m) => m.ruleId === 'm3-theme/enforce-minimum-touch-target',
    );
    expect(violations).toHaveLength(0);
  });

  it('permits dense 40px touch targets when allowDense is enabled', async () => {
    const code = `import IconButton from "@mui/material/IconButton";
export function DenseAction() {
  return <IconButton sx={{ minWidth: 40, minHeight: 40 }} />;
}`;
    const [result] = await spacingDenseEslint.lintText(code, {
      filePath: 'app/components/molecules/ActionGroup/ActionGroup.tsx',
    });
    const violations = result?.messages.filter(
      (m) => m.ruleId === 'm3-theme/enforce-minimum-touch-target',
    );
    expect(violations).toHaveLength(0);
  });

  it('permits custom dimensions added to the allowed whitelist option', async () => {
    const code = `import IconButton from "@mui/material/IconButton";
export function CustomSmall() {
  return <IconButton sx={{ width: "24px", minWidth: 32 }} />;
}`;
    const [result] = await spacingAllowedEslint.lintText(code, {
      filePath: 'app/components/molecules/ActionGroup/ActionGroup.tsx',
    });
    const violations = result?.messages.filter(
      (m) => m.ruleId === 'm3-theme/enforce-minimum-touch-target',
    );
    expect(violations).toHaveLength(0);
  });
});
