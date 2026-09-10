import { describe, it, expect } from 'vitest';
import { ESLint } from 'eslint';

import m3ThemePlugin from '../../scripts/eslint-plugin-m3-theme.js';

const stateEslint = new ESLint({
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
        'm3-theme/enforce-state-layers': 'error',
      },
    },
  ],
});

const stateAllowedEslint = new ESLint({
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
        'm3-theme/enforce-state-layers': ['error', { allowed: ['#ff0055', 'custom-hover-bg'] }],
      },
    },
  ],
});

describe('m3-theme/enforce-state-layers', () => {
  it('reports arbitrary solid background color swaps in :hover and :focus', async () => {
    const code = `import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
export const Card = styled(Box)(({ theme }) => ({
  "&:hover": {
    backgroundColor: "#123456",
  },
  "&:focus": {
    backgroundColor: theme.palette.primary.dark,
  },
}));`;
    const [result] = await stateEslint.lintText(code, {
      filePath: 'app/components/molecules/StateCard/StateCard.tsx',
    });
    const violations = result?.messages.filter(
      (m) =>
        m.ruleId === 'm3-theme/enforce-state-layers' &&
        m.message.includes("Arbitrary 'backgroundColor' swap"),
    );
    expect(violations).toHaveLength(2);
    expect(violations[0]?.message).toContain(
      "Arbitrary 'backgroundColor' swap ('#123456') detected in 'hover' state",
    );
    expect(violations[0]?.message).toContain(
      'MD3 requires state layers with exact opacities (hover: 0.08',
    );
    expect(violations[1]?.message).toContain(
      "Arbitrary 'backgroundColor' swap ('theme.palette.primary.dark') detected in 'focus' state",
    );
  });

  it('reports invalid interaction state opacity values', async () => {
    const code = `import Box from "@mui/material/Box";
export function ButtonLayer() {
  return (
    <Box
      sx={{
        "&:hover": { opacity: 0.5 },
        "&:focus": { opacity: 0.25 },
        "&:active": { opacity: 0.8 },
      }}
    />
  );
}`;
    const [result] = await stateEslint.lintText(code, {
      filePath: 'app/components/molecules/StateCard/StateCard.tsx',
    });
    const violations = result?.messages.filter(
      (m) =>
        m.ruleId === 'm3-theme/enforce-state-layers' &&
        m.message.includes('Invalid interaction state opacity'),
    );
    expect(violations).toHaveLength(3);
    expect(violations[0]?.message).toContain("Invalid interaction state opacity '0.5' for 'hover'");
    expect(violations[1]?.message).toContain(
      "Invalid interaction state opacity '0.25' for 'focus'",
    );
    expect(violations[2]?.message).toContain(
      "Invalid interaction state opacity '0.8' for 'pressed'",
    );
  });

  it('reports non-standard alpha() opacities inside hover states', async () => {
    const code = `import { styled, alpha } from "@mui/material/styles";
export const Action = styled("div")(({ theme }) => ({
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.4),
  },
}));`;
    const [result] = await stateEslint.lintText(code, {
      filePath: 'app/components/molecules/StateCard/StateCard.tsx',
    });
    const violations = result?.messages.filter((m) => m.ruleId === 'm3-theme/enforce-state-layers');
    expect(violations).toHaveLength(1);
    expect(violations[0]?.message).toContain('alpha(theme.palette.primary.main, 0.4)');
  });

  it('permits exact MD3 state opacities, alpha(color, 0.08), action tokens, and CSS variables', async () => {
    const code = `import Box from "@mui/material/Box";
import { styled, alpha } from "@mui/material/styles";
import { M3_STATE_OPACITIES } from "~/tokens/state";

export const ProperStateComponent = styled(Box)(({ theme }) => ({
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    opacity: M3_STATE_OPACITIES.hover,
  },
  "&:focus": {
    backgroundColor: theme.palette.action.focus,
    opacity: 0.12,
  },
  "&:active": {
    backgroundColor: "action.selected",
    opacity: "0.12",
  },
  "&.Mui-dragged": {
    opacity: 0.16,
  },
}));`;
    const [result] = await stateEslint.lintText(code, {
      filePath: 'app/components/molecules/StateCard/StateCard.tsx',
    });
    const violations = result?.messages.filter((m) => m.ruleId === 'm3-theme/enforce-state-layers');
    expect(violations).toHaveLength(0);
  });

  it('permits values added to the allowed whitelist option', async () => {
    const code = `import Box from "@mui/material/Box";
export function CustomButton() {
  return <Box sx={{ "&:hover": { backgroundColor: "#ff0055" } }} />;
}`;
    const [result] = await stateAllowedEslint.lintText(code, {
      filePath: 'app/components/molecules/StateCard/StateCard.tsx',
    });
    const violations = result?.messages.filter((m) => m.ruleId === 'm3-theme/enforce-state-layers');
    expect(violations).toHaveLength(0);
  });
});
