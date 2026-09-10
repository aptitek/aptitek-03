/**
 * Strict Semantic Fenced Divs & Zero-HTML Enforcement Plugin
 *
 * Enforces strict separation of semantics from style:
 * 1. Prohibits raw HTML and JSX tags in Markdown/MDX content files.
 * 2. Enforces Pandoc-style fenced containers (`:::callout`, `::::page`).
 * 3. Enforces an approved semantic whitelist (callout, note, warning, subtitle, footer, page).
 * 4. Automatically injects WCAG 2.2 AA accessibility roles and Material Design 3 / clean CSS classes.
 */

import { visit } from 'unist-util-visit';

const APPROVED_SEMANTIC_CONTAINERS = new Map([
  [
    'callout',
    {
      tag: 'aside',
      className: ['doc-callout'],
      role: 'note',
    },
  ],
  [
    'note',
    {
      tag: 'aside',
      className: ['doc-callout', 'doc-callout--note'],
      role: 'note',
    },
  ],
  [
    'warning',
    {
      tag: 'aside',
      className: ['doc-callout', 'doc-callout--warning'],
      role: 'alert',
    },
  ],
  [
    'subtitle',
    {
      tag: 'p',
      className: ['doc-subtitle', 'subtitle'],
      role: null,
    },
  ],
  [
    'footer',
    {
      tag: 'footer',
      className: ['doc-footer-container'],
      role: 'contentinfo',
    },
  ],
  [
    'page',
    {
      tag: 'article',
      className: ['a4-page-sheet'],
      role: 'region',
    },
  ],
  [
    'hero',
    {
      tag: 'header',
      className: ['hero'],
      role: null,
    },
  ],
  [
    'badge',
    {
      tag: 'div',
      className: ['hero-badge'],
      role: 'status',
    },
  ],
  [
    'features',
    {
      tag: 'section',
      className: ['features'],
      role: 'region',
    },
  ],
  [
    'card',
    {
      tag: 'article',
      className: ['feature-card'],
      role: null,
    },
  ],
]);

const APPROVED_COMPONENT_DIRECTIVES = new Set(['heroactions', 'hero-actions']);

const HTML_TAG_REGEX = /<\/?([a-zA-Z][a-zA-Z0-9-]*)/;

export function remarkFencedDivsPlugin() {
  return (tree, file) => {
    let autoPageNumber = 0;
    let hasInjectedHeroActions = false;
    const filePath = file.path || file.history?.[0] || 'document';
    const frontmatter = file.data?.astro?.frontmatter || file.data?.frontmatter || {};
    const defaultHeaderTitle = frontmatter.headerTitle || 'AptiTek Architecture & Conseil';
    const defaultFooterText = frontmatter.footerText || 'AptiTek © 2026 — Confidentiel';
    const totalPages = frontmatter.totalPages;

    visit(tree, (node) => {
      // 1. Enforce Zero Raw HTML Tags in Markdown
      if (node.type === 'html') {
        const rawValue = (node.value || '').trim();
        // Allow HTML comments (e.g. <!-- slide --> or <!-- comment -->)
        if (rawValue.startsWith('<!--') && rawValue.endsWith('-->')) {
          return;
        }

        const match = HTML_TAG_REGEX.exec(rawValue);
        if (match) {
          const tagName = match[1];
          throw new Error(
            `[Markdown Semantic Violation in ${filePath}]: Raw HTML tag '<${tagName}>' is prohibited. ` +
              `Content files must be purely semantic. Use standard Markdown syntax (#, ##, **, \`, -, 1.) or Pandoc fenced divs (::::page, :::callout).`,
          );
        }
      }

      // 2. Enforce Zero Raw JSX Elements in MDX (Must use directives instead)
      if (
        (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') &&
        !node.data?.isGeneratedDirective
      ) {
        const tagName = node.name || 'Component';
        throw new Error(
          `[Markdown Semantic Violation in ${filePath}]: JSX element '<${tagName}>' is prohibited. ` +
            `Content files must be purely semantic. Use standard Markdown syntax or Pandoc fenced divs (::::page, :::callout, ::HeroActions).`,
        );
      }

      // 3. Process Component Directives (Leaf or Container)
      if (node.type === 'leafDirective' || node.type === 'containerDirective') {
        const directiveName = (node.name || '').toLowerCase();

        if (APPROVED_COMPONENT_DIRECTIVES.has(directiveName)) {
          const attrs = node.attributes || {};
          const docsLabel = attrs.docsLabel || 'Documentation Astro';
          const sampleDocLabel = attrs.sampleDocLabel || 'Exemple de Document A4';

          node.type = 'mdxJsxFlowElement';
          node.name = 'HeroActions';
          node.attributes = [
            { type: 'mdxJsxAttribute', name: 'client:load', value: null },
            { type: 'mdxJsxAttribute', name: 'docsLabel', value: docsLabel },
            {
              type: 'mdxJsxAttribute',
              name: 'sampleDocLabel',
              value: sampleDocLabel,
            },
          ];
          node.children = [];
          node.data = {
            isGeneratedDirective: true,
            hName: 'div',
            hProperties: {
              className: ['hero-actions-container'],
              'data-component': 'HeroActions',
              'data-docs-label': docsLabel,
              'data-sample-label': sampleDocLabel,
            },
          };

          if (!hasInjectedHeroActions) {
            hasInjectedHeroActions = true;
            const hasImport = tree.children.some(
              (child) =>
                child.type === 'mdxjsEsm' &&
                typeof child.value === 'string' &&
                child.value.includes('HeroActions'),
            );
            if (!hasImport) {
              tree.children.unshift({
                type: 'mdxjsEsm',
                value: "import { HeroActions } from '/src/components/HeroActions.tsx';",
                data: {
                  estree: {
                    type: 'Program',
                    sourceType: 'module',
                    body: [
                      {
                        type: 'ImportDeclaration',
                        specifiers: [
                          {
                            type: 'ImportSpecifier',
                            imported: {
                              type: 'Identifier',
                              name: 'HeroActions',
                            },
                            local: {
                              type: 'Identifier',
                              name: 'HeroActions',
                            },
                          },
                        ],
                        source: {
                          type: 'Literal',
                          value: '/src/components/HeroActions.tsx',
                          raw: "'/src/components/HeroActions.tsx'",
                        },
                      },
                    ],
                  },
                },
              });
            }
          }
          return;
        }
      }

      // 4. Process Container Directives (Pandoc Fenced Divs)
      if (node.type === 'containerDirective') {
        const directiveName = node.name.toLowerCase();
        const config = APPROVED_SEMANTIC_CONTAINERS.get(directiveName);

        if (!config) {
          const allowedList = [
            ...APPROVED_SEMANTIC_CONTAINERS.keys(),
            ...APPROVED_COMPONENT_DIRECTIVES.keys(),
          ].join(', ');
          throw new Error(
            `[Markdown Semantic Violation in ${filePath}]: ` +
              `Unknown or unapproved fenced div ':::${node.name}'. ` +
              `Only semantic containers are allowed: [${allowedList}]. ` +
              `Styles, ad-hoc classes, and unapproved directives are strictly prohibited.`,
          );
        }

        node.data = node.data || {};
        node.data.hName = config.tag;
        node.data.hProperties = node.data.hProperties || {};
        node.data.hProperties.className = [...config.className];
        if (config.role) {
          node.data.hProperties.role = config.role;
        }

        // Unwrap inner paragraphs for phrasing containers (subtitle and badge)
        if (directiveName === 'subtitle' || directiveName === 'badge') {
          const phrasingChildren = [];
          for (const child of node.children) {
            if (child.type === 'paragraph') {
              phrasingChildren.push(...child.children);
            } else {
              phrasingChildren.push(child);
            }
          }
          node.children = phrasingChildren;
        }

        // Special handling for `:::card{title="..."}` feature cards
        if (directiveName === 'card') {
          const attrs = node.attributes || {};
          const cardTitle = attrs.title || '';
          const cardChildren = [];

          if (cardTitle) {
            cardChildren.push({
              type: 'heading',
              depth: 2,
              data: {
                hName: 'h2',
                hProperties: { className: ['feature-card__title'] },
              },
              children: [{ type: 'text', value: cardTitle }],
            });
          }

          for (const child of node.children) {
            if (child.type === 'paragraph') {
              child.data = child.data || {};
              child.data.hProperties = child.data.hProperties || {};
              child.data.hProperties.className = ['feature-card__description'];
            }
            cardChildren.push(child);
          }

          const contentWrapper = {
            type: 'paragraph',
            data: {
              hName: 'div',
              hProperties: { className: ['feature-card__content'] },
            },
            children: cardChildren,
          };

          node.children = [contentWrapper];
          return;
        }

        // Special handling for `::::page` A4 printable document sheets
        if (directiveName === 'page') {
          autoPageNumber += 1;
          const attrs = node.attributes || {};
          const pageNum = attrs.number ? Number(attrs.number) : autoPageNumber;
          const total = attrs.total ? Number(attrs.total) : totalPages;
          const headerTitle = attrs.title || defaultHeaderTitle;
          const headerSubtitle = attrs.subtitle || '';
          const footerText = attrs.footer || defaultFooterText;

          // Running Header element
          const headerChildren = [];
          const headerLeftChildren = [];
          if (headerTitle) {
            headerLeftChildren.push({
              type: 'paragraph',
              data: {
                hName: 'span',
                hProperties: { className: ['a4-header-title'] },
              },
              children: [{ type: 'text', value: headerTitle }],
            });
          }
          if (headerSubtitle) {
            headerLeftChildren.push({
              type: 'paragraph',
              data: {
                hName: 'span',
                hProperties: { className: ['a4-header-subtitle'] },
              },
              children: [{ type: 'text', value: headerSubtitle }],
            });
          }

          if (headerLeftChildren.length > 0) {
            headerChildren.push({
              type: 'paragraph',
              data: {
                hName: 'div',
                hProperties: { className: ['a4-header-left'] },
              },
              children: headerLeftChildren,
            });
          }

          if (pageNum !== undefined) {
            headerChildren.push({
              type: 'paragraph',
              data: {
                hName: 'div',
                hProperties: { className: ['a4-header-right'] },
              },
              children: [
                {
                  type: 'paragraph',
                  data: {
                    hName: 'span',
                    hProperties: { className: ['a4-header-page'] },
                  },
                  children: [
                    {
                      type: 'text',
                      value: `Page ${pageNum}${total ? ` / ${total}` : ''}`,
                    },
                  ],
                },
              ],
            });
          }

          const runningHeader = {
            type: 'paragraph',
            data: {
              hName: 'header',
              hProperties: { className: ['a4-page-header'] },
            },
            children: headerChildren,
          };

          // Running Footer element
          const runningFooter = {
            type: 'paragraph',
            data: {
              hName: 'footer',
              hProperties: { className: ['a4-page-footer'] },
            },
            children: [
              {
                type: 'paragraph',
                data: {
                  hName: 'div',
                  hProperties: { className: ['a4-footer-left'] },
                },
                children: [
                  {
                    type: 'paragraph',
                    data: {
                      hName: 'span',
                      hProperties: { className: ['a4-footer-text'] },
                    },
                    children: [{ type: 'text', value: footerText }],
                  },
                ],
              },
              {
                type: 'paragraph',
                data: {
                  hName: 'div',
                  hProperties: { className: ['a4-footer-right'] },
                },
                children: [
                  {
                    type: 'paragraph',
                    data: {
                      hName: 'span',
                      hProperties: { className: ['a4-footer-page'] },
                    },
                    children: [
                      {
                        type: 'text',
                        value: `${pageNum}${total ? ` / ${total}` : ''}`,
                      },
                    ],
                  },
                ],
              },
            ],
          };

          // Body content wrapper
          const bodyContainer = {
            type: 'paragraph',
            data: {
              hName: 'div',
              hProperties: { className: ['a4-page-body'] },
            },
            children: node.children,
          };

          node.children = [runningHeader, bodyContainer, runningFooter];
        }
      }
    });
  };
}

export default remarkFencedDivsPlugin;
