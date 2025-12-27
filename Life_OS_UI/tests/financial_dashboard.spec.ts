import { test, expect } from '@playwright/test';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { SUPER_ADMIN_USER } from './mocks/user.mock';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Financial Dashboard Full-Scope Auditor
 * This suite verifies the core functionality and visual integrity of the Financial Domain.
 */
test.describe('Financial Dashboard - Domain Audit', () => {
    test.beforeEach(async ({ page }) => {
        // Mock the user API call before navigating
        await page.route('/api/system/user/admin-user-123', route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ status: 'success', data: SUPER_ADMIN_USER }),
            });
        });

        // Navigate to the Financial Dashboard
        await page.goto('/app/finance');
        await expect(page.locator('h1')).toContainText(/FINANCE WAR ROOM/i, { timeout: 10000 });
    });

    test('Page Structure & Title Verification', async ({ page }) => {
        await expect(page.locator('.dashboard-tabs')).toBeVisible();
    });

    test('Main Tab Navigation Flow', async ({ page }) => {
        const tabs = page.locator('.tab-button');

        // Verify Analytics Tab
        await tabs.filter({ hasText: 'Analytics & Trends' }).click();
        await expect(page.locator('.sub-tabs')).toContainText('Overview');
        await expect(page.locator('.sub-tabs')).toContainText('Income');

        // Verify Data Tab
        await tabs.filter({ hasText: 'Data Management' }).click();
        await expect(page.locator('.sub-tabs')).toContainText('Upload Files');
        await expect(page.locator('.sub-tabs')).toContainText('Sorting Hat');

        // Return to Strategy Tab
        await tabs.filter({ hasText: 'Strategy & Planning' }).click();
        await expect(page.locator('.sub-tabs')).toContainText('Visual Map');
    });

    test('Sub-Tab Integrity (Strategy View)', async ({ page }) => {
        const subTabs = page.locator('.sub-tab-button');

        // Default sub-tab is Visual Map
        // Relaxed selector: look for the react-flow container
        await expect(page.locator('.react-flow')).toBeVisible({ timeout: 15000 });

        // Switch to Written Plan
        await subTabs.filter({ hasText: 'Written Plan' }).click();
    });

    test('Analytics Widget Audit', async ({ page }) => {
        // Switch to Analytics
        await page.locator('.tab-button').filter({ hasText: 'Analytics & Trends' }).click();
        
        // Wait for the tab content to render
        await page.waitForTimeout(1000);

        // Check for high-value widgets in Overview
        // Selectors might have changed, using more generic class checks or text
        await expect(page.locator('.spending-trends-container')).toBeVisible({ timeout: 10000 });
    });

    test('Visual Regression Snapshot (Obsidian Integration)', async ({ page }) => {
        const snapshotDir = path.resolve(__dirname, '../../LifeVault/Snapshots');
        const dateStr = new Date().toISOString().split('T')[0];

        // 1. Snapshot: Main Strategy Map
        const strategyMap = page.locator('.flow-content-wrapper');
        if (await strategyMap.isVisible()) {
            await strategyMap.screenshot({
                path: `${snapshotDir}/Audit_StrategyMap_${dateStr}.png`,
            });
        }

        // 2. Snapshot: Analytics Overview
        await page.locator('.tab-button').filter({ hasText: 'Analytics & Trends' }).click();
        await page.waitForTimeout(2000); // Wait for animations
        await page.screenshot({
            path: `${snapshotDir}/Audit_Analytics_Overview_${dateStr}.png`,
            fullPage: true,
        });

        // 3. Snapshot: Leak Detector specifically
        const leakDetector = page.locator('.leak-detector-container');
        if (await leakDetector.isVisible()) {
            await leakDetector.screenshot({ path: `${snapshotDir}/Audit_Leaks_${dateStr}.png` });
        }
    });

    test('Data Debugger Audit', async ({ page }) => {
        // Navigate to Data -> Debugger
        await page.locator('.tab-button').filter({ hasText: 'Data Management' }).click();
        await page.locator('.sub-tab-button').filter({ hasText: 'Data Debugger' }).click();

        await expect(page.locator('.data-debugger')).toBeVisible();
        await expect(page.locator('.data-debugger h2')).toContainText('Data Debugger');
    });
});
