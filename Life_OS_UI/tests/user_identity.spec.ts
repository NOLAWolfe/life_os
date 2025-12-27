import { test, expect } from '@playwright/test';

test.describe('User Identity & Session Management', () => {
    test('should fail identity gracefully when user does not exist', async ({ page }) => {
        // Mock a 404 for the user fetch
        await page.route('/api/system/user/admin-user-123', route => {
            route.fulfill({
                status: 404,
                contentType: 'application/json',
                body: JSON.stringify({ status: 'fail', message: 'User not found' }),
            });
        });

        await page.goto('/app');
        
        // Should show the error message from UserContext.jsx
        await expect(page.locator('text=System Identity Failed')).toBeVisible();
    });

    test('should succeed when user exists in database', async ({ page }) => {
        // This relies on the seeded data from seed_qa_data.js
        // We don't mock here, we let it hit the real (seeded) local API
        await page.goto('/app');
        
        // Should NOT show the error
        await expect(page.locator('text=System Identity Failed')).not.toBeVisible();
        
        // Should show the navbar or dashboard
        await expect(page.locator('.navbar')).toBeVisible();
    });

    test('should allow switching identities in God Mode', async ({ page }) => {
        // 1. Mock the user
        await page.route('/api/system/user/admin-user-123', route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ 
                    status: 'success', 
                    data: {
                        id: 'admin-user-123',
                        name: 'Neauxla',
                        role: 'admin',
                        installedTools: ['finance'],
                        dashboardLayout: '{}'
                    } 
                }),
            });
        });

        await page.goto('/app');
        
        // 2. Trigger God Mode via Triple Click on Logo
        const logo = page.locator('.navbar-logo');
        await logo.click({ clickCount: 3 });

        // 3. Verify God Mode Panel is visible
        await expect(page.locator('text=⚡ God Mode')).toBeVisible();
        
        // 4. Verify the identity switcher exists
        await expect(page.locator('select').filter({ hasText: /User A/ })).toBeVisible();
    });
});
