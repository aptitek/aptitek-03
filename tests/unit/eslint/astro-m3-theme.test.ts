import { describe, it, expect } from 'vitest';
import { ESLint } from 'eslint';

describe('Material Design 3 Linting in Astro (.astro) Files', () => {
  const eslint = new ESLint();

  it('permits clean Astro components using design tokens and rounded icons', async () => {
    const validAstro = `---
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
const activeColor = 'var(--md-sys-color-primary)';
---

<section class="container">
  <PictureAsPdfRoundedIcon />
  <p>{activeColor}</p>
</section>
`;

    const results = await eslint.lintText(validAstro, {
      filePath: 'src/components/ValidComponent.astro',
    });

    const m3Errors = results[0]?.messages.filter(
      (m) =>
        m.ruleId?.startsWith('m3-theme/') ||
        m.ruleId === 'no-restricted-imports' ||
        m.ruleId === 'no-restricted-syntax',
    );

    expect(m3Errors).toHaveLength(0);
  });

  it('reports raw <svg> icons in Astro templates', async () => {
    const invalidAstro = `---
---
<div class="card">
  <svg width="24" height="24" viewBox="0 0 24 24">
    <path d="M0 0h24v24H0z" />
  </svg>
</div>
`;

    const results = await eslint.lintText(invalidAstro, {
      filePath: 'src/components/InvalidSvg.astro',
    });

    const svgErrors = results[0]?.messages.filter(
      (m) => m.ruleId === 'm3-theme/no-raw-svg-icons',
    );
    expect(svgErrors.length).toBeGreaterThan(0);
  });

  it('reports non-rounded icon imports in Astro frontmatter', async () => {
    const invalidAstro = `---
import DeleteIcon from '@mui/icons-material/Delete';
---
<div>
  <DeleteIcon />
</div>
`;

    const results = await eslint.lintText(invalidAstro, {
      filePath: 'src/components/InvalidIcon.astro',
    });

    const iconErrors = results[0]?.messages.filter(
      (m) => m.ruleId === 'm3-theme/enforce-rounded-icons',
    );
    expect(iconErrors.length).toBeGreaterThan(0);
  });

  it('reports unallowed raw hex colors in Astro frontmatter', async () => {
    const invalidAstro = `---
import Card from '@mui/material/Card';
const customColor = '#ff0088';
---
<Card className={customColor}></Card>
`;

    const results = await eslint.lintText(invalidAstro, {
      filePath: 'src/components/InvalidColor.astro',
    });

    const colorErrors = results[0]?.messages.filter(
      (m) => m.ruleId === 'm3-theme/allowed-theme-colors',
    );
    expect(colorErrors.length).toBeGreaterThan(0);
  });

  it('reports forbidden inline style attributes in Astro templates', async () => {
    const invalidAstro = `---
import Card from '@mui/material/Card';
---
<Card style="color: red;"></Card>
`;

    const results = await eslint.lintText(invalidAstro, {
      filePath: 'src/pages/InvalidInlineStyle.astro',
    });

    const styleErrors = results[0]?.messages.filter(
      (m) =>
        m.ruleId === 'no-restricted-syntax' &&
        m.message.includes(
          'Inline `style` attributes are prohibited altogether',
        ),
    );
    expect(styleErrors.length).toBeGreaterThan(0);
  });

  it('reports forbidden inline sx attributes in Astro templates', async () => {
    const invalidAstro = `---
import Card from '@mui/material/Card';
---
<Card sx={{ padding: 2 }}></Card>
`;

    const results = await eslint.lintText(invalidAstro, {
      filePath: 'src/pages/InvalidInlineSx.astro',
    });

    const sxErrors = results[0]?.messages.filter(
      (m) =>
        m.ruleId === 'no-restricted-syntax' &&
        m.message.includes('Inline `sx` is forbidden in Astro templates'),
    );
    expect(sxErrors.length).toBeGreaterThan(0);
  });

  it('reports forbidden native <a> tags in Astro templates', async () => {
    const invalidAstro = `---
---
<section class="actions">
  <a href="/documents/sample-report">Exemple de Document A4</a>
</section>
`;

    const results = await eslint.lintText(invalidAstro, {
      filePath: 'src/pages/InvalidLink.astro',
    });

    const elementErrors = results[0]?.messages.filter(
      (m) => m.ruleId === 'm3-theme/forbid-native-elements',
    );
    expect(elementErrors.length).toBe(1);
    expect(elementErrors[0].message).toContain('Native <a> is forbidden');
    expect(elementErrors[0].message).toContain('@mui/material');
  });

  it('reports forbidden native <div> and <span> tags in Astro templates', async () => {
    const invalidAstro = `---
---
<div class="feature-card">
  <span>Texte descriptif</span>
</div>
`;

    const results = await eslint.lintText(invalidAstro, {
      filePath: 'src/pages/InvalidDivSpan.astro',
    });

    const elementErrors = results[0]?.messages.filter(
      (m) => m.ruleId === 'm3-theme/forbid-native-elements',
    );
    expect(elementErrors.length).toBe(2);
    const messages = elementErrors.map((e) => e.message).join(' ');
    expect(messages).toContain('Native <div> is forbidden');
    expect(messages).toContain('Native <span> is forbidden');
  });

  it('reports forbidden native <button>, <input>, <select>, <textarea>, and <img> in Astro templates', async () => {
    const invalidAstro = `---
---
<form>
  <button type="submit">Envoyer</button>
  <input type="text" />
  <select><option>Option 1</option></select>
  <textarea></textarea>
  <img src="/sample.png" alt="Sample" />
</form>
`;

    const results = await eslint.lintText(invalidAstro, {
      filePath: 'src/components/InvalidForm.astro',
    });

    const elementErrors = results[0]?.messages.filter(
      (m) => m.ruleId === 'm3-theme/forbid-native-elements',
    );
    expect(elementErrors.length).toBe(5);
    const messages = elementErrors.map((e) => e.message).join(' ');
    expect(messages).toContain('Native <button>');
    expect(messages).toContain('Native <input>');
    expect(messages).toContain('Native <select>');
    expect(messages).toContain('Native <textarea>');
    expect(messages).toContain('Native <img>');
  });

  it('permits Capitalized MUI components such as <Button>, <Link>, <Card>, and <Chip>', async () => {
    const validAstro = `---
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
---
<section>
  <Card>
    <Button href="/test">Action</Button>
    <Link href="/docs">Docs</Link>
    <Chip label="Badge" />
  </Card>
</section>
`;

    const results = await eslint.lintText(validAstro, {
      filePath: 'src/pages/ValidMuiPage.astro',
    });

    const elementErrors = results[0]?.messages.filter(
      (m) => m.ruleId === 'm3-theme/forbid-native-elements',
    );
    expect(elementErrors).toHaveLength(0);
  });
});
