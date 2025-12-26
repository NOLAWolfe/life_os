import { test, expect } from '@playwright/test';
import { SUPER_ADMIN_USER } from './mocks/user.mock';

/**
 * Professional Hub Domain Test
 * Verifies Agile Board functionality and AI Co-Pilot readiness.
 */
test.describe('Professional Hub - Agile Workflow', () => {
    test.beforeEach(async ({ page }) => {
        // Mock the user API call before navigating
        await page.route('/api/system/user/admin-user-123', route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ status: 'success', data: SUPER_ADMIN_USER }),
            });
        });
        
        // 1. Visit the Professional Hub
        await page.goto('/app/professional-hub');
        await expect(page.locator('h1:has-text("Professional Hub")')).toBeVisible();
    });

    test('should display the Agile Board by default', async ({ page }) => {
        await expect(page.locator('.board-view')).toBeVisible();

        // Check for Kanban columns
        await expect(page.locator('h3:has-text("New")')).toBeVisible();
        await expect(page.locator('h3:has-text("Active")')).toBeVisible();
        await expect(page.locator('h3:has-text("Closed")')).toBeVisible();
    });

    test('should list seeded user stories in columns', async ({ page }) => {
        const activeColumn = page.locator('.board-column:has-text("Active")');
        const stories = activeColumn.locator('.work-item-card');

        // We seeded "Implement PII Obfuscation" as Active
        await expect(stories.first()).toBeVisible({ timeout: 10000 });
        await expect(activeColumn).toContainText('PII Obfuscation');
    });

    test('should open the "New Item" form', async ({ page }) => {
        await page.getByRole('button', { name: '+ New Item' }).click();

        await expect(page.locator('form input[placeholder="Title"]')).toBeVisible();
        await expect(page.locator('button:has-text("User Story")')).toHaveClass(/bg-blue-600/);
    });

    test('should toggle between List and Board views', async ({ page }) => {
        // Switch to List
        await page.getByRole('button', { name: 'List' }).click();
        
        // Expect at least one section to be visible (User Stories)
        await expect(page.locator('.work-item-section').first()).toBeVisible();
        await expect(page.locator('.board-view')).not.toBeVisible();

        // Switch back to Board
        await page.getByRole('button', { name: 'Board' }).click();
        await expect(page.locator('.board-view')).toBeVisible();
    });
});

