import { test, expect } from '@playwright/test';
import { SUPER_ADMIN_USER } from './mocks/user.mock';

/**
 * 🌪️ AUTOMATED SMOKE TEST SUITE
 * "The Reality Check"
 *
 * Visits every major domain to ensure the system is up,
 * routing works, and no white-screen crashes occur.
 */
test.describe('System Smoke Test (Critical Path)', () => {
    // 1. Marketing Page (Public) - No mock needed
    test('Marketing Page should render correctly', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/Vantage OS/i);
        await expect(page.locator('h1')).toContainText(/Vantage/i);
        await expect(page.locator('button:has-text("Launch Dashboard")')).toBeVisible();
    });

    // 2. Dashboard (Private)
    test('Dashboard should render core widgets', async ({ page }) => {
        await page.route('/api/system/user/admin-user-123', route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ status: 'success', data: SUPER_ADMIN_USER }),
            });
        });
        await page.goto('/app');
        await expect(page.locator('.navbar')).toBeVisible();
        await expect(page.locator('h1')).toContainText(/VANTAGE OS/i);
    });

    // 3. Financial Dashboard (The War Room)
    test('Finance Dashboard should load Strategy Map', async ({ page }) => {
        await page.route('/api/system/user/admin-user-123', route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ status: 'success', data: SUPER_ADMIN_USER }),
            });
        });
        await page.goto('/app/finance');
        await expect(page.locator('h1')).toContainText(/FINANCE WAR ROOM/i);
        await expect(page.locator('.react-flow')).toBeVisible({ timeout: 10000 });
    });

    // 4. Professional Hub (Work OS)
    test('Professional Hub should render Agile Board', async ({ page }) => {
        await page.route('/api/system/user/admin-user-123', route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ status: 'success', data: SUPER_ADMIN_USER }),
            });
        });
        await page.goto('/app/professional-hub');
        await expect(page.locator('h1:has-text("Professional Hub")')).toBeVisible();
        await expect(page.locator('h3:has-text("Active")')).toBeVisible();
    });

    // 5. Social Hub (Formerly Creative)
    test('Social Hub should render', async ({ page }) => {
        await page.route('/api/system/user/admin-user-123', route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ status: 'success', data: SUPER_ADMIN_USER }),
            });
        });
        await page.goto('/app/creative');
        await expect(page.locator('h1:has-text("Social Hub")')).toBeVisible();
    });

    // 6. Business Hub (Enterprise ERP)
    test('Business Hub should render', async ({ page }) => {
        await page.route('/api/system/user/admin-user-123', route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ status: 'success', data: SUPER_ADMIN_USER }),
            });
        });
        await page.goto('/app/business');
        await expect(page.locator('h1:has-text("Business Hub")')).toBeVisible();
        await expect(page.locator('button:has-text("Operations")')).toBeVisible();
    });

    // 7. Workout Page
    test('Workout Page should render', async ({ page }) => {
        await page.route('/api/system/user/admin-user-123', route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ status: 'success', data: SUPER_ADMIN_USER }),
            });
        });
        await page.goto('/app/workout');
        await expect(page.locator('h1:has-text("My Workouts")')).toBeVisible({ timeout: 10000 });
    });
});
