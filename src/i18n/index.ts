/**
 * Application Internationalization (i18n) Module
 *
 * Centralizes all user-facing strings, defaults, and translations.
 * Prevents hardcoding of natural language copy in layouts and components.
 */

export const DEFAULT_LOCALE = 'fr';

export const translations = {
  fr: {
    common: {
      siteTitle: 'AptiTek — Modern Web Application Template',
      siteDescription:
        'Architecture modulaire haute performance combinant Astro, React, Storybook, Vitest, Playwright et Wireit.',
    },
    layout: {
      defaultTitle: 'AptiTek — Modern Starter Template',
      defaultDescription:
        'High performance web application template powered by Astro, React, and Storybook.',
    },
    documents: {
      a4DefaultTitle: 'Document A4 — AptiTek',
      a4DefaultDescription:
        'Document paginé au format A4 généré avec Astro, MDX et Playwright',
      pdfDownloadLabel: 'Télécharger le document en PDF',
    },
  },
  en: {
    common: {
      siteTitle: 'AptiTek — Modern Web Application Template',
      siteDescription:
        'High performance modular architecture combining Astro, React, Storybook, Vitest, Playwright, and Wireit.',
    },
    layout: {
      defaultTitle: 'AptiTek — Modern Starter Template',
      defaultDescription:
        'High performance web application template powered by Astro, React, and Storybook.',
    },
    documents: {
      a4DefaultTitle: 'A4 Document — AptiTek',
      a4DefaultDescription:
        'A4 paginated document generated with Astro, MDX, and Playwright',
      pdfDownloadLabel: 'Download document as PDF',
    },
  },
} as const;

export type SupportedLocale = keyof typeof translations;

/**
 * Retrieves localized string dictionary for a given locale.
 */
export function useTranslations(locale: SupportedLocale = DEFAULT_LOCALE) {
  return translations[locale] || translations[DEFAULT_LOCALE];
}
