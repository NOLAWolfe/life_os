import { test, expect } from '@playwright/test';
import { SUPER_ADMIN_USER } from './mocks/user.mock';
import { MOCK_ORPHAN_TRANSACTIONS } from './mocks/transactions.mock';

/**
 * The Sorting Hat Domain Test
 * Verifies transaction classification logic and UI flow.
 */
test.describe('The Sorting Hat - Transaction Mapping', () => {
    test.beforeEach(async ({ page }) => {
        // Mock the user API call
        await page.route('/api/system/user/admin-user-123', route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ status: 'success', data: SUPER_ADMIN_USER }),
            });
        });

        // Mock the transactions API call
        await page.route('/api/finance/txns', route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(MOCK_ORPHAN_TRANSACTIONS),
            });
        });

        // 1. Navigate to the Financial Dashboard
        await page.goto('/app/finance');
        await expect(page.locator('h1')).toContainText(/FINANCE WAR ROOM/i, { timeout: 10000 });

        // 2. Switch to the Data tab
        await page.getByRole('button', { name: /Data Management/i }).click();

        // 3. Select the Sorting Hat sub-tab
        await page.getByRole('button', { name: /Sorting Hat/i }).click();
        await expect(page.locator('h2', { hasText: 'Sorting Hat' })).toBeVisible();
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
