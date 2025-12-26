import { test, expect } from '@playwright/test';
import { SUPER_ADMIN_USER } from './mocks/user.mock';

test.describe('Hottest Dollar Engine - Smoke Test', () => {
    test.beforeEach(async ({ page }) => {
        // Mock the user API call
        await page.route('/api/system/user/admin-user-123', route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ status: 'success', data: SUPER_ADMIN_USER }),
            });
        });

        // Mock accounts
        await page.route('/api/finance/accounts*', route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([
                    { id: 'acc-1', name: 'Checking', institution: 'Bank', type: 'checking', balance: 5000 }
                ]),
            });
        });

        // Mock transactions (Income)
        await page.route('/api/finance/txns*', route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([
                    { id: 't1', date: new Date().toISOString(), description: 'Paycheck', amount: 5000, type: 'credit', category: 'Income' }
                ]),
            });
        });

        // Mock debts
        await page.route('/api/finance/debts*', route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([
                    { name: 'Loan', balance: 10000, interestRate: 5, minPayment: 500 }
                ]),
            });
        });
    });

    test('should display the Hottest Dollar Bar on the dashboard', async ({ page }) => {
        await page.goto('/app');
        
        const bar = page.locator('.hottest-dollar-bar');
        await expect(bar).toBeVisible({ timeout: 15000 });
        
        // Check for branding
        await expect(bar.locator('.branding .label')).toContainText('The Hottest Dollar');
        
        // Check for amount (should be visible and non-zero based on seed)
        const amount = bar.locator('.branding .amount');
        await expect(amount).toBeVisible();
        const amountText = await amount.textContent();
        expect(amountText).toContain('$');
        
        // Check for status badge
        await expect(bar.locator('.status-text')).toBeVisible();
    });

    test('should show correct strategy recommendation', async ({ page }) => {
        await page.goto('/app/finance');
        
        const bar = page.locator('.hottest-dollar-bar');
        await expect(bar).toBeVisible();
        
        const strategy = bar.locator('.strategy-recommendation');
        await expect(strategy).toBeVisible();
        
        // Based on our seed ($3112 surplus), it should be GROWTH status
        await expect(bar).toHaveClass(/growth/);
        await expect(strategy).toContainText('STRATEGY: Accelerate Debt Avalanche');
    });
});
