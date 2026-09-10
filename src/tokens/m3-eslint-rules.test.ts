import { describe, it, expect } from 'vitest';
import { ESLint, type Linter } from 'eslint';

import m3ThemePlugin from '../../scripts/eslint-plugin-m3-theme.js';

function createM3Eslint(rules: Linter.RulesRecord) {
  return new ESLint({
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
        rules,
      },
    ],
  });
}

describe('Material Design 3 ESLint Theming Rules', () => {
  const eslint = createM3Eslint({
    'm3-theme/no-action-as-container-background': 'error',
    'm3-theme/allowed-theme-colors': ['error', { allowed: ['#00ff66', 'rgba(0, 0, 0,'] }],
    'm3-theme/no-static-role-colors': 'error',
    'm3-theme/no-alpha-paper-surface': 'error',
    'm3-theme/no-dark-mode-black-shadow': 'error',
    'm3-theme/no-hardcoded-box-shadow': 'error',
    'm3-theme/no-raw-svg-icons': 'error',
    'm3-theme/enforce-rounded-icons': 'error',
    'm3-theme/enforce-motion-tokens': 'error',
    'm3-theme/enforce-shape-tokens': 'error',
    'm3-theme/enforce-elevation-levels': 'error',
    'm3-theme/enforce-state-layers': 'error',
    'm3-theme/enforce-minimum-touch-target': 'error',
  });

  const customAllowedEslint = createM3Eslint({
    'm3-theme/no-action-as-container-background': [
      'error',
      { allowed: ['fuchsia', 'custom-brand-bg'] },
    ],
  });

  const motionAllowedEslint = createM3Eslint({
    'm3-theme/enforce-motion-tokens': ['error', { allowed: ['0.42', 'custom-special-physics'] }],
  });

  const shapeAllowedEslint = createM3Eslint({
    'm3-theme/enforce-shape-tokens': ['error', { allowed: ['15px', '77'] }],
  });

  describe('m3-theme/no-action-as-container-background (whitelist enforcement)', () => {
    it('reports static action tokens used as container backgrounds', async () => {
      const code = `import Box from "@mui/material/Box";
export function Card() { return <Box sx={{ p: 2, backgroundColor: "action.hover" }} />; }`;
      const [result] = await eslint.lintText(code, {
        filePath: 'app/components/molecules/TestCard/TestCard.tsx',
      });
      const violations = result?.messages.filter(
        (m) => m.ruleId === 'm3-theme/no-action-as-container-background',
      );
      expect(violations.length).toBeGreaterThan(0);
      expect(violations[0]?.message).toContain("Action token 'action.hover'");
    });

    it('reports un-whitelisted container backgrounds', async () => {
      const code = `import Box from "@mui/material/Box";
export function Card() { return <Box sx={{ backgroundColor: "fuchsia" }} />; }`;
      const [result] = await eslint.lintText(code, {
        filePath: 'app/components/molecules/TestCard/TestCard.tsx',
      });
      const violations = result?.messages.filter(
        (m) => m.ruleId === 'm3-theme/no-action-as-container-background',
      );
      expect(violations.length).toBeGreaterThan(0);
      expect(violations[0]?.message).toContain(
        "Container background 'fuchsia' is not in the allowed theme whitelist",
      );
    });

    it('permits approved surface containers and CSS variables', async () => {
      const code = `import Box from "@mui/material/Box";
export function Card() { return <Box sx={{ backgroundColor: "surfaceContainerLow", color: "var(--custom-color)" }} />; }`;
      const [result] = await eslint.lintText(code, {
        filePath: 'app/components/molecules/TestCard/TestCard.tsx',
      });
      const violations = result?.messages.filter(
        (m) => m.ruleId === 'm3-theme/no-action-as-container-background',
      );
      expect(violations).toHaveLength(0);
    });

    it('permits custom background tokens when added to the allowed option', async () => {
      const code = `import Box from "@mui/material/Box";
export function Card() { return <Box sx={{ backgroundColor: "fuchsia" }} />; }`;
      const [result] = await customAllowedEslint.lintText(code, {
        filePath: 'app/components/molecules/TestCard/TestCard.tsx',
      });
      const violations = result?.messages.filter(
        (m) => m.ruleId === 'm3-theme/no-action-as-container-background',
      );
      expect(violations).toHaveLength(0);
    });

    it('permits action tokens inside interactive pseudo-classes (&:hover)', async () => {
      const code = `import Box from "@mui/material/Box";
export function ButtonWrapper() { return <Box sx={{ p: 1, "&:hover": { backgroundColor: "action.hover" } }} />; }`;
      const [result] = await eslint.lintText(code, {
        filePath: 'app/components/molecules/TestButton/TestButton.tsx',
      });
      const violations = result?.messages.filter(
        (m) => m.ruleId === 'm3-theme/no-action-as-container-background',
      );
      expect(violations).toHaveLength(0);
    });
  });

  describe('m3-theme/allowed-theme-colors', () => {
    it('reports hardcoded raw colors not present in the allowed whitelist', async () => {
      const code = `export const BAD_COLOR = "#ff00aa";`;
      const [result] = await eslint.lintText(code, {
        filePath: 'app/components/atoms/Badge/Badge.styles.ts',
      });
      const violations = result?.messages.filter(
        (m) => m.ruleId === 'm3-theme/allowed-theme-colors',
      );
      expect(violations.length).toBeGreaterThan(0);
      expect(violations[0]?.message).toContain("Hardcoded color '#ff00aa'");
    });

    it('permits colors present in the allowed whitelist, CSS variables, and keywords', async () => {
      const code = `export const OK_HEX = "#00ff66";
export const OK_CSS_VAR = "var(--md-sys-color-primary)";
export const OK_TRANSPARENT = "transparent";`;
      const [result] = await eslint.lintText(code, {
        filePath: 'app/components/atoms/Badge/Badge.styles.ts',
      });
      const violations = result?.messages.filter(
        (m) => m.ruleId === 'm3-theme/allowed-theme-colors',
      );
      expect(violations).toHaveLength(0);
    });
  });

  describe('m3-theme/no-static-role-colors', () => {
    it('reports direct usage of static ROLE_COLORS in UI components', async () => {
      const code = `import { ROLE_COLORS } from "~/tokens/roles";
export function RoleBadge() { return <span style={{ color: ROLE_COLORS.admin }} />; }`;
      const [result] = await eslint.lintText(code, {
        filePath: 'app/components/atoms/Badge/Badge.tsx',
      });
      const violations = result?.messages.filter(
        (m) => m.ruleId === 'm3-theme/no-static-role-colors',
      );
      expect(violations.length).toBeGreaterThan(0);
      expect(violations[0]?.message).toContain(
        "Static 'ROLE_COLORS' is forbidden in UI components",
      );
    });
  });

  describe('m3-theme/no-alpha-paper-surface', () => {
    it('reports alpha(theme.palette.background.paper) without backdropFilter', async () => {
      const code = `import { styled, alpha } from "@mui/material/styles";
export const Card = styled("div")(({ theme }) => ({ backgroundColor: alpha(theme.palette.background.paper, 0.5) }));`;
      const [result] = await eslint.lintText(code, {
        filePath: 'app/components/atoms/Test/Test.styles.ts',
      });
      const violations = result?.messages.filter(
        (m) => m.ruleId === 'm3-theme/no-alpha-paper-surface',
      );
      expect(violations.length).toBeGreaterThan(0);
      expect(violations[0]?.message).toContain(
        'Arbitrary opacity on background.paper/default is forbidden',
      );
    });

    it('permits alpha(theme.palette.background.paper) when backdropFilter is present', async () => {
      const code = `import { styled, alpha } from "@mui/material/styles";
export const Card = styled("div")(({ theme }) => ({ backgroundColor: alpha(theme.palette.background.paper, 0.5), backdropFilter: "blur(8px)" }));`;
      const [result] = await eslint.lintText(code, {
        filePath: 'app/components/atoms/Test/Test.styles.ts',
      });
      const violations = result?.messages.filter(
        (m) => m.ruleId === 'm3-theme/no-alpha-paper-surface',
      );
      expect(violations).toHaveLength(0);
    });
  });

  describe('m3-theme/no-dark-mode-black-shadow', () => {
    it("reports black drop-shadows inside theme.applyStyles('dark')", async () => {
      const code = `import { styled } from "@mui/material/styles";
export const Card = styled("div")(({ theme }) => ({ ...theme.applyStyles("dark", { boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)" }) }));`;
      const [result] = await eslint.lintText(code, {
        filePath: 'app/components/atoms/Test/Test.styles.ts',
      });
      const violations = result?.messages.filter(
        (m) => m.ruleId === 'm3-theme/no-dark-mode-black-shadow',
      );
      expect(violations.length).toBeGreaterThan(0);
      expect(violations[0]?.message).toContain(
        'Dark mode elevation violation: Black drop-shadows are forbidden',
      );
    });

    it('permits perimeter highlight rings in dark mode', async () => {
      const code = `import { styled } from "@mui/material/styles";
export const Card = styled("div")(({ theme }) => ({ ...theme.applyStyles("dark", { boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.1)" }) }));`;
      const [result] = await eslint.lintText(code, {
        filePath: 'app/components/atoms/Test/Test.styles.ts',
      });
      const violations = result?.messages.filter(
        (m) => m.ruleId === 'm3-theme/no-dark-mode-black-shadow',
      );
      expect(violations).toHaveLength(0);
    });
  });

  describe('m3-theme/no-hardcoded-box-shadow', () => {
    it('reports hardcoded raw rgba shadow strings in components', async () => {
      const code = `import Box from "@mui/material/Box";
export function Card() { return <Box sx={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }} />; }`;
      const [result] = await eslint.lintText(code, {
        filePath: 'app/components/atoms/Test/Test.tsx',
      });
      const violations = result?.messages.filter(
        (m) => m.ruleId === 'm3-theme/no-hardcoded-box-shadow',
      );
      expect(violations.length).toBeGreaterThan(0);
      expect(violations[0]?.message).toContain('Hardcoded boxShadow string detected');
    });
  });

  describe('m3-theme/no-raw-svg-icons', () => {
    it('reports raw <svg> elements in UI components', async () => {
      const code = `export function BadIcon() { return <svg viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2z" /></svg>; }`;
      const [result] = await eslint.lintText(code, {
        filePath: 'app/components/atoms/TestIcon/TestIcon.tsx',
      });
      const violations = result?.messages.filter((m) => m.ruleId === 'm3-theme/no-raw-svg-icons');
      expect(violations.length).toBeGreaterThan(0);
      expect(violations[0]?.message).toContain('Raw <svg> elements for icons are forbidden');
    });

    it('reports custom icon path variables (_ICON_PATH)', async () => {
      const code = `export const SEARCH_ICON_PATH = "M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5";`;
      const [result] = await eslint.lintText(code, {
        filePath: 'app/components/molecules/SearchField/SearchField.styles.ts',
      });
      const violations = result?.messages.filter((m) => m.ruleId === 'm3-theme/no-raw-svg-icons');
      expect(violations.length).toBeGreaterThan(0);
      expect(violations[0]?.message).toContain('Hardcoding custom SVG icon path glyphs');
    });

    it('permits raw svg in exempt graphic definitions like ShapeDefs', async () => {
      const code = `export function ShapeDefs() { return <svg style={{ display: "none" }}><defs><clipPath id="shape" /></defs></svg>; }`;
      const [result] = await eslint.lintText(code, {
        filePath: 'app/components/atoms/Avatar/ShapeDefs.tsx',
      });
      const violations = result?.messages.filter((m) => m.ruleId === 'm3-theme/no-raw-svg-icons');
      expect(violations).toHaveLength(0);
    });
  });

  describe('m3-theme/enforce-rounded-icons', () => {
    it('reports sharp non-rounded icon imports from @mui/icons-material', async () => {
      const code = `import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";`;
      const [result] = await eslint.lintText(code, {
        filePath: 'app/components/molecules/Test/Test.tsx',
      });
      const violations = result?.messages.filter(
        (m) => m.ruleId === 'm3-theme/enforce-rounded-icons',
      );
      expect(violations).toHaveLength(2);
      expect(violations[0]?.message).toContain('SearchRounded');
      expect(violations[1]?.message).toContain('CloseRounded');
    });

    it('reports filled icons where outline-rounded variant exists', async () => {
      const code = `import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";`;
      const [result] = await eslint.lintText(code, {
        filePath: 'app/components/molecules/Test/Test.tsx',
      });
      const violations = result?.messages.filter(
        (m) => m.ruleId === 'm3-theme/enforce-rounded-icons',
      );
      expect(violations.length).toBeGreaterThan(0);
      expect(violations[0]?.message).toContain('CheckCircleOutlineRounded');
    });

    it('permits rounded unfilled icons and brand icon exceptions', async () => {
      const code = `import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import GitHubIcon from "@mui/icons-material/GitHub";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";`;
      const [result] = await eslint.lintText(code, {
        filePath: 'app/components/molecules/Test/Test.tsx',
      });
      const violations = result?.messages.filter(
        (m) => m.ruleId === 'm3-theme/enforce-rounded-icons',
      );
      expect(violations).toHaveLength(0);
    });
  });

  describe('m3-theme/enforce-motion-tokens', () => {
    it('reports hardcoded spring physics { stiffness, damping }', async () => {
      const code = `export const spring = { type: "spring", stiffness: 300, damping: 20 };`;
      const [result] = await eslint.lintText(code, {
        filePath: 'app/components/molecules/Test/Test.tsx',
      });
      const violations = result?.messages.filter(
        (m) => m.ruleId === 'm3-theme/enforce-motion-tokens',
      );
      expect(violations.length).toBeGreaterThan(0);
      expect(violations[0]?.message).toContain('Hardcoded spring physics');
    });

    it('reports hardcoded bezier curve array in ease', async () => {
      const code = `import { motion } from "framer-motion";
export function Card() { return <motion.div transition={{ ease: [0.2, 0, 0, 1] }} />; }`;
      const [result] = await eslint.lintText(code, {
        filePath: 'app/components/molecules/Test/Test.tsx',
      });
      const violations = result?.messages.filter(
        (m) => m.ruleId === 'm3-theme/enforce-motion-tokens',
      );
      expect(violations.length).toBeGreaterThan(0);
      expect(violations[0]?.message).toContain('Hardcoded bezier curve array');
    });

    it('reports hardcoded numeric duration in transition', async () => {
      const code = `import { motion } from "framer-motion";
export function Card() { return <motion.div transition={{ duration: 0.25 }} />; }`;
      const [result] = await eslint.lintText(code, {
        filePath: 'app/components/molecules/Test/Test.tsx',
      });
      const violations = result?.messages.filter(
        (m) => m.ruleId === 'm3-theme/enforce-motion-tokens',
      );
      expect(violations.length).toBeGreaterThan(0);
      expect(violations[0]?.message).toContain('Hardcoded animation duration');
    });

    it('reports hardcoded cubic-bezier string in easing property', async () => {
      const code = `export const config = { easing: "cubic-bezier(0.2, 0, 0, 1)" };`;
      const [result] = await eslint.lintText(code, {
        filePath: 'app/components/molecules/Test/Test.styles.ts',
      });
      const violations = result?.messages.filter(
        (m) => m.ruleId === 'm3-theme/enforce-motion-tokens',
      );
      expect(violations.length).toBeGreaterThan(0);
      expect(violations[0]?.message).toContain('Hardcoded cubic-bezier string');
    });

    it('permits tokenized M3_SPRINGS, M3_MOTION_DURATIONS, and ambient loops', async () => {
      const code = `import { motion } from "framer-motion";
import { M3_SPRINGS, M3_MOTION_DURATIONS } from "~/tokens/motion";
export function Card() {
  return (
    <>
      <motion.div transition={M3_SPRINGS.press} />
      <motion.div transition={{ duration: M3_MOTION_DURATIONS.s.medium1 }} />
      <motion.div transition={{ repeat: Infinity, duration: 10, ease: "linear" }} />
    </>
  );
}`;
      const [result] = await eslint.lintText(code, {
        filePath: 'app/components/molecules/Test/Test.tsx',
      });
      const violations = result?.messages.filter(
        (m) => m.ruleId === 'm3-theme/enforce-motion-tokens',
      );
      expect(violations).toHaveLength(0);
    });

    it('permits custom motion configs when added to the allowed whitelist option', async () => {
      const code = `import { motion } from "framer-motion";
export function Card() { return <motion.div transition={{ duration: 0.42 }} />; }`;
      const [result] = await motionAllowedEslint.lintText(code, {
        filePath: 'app/components/molecules/Test/Test.tsx',
      });
      const violations = result?.messages.filter(
        (m) => m.ruleId === 'm3-theme/enforce-motion-tokens',
      );
      expect(violations).toHaveLength(0);
    });
  });

  describe('m3-theme/enforce-shape-tokens', () => {
    it('reports non-standard numeric and string borderRadius literals', async () => {
      const code = `import Box from "@mui/material/Box";
export function Card() { return <Box sx={{ borderRadius: 10 }}><div style={{ borderRadius: "14px" }} /></Box>; }`;
      const [result] = await eslint.lintText(code, {
        filePath: 'app/components/molecules/TestCard/TestCard.tsx',
      });
      const violations = result?.messages.filter(
        (m) => m.ruleId === 'm3-theme/enforce-shape-tokens',
      );
      expect(violations.length).toBeGreaterThanOrEqual(2);
      expect(violations[0]?.message).toContain('Non-standard corner radius');
    });

    it('reports direct import from material-shapes-ts in UI components', async () => {
      const code = `import { MaterialShapes } from "material-shapes-ts";
export const shape = MaterialShapes;`;
      const [result] = await eslint.lintText(code, {
        filePath: 'app/components/molecules/TestCard/TestCard.tsx',
      });
      const violations = result?.messages.filter(
        (m) => m.ruleId === 'm3-theme/enforce-shape-tokens',
      );
      expect(violations.length).toBeGreaterThan(0);
      expect(violations[0]?.message).toContain(
        "Direct import from 'material-shapes-ts' is forbidden",
      );
    });

    it('permits approved M3 scale tokens, numbers, strings, and multi-corner values', async () => {
      const code = `import Box from "@mui/material/Box";
import { M3_SHAPE_CORNERS } from "~/tokens/shapes";
export function Card() {
  return (
    <Box sx={{ borderRadius: "12px", p: 1 }}>
      <div style={{ borderRadius: M3_SHAPE_CORNERS.largeIncreased }} />
      <div style={{ borderRadius: "16px 16px 0 0" }} />
      <div style={{ borderRadius: 9999 }} />
      <div style={{ borderRadius: "50%" }} />
      <div style={{ borderRadius: "var(--md-sys-shape-corner-medium)" }} />
    </Box>
  );
}`;
      const [result] = await eslint.lintText(code, {
        filePath: 'app/components/molecules/TestCard/TestCard.tsx',
      });
      const violations = result?.messages.filter(
        (m) => m.ruleId === 'm3-theme/enforce-shape-tokens',
      );
      expect(violations).toHaveLength(0);
    });

    it('permits whitelisted corner values via allowed option', async () => {
      const code = `import Box from "@mui/material/Box";
export function Card() { return <Box sx={{ borderRadius: "15px" }}><div style={{ borderRadius: 77 }} /></Box>; }`;
      const [result] = await shapeAllowedEslint.lintText(code, {
        filePath: 'app/components/molecules/TestCard/TestCard.tsx',
      });
      const violations = result?.messages.filter(
        (m) => m.ruleId === 'm3-theme/enforce-shape-tokens',
      );
      expect(violations).toHaveLength(0);
    });
  });
});
