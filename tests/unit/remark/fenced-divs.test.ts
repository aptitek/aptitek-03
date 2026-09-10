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
    expect(result.code).toContain(
      '<p class="doc-subtitle subtitle">Sous-titre descriptif</p>',
    );
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

  it('transforms :::hero, :::badge, :::features, and :::card directives', async () => {
    const processor = await getProcessor();
    const doc = `
::::hero
:::badge
Status Badge
:::

# Main Title

:::subtitle
Hero Subtitle
:::
::::

::::features
:::card{title="Feature Title"}
Feature card description text.
:::
::::
`;

    const result = await processor.render(doc);
    expect(result.code).toContain('<header class="hero">');
    expect(result.code).toContain(
      '<div class="hero-badge" role="status">Status Badge</div>',
    );
    expect(result.code).toContain('<p class="doc-subtitle subtitle">');
    expect(result.code).toContain('<section class="features" role="region">');
    expect(result.code).toContain('<article class="feature-card">');
    expect(result.code).toContain('<div class="feature-card__content">');
    expect(result.code).toContain(
      '<h2 class="feature-card__title" id="feature-title">Feature Title</h2>',
    );
    expect(result.code).toContain(
      '<p class="feature-card__description">Feature card description text.</p>',
    );
  });

  it('transforms leaf and container ::HeroActions directives', async () => {
    const processor = await getProcessor();
    const doc = `
::HeroActions{docsLabel="Custom Docs" sampleDocLabel="Custom Sample"}
`;

    const result = await processor.render(doc);
    expect(result.code).toContain('<div class="hero-actions-container"');
    expect(result.code).toContain('data-component="HeroActions"');
    expect(result.code).toContain('data-docs-label="Custom Docs"');
    expect(result.code).toContain('data-sample-label="Custom Sample"');
  });
});
