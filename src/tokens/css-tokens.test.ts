import { describe, it, expect } from 'vitest';
import { ESLint } from 'eslint';

describe('CSS Design Tokens Linting', () => {
  const eslint = new ESLint();

  it('reports hardcoded hex and rgba colors in non-token CSS files', async () => {
    const invalidCss = `
      .invalid-component {
        color: #ff0000;
        background-color: rgba(0, 0, 0, 0.5);
        border: 1px solid #123456;
      }
    `;

    const results = await eslint.lintText(invalidCss, {
      filePath: 'app/components/atoms/Button/Button.css',
    });

    expect(results.length).toBeGreaterThan(0);
    const messages = results[0].messages;
    expect(messages.length).toBeGreaterThanOrEqual(3);

    const hexErrors = messages.filter(
      (msg) =>
        msg.ruleId === 'css-tokens/no-raw-colors' &&
        msg.message.includes('Hardcoded hex color'),
    );
    const rgbaErrors = messages.filter(
      (msg) =>
        msg.ruleId === 'css-tokens/no-raw-colors' &&
        msg.message.includes("Hardcoded 'rgba()' color"),
    );

    expect(hexErrors.length).toBeGreaterThanOrEqual(2);
    expect(rgbaErrors.length).toBeGreaterThanOrEqual(1);
  });

  it('permits CSS custom properties (var(--color-*)) in non-token CSS files', async () => {
    const validCss = `
      .valid-component {
        color: var(--color-solarized-blue);
        background-color: var(--color-solarized-base03);
        border: 1px solid var(--color-solarized-base01);
      }
    `;

    const results = await eslint.lintText(validCss, {
      filePath: 'app/components/atoms/Button/Button.css',
    });

    const tokenRuleErrors = results[0]?.messages.filter(
      (msg) => msg.ruleId === 'css-tokens/no-raw-colors',
    );
    expect(tokenRuleErrors).toHaveLength(0);
  });

  it('permits raw hex and rgba in base token CSS files (src/tokens/**)', async () => {
    const tokensCss = `
      :root {
        --color-solarized-base03: #002b36;
        --color-solarized-bg-alpha: rgba(0, 43, 54, 0.5);
      }
    `;

    const results = await eslint.lintText(tokensCss, {
      filePath: 'src/tokens/tokens.css',
    });

    const tokenRuleErrors = results[0]?.messages.filter(
      (msg) => msg.ruleId === 'css-tokens/no-raw-colors',
    );
    expect(tokenRuleErrors).toHaveLength(0);
  });

  it('defines required Material 3 debug theme tokens in solarized.css', async () => {
    const fs = await import('fs/promises');
    const path = await import('path');
    const content = await fs.readFile(
      path.resolve(process.cwd(), 'src/tokens/solarized/solarized.css'),
      'utf-8',
    );

    expect(content).toMatch(/\[data-theme=['"]debug['"]\]/);
    expect(content).toContain('.debug');
    expect(content).toContain('--md-sys-color-primary: #00ff66');
    expect(content).toContain('--md-sys-color-on-primary: #000000');
    expect(content).toContain('--md-sys-color-secondary: #ff007f');
    expect(content).toContain('--md-sys-elevation-level1: 0 0 0 2px #00ff66');
  });

  it('imports solarized.css in tokens.css', async () => {
    const fs = await import('fs/promises');
    const path = await import('path');
    const content = await fs.readFile(
      path.resolve(process.cwd(), 'src/tokens/tokens.css'),
      'utf-8',
    );

    expect(content).toContain("@import './solarized/solarized.css';");
  });

  it('reports raw font-family definitions in non-token CSS files', async () => {
    const invalidCss = `
      .invalid-component {
        font-family: Arial, sans-serif;
      }
    `;

    const results = await eslint.lintText(invalidCss, {
      filePath: 'app/components/atoms/Button/Button.css',
    });

    const fontErrors = results[0]?.messages.filter(
      (msg) => msg.ruleId === 'css-tokens/no-raw-font-family',
    );
    expect(fontErrors.length).toBeGreaterThan(0);
  });

  it('permits tokenized var(--font-family-*) in non-token CSS files', async () => {
    const validCss = `
      .valid-component {
        font-family: var(--font-family-plain);
      }
    `;

    const results = await eslint.lintText(validCss, {
      filePath: 'app/components/atoms/Button/Button.css',
    });

    const fontErrors = results[0]?.messages.filter(
      (msg) => msg.ruleId === 'css-tokens/no-raw-font-family',
    );
    expect(fontErrors).toHaveLength(0);
  });
});
