import { test, expect } from '@playwright/test';

/**
 * Professional Hub Domain Test
 * Verifies Agile Board functionality and AI Co-Pilot readiness.
 */
test.describe('Professional Hub - Agile Workflow', () => {

  test.beforeEach(async ({ page }) => {
    // 1. Visit the Professional Hub
    await page.goto('http://localhost:5173/professional-hub');
  });

  test('should display the Agile Board by default', async ({ page }) => {
    await expect(page.locator('h1:has-text("Professional Hub")')).toBeVisible();
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
    await expect(stories.first()).toBeVisible();
    await expect(activeColumn).toContainText('PII Obfuscation');
  });

  test('should open the "New Item" form', async ({ page }) => {
    await page.click('button:has-text("+ New Item")');
    
    await expect(page.locator('form input[placeholder="Title"]')).toBeVisible();
    await expect(page.locator('button:has-text("User Story")')).toHaveClass(/bg-blue-600/);
  });

  test('should toggle between List and Board views', async ({ page }) => {
    // Switch to List
    await page.click('button:has-text("List")');
    // Expect at least one section to be visible (User Stories)
    await expect(page.locator('.work-item-section').first()).toBeVisible();
    await expect(page.locator('.board-view')).not.toBeVisible();
    
    // Switch back to Board
    await page.click('button:has-text("Board")');
    await expect(page.locator('.board-view')).toBeVisible();
  });

});
