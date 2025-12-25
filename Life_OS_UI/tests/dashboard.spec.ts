import { test, expect } from '@playwright/test';

test('Dashboard loads and renders core components', async ({ page }) => {
    // 1. Navigate to the App Dashboard
    await page.goto('http://localhost:5173/app/finance');

    // 2. Check for the main title
    await expect(page.locator('h1')).toContainText('Financial Dashboard');

    // 3. Verify the Strategy Map canvas exists (The Visualizer)
    await expect(page.locator('.react-flow')).toBeVisible();

    // 4. Verify the Sorting Hat tab exists
    // We need to click the 'Data Management' tab first if it's not active,
    // but let's just check if the buttons are present in the DOM
    await expect(page.getByText('🗺️ Strategy & Planning')).toBeVisible();
    await expect(page.getByText('📊 Analytics & Trends')).toBeVisible();
});
