// --- AI Service ---
// This file will contain all the logic for interacting with AI models.
// For now, it contains placeholder functions that return mock data.

/**
 * Summarizes a user story into testing requirements.
 * (Currently returns mock data)
 * @param {object} userStory - The user story object to analyze.
 */
export const summarizeUserStory = async (userStory) => {
    console.log("Summarizing user story (mock):", userStory.id);

    let summary = "No summary available.";
    if (userStory.id === 26354) {
        summary = `**Testing Requirements for Login:**
- **Scenario 1: Valid Credentials**
  - GIVEN a user is on the login page
  - WHEN they enter a valid email and password
  - AND they click the 'Login' button
  - THEN they should be redirected to the '/dashboard' page.

- **Scenario 2: Invalid Credentials**
  - GIVEN a user is on the login page
  - WHEN they enter an invalid email or password
  - AND they click the 'Login' button
  - THEN they should see an error message 'Invalid credentials.'
`;
    } else if (userStory.id === 26355) {
        summary = `**Testing Requirements for Balance Display:**
- **Scenario 1: Balance Visibility**
  - GIVEN a logged-in user is on the dashboard
  - THEN the user's current account balance should be visible.
  - AND the balance should be formatted as a currency (e.g., $1,234.56).
`;
    }

    return Promise.resolve(summary);
};

/**
 * Generates Playwright scenarios based on a user story.
 * (Currently returns mock data)
 * @param {object} userStory - The user story object to generate scenarios for.
 */
export const generateScenarios = async (userStory) => {
    console.log("Generating scenarios for user story (mock):", userStory.id);

    let scenarios = "No scenarios available.";
    if (userStory.id === 26354) {
        scenarios = `
import { test, expect } from '@playwright/test';

test.describe('Login Functionality', () => {
  test('should allow a user to log in with valid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'valid.user@example.com');
    await page.fill('input[name="password"]', 'valid-password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should show an error message with invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'invalid.user@example.com');
    await page.fill('input[name="password"]', 'invalid-password');
    await page.click('button[type="submit"]');
    const errorMessage = page.locator('.error-message');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('Invalid credentials.');
  });
});
`;
    }

    return Promise.resolve(scenarios);
};

/**
 * Generates an automation stencil based on a user story.
 * (Currently returns mock data)
 * @param {object} userStory - The user story object to generate a stencil for.
 */
export const generateStencil = async (userStory) => {
    console.log("Generating stencil for user story (mock):", userStory.id);

    let stencil = "No stencil available.";
    if (userStory.id === 26354) {
        stencil = `
// FILE: tests/login.spec.js

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Login Feature', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('successful login', async ({ page }) => {
    await loginPage.login('valid.user@example.com', 'valid-password');
    await expect(page).toHaveURL('/dashboard');
  });

  test('failed login', async () => {
    await loginPage.login('invalid.user@example.com', 'invalid-password');
    await expect(loginPage.errorMessage).toBeVisible();
  });
});
`;
    }
    return Promise.resolve(stencil);
};

const aiService = {
    summarizeUserStory,
    generateScenarios,
    generateStencil,
};

export default aiService;
