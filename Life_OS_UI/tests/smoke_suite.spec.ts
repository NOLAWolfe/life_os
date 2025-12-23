import { test, expect } from '@playwright/test';

/**
 * 🌪️ AUTOMATED SMOKE TEST SUITE
 * "The Reality Check"
 * 
 * Visits every major domain to ensure the system is up, 
 * routing works, and no white-screen crashes occur.
 */
test.describe('System Smoke Test (Critical Path)', () => {

  // 1. Landing Page (Life Admin)
  test('Landing Page should render core widgets', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page).toHaveTitle(/Life.io/);
    await expect(page.locator('h1:has-text("Your Daily Dashboard")')).toBeVisible();
    await expect(page.locator('.navbar')).toBeVisible();
  });

  // 2. Financial Dashboard (The War Room)
  test('Finance Dashboard should load Strategy Map', async ({ page }) => {
    await page.goto('http://localhost:5173/finance');
    await expect(page.locator('h1:has-text("Financial Dashboard")')).toBeVisible();
    // Verify the visualizer canvas exists
    await expect(page.locator('.react-flow')).toBeVisible({ timeout: 10000 });
  });

  // 3. Professional Hub (Work OS)
  test('Professional Hub should render Agile Board', async ({ page }) => {
    await page.goto('http://localhost:5173/professional-hub');
    await expect(page.locator('h1:has-text("Professional Hub")')).toBeVisible();
    await expect(page.locator('h3:has-text("Active")')).toBeVisible();
  });

  // 4. Social Hub (Formerly Creative)
  test('Social Hub should render', async ({ page }) => {
    await page.goto('http://localhost:5173/creative');
    await expect(page.locator('h1:has-text("Creative Hub")')).toBeVisible();
  });

  // 5. Workout Tracker (Health)
  test('Workout Page should render', async ({ page }) => {
    await page.goto('http://localhost:5173/workout');
    await expect(page.locator('h1:has-text("My Workouts")')).toBeVisible();
  });

});
