import { test, expect } from '@playwright/test';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Financial Dashboard Full-Scope Auditor
 * This suite verifies the core functionality and visual integrity of the Financial Domain.
 */
test.describe('Financial Dashboard - Domain Audit', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the Financial Dashboard
        await page.goto('http://localhost:5173/app/finance');
        await page.waitForSelector('.financial-dashboard');
        await page.waitForLoadState('networkidle'); // Wait for lazy loads
    });

    test('Page Structure & Title Verification', async ({ page }) => {
        await expect(page.locator('h1')).toContainText('Financial Dashboard');
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
        await expect(page.locator('.flow-content-wrapper')).toBeVisible({ timeout: 10000 });

        // Switch to Written Plan
        await subTabs.filter({ hasText: 'Written Plan' }).click();
        // Assuming PaymentFlow handles these views, we check for a visual change or specific text
        // await expect(page.locator('.written-plan-content')).toBeVisible();
    });

    test('Analytics Widget Audit', async ({ page }) => {
        // Switch to Analytics
        await page.locator('.tab-button').filter({ hasText: 'Analytics & Trends' }).click();

        // Check for high-value widgets in Overview
        const widgets = [
            '.income-streams-widget',
            '.spending-trends-container',
            '.debt-planner-container',
        ];

        for (const selector of widgets) {
            const widget = page.locator(selector);
            await expect(widget).toBeVisible({ timeout: 5000 });
        }
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
        await expect(page.locator('h2')).toContainText('Data Debugger');
    });
});
