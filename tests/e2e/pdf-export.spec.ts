import { expect, test } from '@playwright/test';

test.describe('A4 Document & MUI FAB PDF Pipeline', () => {
  test('renders A4 sheets with MUI Floating Action Button', async ({
    page,
  }) => {
    await page.goto('/documents/sample-report');

    // Verify document title
    await expect(page).toHaveTitle(/AptiTek — Proposition Technique/);

    // Verify web theme is dark, while pdfTheme is light
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('html')).toHaveAttribute(
      'data-pdf-theme',
      'light',
    );

    // Verify A4 page sheets exist
    const sheets = page.locator('.a4-page-sheet');
    await expect(sheets).toHaveCount(2);

    // Verify MUI Floating Action Button is visible on screen
    const fab = page.getByTestId('pdf-download-fab');
    await expect(fab).toBeVisible();

    // Verify FAB has appropriate accessibility label
    await expect(fab).toHaveAttribute('aria-label', /Télécharger/);

    // Emulate print media (used during PDF export)
    await page.emulateMedia({ media: 'print' });

    // In print media, the FAB should NOT be visible
    await expect(fab).toBeHidden();

    // In print media, verify light theme color-scheme and Solarized blue title
    const colorScheme = await page.locator('html').evaluate((el) => {
      return window.getComputedStyle(el).colorScheme;
    });
    expect(colorScheme).toBe('light');

    const h1Color = await page
      .locator('.a4-page-sheet h1')
      .first()
      .evaluate((el) => {
        return window.getComputedStyle(el).color;
      });
    expect(h1Color).toContain('139');
    expect(h1Color).toContain('210');

    // Verify design system typography tokens are enforced on document elements
    const bodyFont = await page
      .locator('.a4-page-sheet')
      .first()
      .evaluate((el) => {
        return window.getComputedStyle(el).fontFamily;
      });
    expect(bodyFont.toLowerCase()).toContain('inter');

    const headingFont = await page
      .locator('.a4-page-sheet h1')
      .first()
      .evaluate((el) => {
        return window.getComputedStyle(el).fontFamily;
      });
    expect(headingFont.toLowerCase()).toMatch(/recursive|inter/);

    const codeFont = await page
      .locator('.a4-page-sheet code')
      .first()
      .evaluate((el) => {
        return window.getComputedStyle(el).fontFamily;
      });
    expect(codeFont.toLowerCase()).toMatch(/jetbrains mono|monospace/);
  });
});
