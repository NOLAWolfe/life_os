import { test, expect } from '@playwright/test';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('Capture Financial Widget Snapshots', async ({ page }) => {
    // 1. Navigate to the App Dashboard
    await page.goto('http://localhost:5173/app/finance');

    // 2. Wait for the Dashboard to load
    await page.waitForSelector('.financial-dashboard');

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
