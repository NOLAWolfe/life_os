import { test, expect } from '@playwright/test';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { SUPER_ADMIN_USER } from './mocks/user.mock';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('Capture Financial Widget Snapshots', async ({ page }) => {
    // Mock the user API call before navigating
    await page.route('/api/system/user/admin-user-123', route => {
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ status: 'success', data: SUPER_ADMIN_USER }),
        });
    });

    // 1. Navigate to the App Dashboard
    await page.goto('/app/finance');
    await expect(page.locator('h1')).toContainText(/FINANCE WAR ROOM/i, { timeout: 10000 });

    const snapshotDir = path.resolve(__dirname, '../../LifeVault/Snapshots');
    const dateStr = new Date().toISOString().split('T')[0];

    // 3. Snapshot: Small Win Widget
    const smallWin = page.locator('.small-win-widget');
    if (await smallWin.isVisible()) {
        await smallWin.screenshot({ path: `${snapshotDir}/Small_Win_${dateStr}.png` });
        console.log(`✅ Small Win Snapshot saved for ${dateStr}`);
    }

    // 4. Snapshot: Wealth Targets (10X Target)
    const wealthTargets = page.locator('.wealth-targets-widget');
    if (await wealthTargets.isVisible()) {
        await wealthTargets.screenshot({ path: `${snapshotDir}/Wealth_Targets_${dateStr}.png` });
        console.log(`✅ Wealth Target Snapshot saved for ${dateStr}`);
    }

    // 5. Snapshot: Debt Planner (if visible)
    const debtPlanner = page.locator('.debt-payoff-planner');
    if (await debtPlanner.isVisible()) {
        await debtPlanner.screenshot({ path: `${snapshotDir}/Debt_Planner_${dateStr}.png` });
    }
});
