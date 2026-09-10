import { describe, it, expect } from 'vitest';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import remarkDirective from 'remark-directive';
import { remarkFencedDivsPlugin } from '../../../scripts/remark/fenced-divs.js';

describe('Pandoc-Style Fenced Divs & Zero-HTML Enforcement Plugin', () => {
  const getProcessor = () =>
    createMarkdownProcessor({
      remarkPlugins: [remarkDirective, remarkFencedDivsPlugin],
    });

  it('transforms semantic :::callout, :::subtitle, and :::footer into accessible HTML elements', async () => {
    const processor = await getProcessor();
    const doc = `
:::subtitle
Sous-titre descriptif
:::

:::callout
**Important :** Contenu de cadrage technique.
:::

:::footer
Document généré pour AptiTek — Confidentiel.
:::
`;

    const result = await processor.render(doc);
    expect(result.code).toContain('<p class="doc-subtitle">');
    expect(result.code).toContain('<aside class="doc-callout" role="note">');
    expect(result.code).toContain(
      '<footer class="doc-footer-container" role="contentinfo">',
    );
  });

  it('transforms ::::page into a structured ISO 216 A4 sheet with header and footer', async () => {
    const processor = await getProcessor();
    const doc = `
::::page
# Titre du Document

Contenu de la première page.
::::
`;

    const result = await processor.render(doc);
    expect(result.code).toContain(
      '<article class="a4-page-sheet" role="region">',
    );
    expect(result.code).toContain('<header class="a4-page-header">');
    expect(result.code).toContain('<span class="a4-header-page">Page 1</span>');
    expect(result.code).toContain('<div class="a4-page-body">');
    expect(result.code).toContain('<footer class="a4-page-footer">');
    expect(result.code).toContain('</article>');
  });

  it('rejects unapproved or arbitrary visual directives', async () => {
    const processor = await getProcessor();
    const invalidDoc = `
:::styled-box
Contenu avec style arbitraire
:::
`;

    await expect(processor.render(invalidDoc)).rejects.toThrow(
      /Unknown or unapproved fenced div ':::styled-box'/,
    );
  });

  it('strictly rejects raw HTML container tags in Markdown', async () => {
    const processor = await getProcessor();
    const invalidDoc = `
<aside class="doc-callout">
  Texte avec HTML brut
</aside>
`;

    await expect(processor.render(invalidDoc)).rejects.toThrow(
      /Raw HTML tag '<aside>' is prohibited/,
    );
  });

  it('strictly rejects raw <div> tags in Markdown', async () => {
    const processor = await getProcessor();
    const invalidDoc = `
<div class="custom-layout">
  Texte
</div>
`;

    await expect(processor.render(invalidDoc)).rejects.toThrow(
      /Raw HTML tag '<div>' is prohibited/,
    );
  });
});
