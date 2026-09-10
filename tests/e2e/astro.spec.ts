import { expect, test } from '@playwright/test';

test.describe('Astro Template Application', () => {
  test('loads home page with expected title and hero content', async ({
    page,
  }) => {
    await page.goto('/');

    // Verify document title
    await expect(page).toHaveTitle(/AptiTek/);

    // Verify main hero title
    const heading = page.getByRole('heading', {
      name: 'AptiTek Modern Web Stack',
      level: 1,
    });
    await expect(heading).toBeVisible();

    // Verify document sample link
    const sampleLink = page.getByRole('link', {
      name: 'Exemple de Document A4',
    });
    await expect(sampleLink).toBeVisible();

    // Verify external documentation link
    const docsLink = page.getByRole('link', { name: 'Documentation Astro' });
    await expect(docsLink).toBeVisible();
  });
});
