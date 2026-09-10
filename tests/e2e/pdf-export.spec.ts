import { expect, test } from '@playwright/test';

test.describe('A4 Document & MUI FAB PDF Pipeline', () => {
  test('renders A4 sheets with MUI Floating Action Button', async ({
    page,
  }) => {
    await page.goto('/documents/sample-report');

    // Verify document title
    await expect(page).toHaveTitle(/AptiTek — Proposition Technique/);

    // Verify A4 page sheets exist
    const sheets = page.locator('.a4-page-sheet');
    await expect(sheets).toHaveCount(2);

    // Verify MUI Floating Action Button is visible on screen
    const fab = page.getByTestId('pdf-download-fab');
    await expect(fab).toBeVisible();

    // Verify FAB has appropriate accessibility label
    await expect(fab).toHaveAttribute('aria-label', /Télécharger/);

    // Emulate print media
    await page.emulateMedia({ media: 'print' });

    // In print media, the FAB should NOT be visible
    await expect(fab).toBeHidden();
  });
});
