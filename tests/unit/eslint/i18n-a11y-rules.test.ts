import { describe, it, expect } from 'vitest';
import { ESLint } from 'eslint';

describe('i18n and a11y Enforcement Rules', () => {
  const eslint = new ESLint();

  describe('i18n (Strict Localization Guardrails)', () => {
    it('disallows hardcoded default strings on localized component props (e.g. label = "...")', async () => {
      const invalidCode = `
        import React from 'react';
        export function MyAction({ label = 'Télécharger le document en PDF' }: { label?: string }) {
          return <button type="button">{label}</button>;
        }
      `;

      const results = await eslint.lintText(invalidCode, {
        filePath: 'src/components/MyAction.tsx',
      });

      const restrictedErrors = results[0]?.messages.filter(
        (m) =>
          m.ruleId === 'no-restricted-syntax' &&
          m.message.includes(
            'Hardcoded localized string detected in component default prop value',
          ),
      );

      expect(restrictedErrors?.length).toBeGreaterThan(0);
    });

    it('disallows literal strings in user-facing JSX attributes like aria-label, title, placeholder', async () => {
      const invalidCode = `
        import React from 'react';
        export function ActionButton({ onClick }: { onClick: () => void }) {
          return (
            <button
              type="button"
              aria-label="Télécharger le fichier"
              title="Exporter en PDF"
              onClick={onClick}
            >
              Icon
            </button>
          );
        }
      `;

      const results = await eslint.lintText(invalidCode, {
        filePath: 'src/components/ActionButton.tsx',
      });

      const i18nErrors = results[0]?.messages.filter(
        (m) => m.ruleId === 'i18next/no-literal-string',
      );

      expect(i18nErrors?.length).toBeGreaterThanOrEqual(2);
    });

    it('permits dynamic variables, props, and translation functions in JSX attributes', async () => {
      const validCode = `
        import React from 'react';
        export function ValidButton({
          label,
          ariaLabel,
        }: {
          label: string;
          ariaLabel: string;
        }) {
          return (
            <button type="button" aria-label={ariaLabel} title={label}>
              {label}
            </button>
          );
        }
      `;

      const results = await eslint.lintText(validCode, {
        filePath: 'src/components/ValidButton.tsx',
      });

      const i18nErrors = results[0]?.messages.filter(
        (m) => m.ruleId === 'i18next/no-literal-string',
      );

      expect(i18nErrors).toHaveLength(0);
    });

    it('disallows hardcoded fallback strings in Astro layout declarations', async () => {
      const invalidLayoutCode = `---
const description =
  Astro.props.description ||
  'Document paginé au format A4 généré avec Astro, MDX et Playwright';
---
<div>{description}</div>
`;

      const results = await eslint.lintText(invalidLayoutCode, {
        filePath: 'src/layouts/CustomA4Layout.astro',
      });

      const restrictedErrors = results[0]?.messages.filter(
        (m) =>
          m.ruleId === 'no-restricted-syntax' &&
          m.message.includes(
            'Hardcoded localized string detected in fallback value',
          ),
      );

      expect(restrictedErrors?.length).toBeGreaterThan(0);
    });

    it('permits translated dictionary fallbacks in Astro layout declarations', async () => {
      const validLayoutCode = `---
import { useTranslations } from '../i18n';
const t = useTranslations();
const description = Astro.props.description || t.documents.a4DefaultDescription;
---
<div>{description}</div>
`;

      const results = await eslint.lintText(validLayoutCode, {
        filePath: 'src/layouts/CustomA4Layout.astro',
      });

      const restrictedErrors = results[0]?.messages.filter(
        (m) =>
          m.ruleId === 'no-restricted-syntax' &&
          m.message.includes(
            'Hardcoded localized string detected in fallback value',
          ),
      );

      expect(restrictedErrors).toHaveLength(0);
    });
  });

  describe('a11y (WCAG 2.1 AA & WCAG 2.5.5 Touch Target)', () => {
    it('reports missing alt attribute on img elements via jsx-a11y/alt-text', async () => {
      const invalidCode = `
        import React from 'react';
        export function AvatarView() {
          return <img src="/profile.png" />;
        }
      `;

      const results = await eslint.lintText(invalidCode, {
        filePath: 'src/components/AvatarView.tsx',
      });

      const altErrors = results[0]?.messages.filter(
        (m) => m.ruleId === 'jsx-a11y/alt-text',
      );

      expect(altErrors?.length).toBeGreaterThan(0);
    });

    it('reports click handlers on non-interactive elements without key events', async () => {
      const invalidCode = `
        import React from 'react';
        export function ClickableDiv({ onClick }: { onClick: () => void }) {
          return <div onClick={onClick}>Clickable item</div>;
        }
      `;

      const results = await eslint.lintText(invalidCode, {
        filePath: 'src/components/ClickableDiv.tsx',
      });

      const keyErrors = results[0]?.messages.filter(
        (m) => m.ruleId === 'jsx-a11y/click-events-have-key-events',
      );

      expect(keyErrors?.length).toBeGreaterThan(0);
    });

    it('reports sub-48dp touch target on interactive elements via m3-theme/enforce-minimum-touch-target', async () => {
      const invalidCode = `
        import React from 'react';
        export function TinyButton({ onClick }: { onClick: () => void }) {
          return (
            <button
              type="button"
              onClick={onClick}
              style={{ width: 24, height: 24 }}
            >
              x
            </button>
          );
        }
      `;

      const results = await eslint.lintText(invalidCode, {
        filePath: 'src/components/TinyButton.tsx',
      });

      const touchTargetErrors = results[0]?.messages.filter(
        (m) => m.ruleId === 'm3-theme/enforce-minimum-touch-target',
      );

      expect(touchTargetErrors?.length).toBeGreaterThan(0);
    });
  });
});
