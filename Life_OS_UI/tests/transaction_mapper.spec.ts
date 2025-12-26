import { test, expect } from '@playwright/test';

/**
 * The Sorting Hat Domain Test
 * Verifies transaction classification logic and UI flow.
 */
test.describe('The Sorting Hat - Transaction Mapping', () => {
    test.beforeEach(async ({ page }) => {
        // 1. Navigate to the Financial Dashboard
        await page.goto('http://localhost:5173/app/finance');

        // 2. Switch to the Data tab
        await page.click('button:has-text("Data Management")');

        // 3. Select the Sorting Hat sub-tab
        await page.click('button:has-text("Sorting Hat")');
        await page.waitForLoadState('networkidle');
    });

    test('should display the Sorting Hat interface', async ({ page }) => {
        // Look for text broadly
        await expect(page.locator('h2', { hasText: 'Sorting Hat' })).toBeVisible();
        await expect(page.locator('.orphans-list')).toBeVisible();
    });

    test('should list unassigned transactions from the database', async ({ page }) => {
        // Wait for the list to populate (it fetches from /api/finance/txns)
        const orphanItems = page.locator('.orphan-item');
        await expect(orphanItems.first()).toBeVisible({ timeout: 10000 });

        const count = await orphanItems.count();
        console.log(`Found ${count} unassigned transactions in test.`);
        expect(count).toBeGreaterThan(0);
    });

    test('should allow selecting a transaction to map', async ({ page }) => {
        // Ensure the orphan list is visible and has items before proceeding
        const firstOrphan = page.locator('.orphan-item').first();
        await expect(firstOrphan).toBeVisible({ timeout: 15000 }); // Longer timeout for visibility

        // Get the text content, making sure the element is attached and visible
        const orphanNameElement = firstOrphan.locator('.font-medium');
        await expect(orphanNameElement).toBeVisible({ timeout: 15000 });
        const orphanName = await orphanNameElement.textContent();

        await firstOrphan.click();

        // Verify action panel updates
        await expect(page.locator('.mapping-action h3')).toContainText(orphanName || ''); // Use empty string if null
        await expect(page.locator('input[placeholder*="netflix"]')).toBeVisible();
    });
});
