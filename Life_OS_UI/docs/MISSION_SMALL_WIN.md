# Mission: Is the Small Win Dynamic?

Your goal is to determine if the "Small Win" recommendation is actually calculated from your data or if it's currently a "stub" (placeholder logic).

## 📋 Task List

- [ ] **Step 1: The UI Hunt**
    - Open `src/components/SmallWinWidget/SmallWinWidget.jsx`.
    - Find the line that renders the `<strong>` tag with the dollar amount.
    - **Hint:** Look for a specific hardcoded number being added to a variable. Does that number (+50) seem like a business rule or a placeholder?

- [ ] **Step 2: The Logic Trace**
    - In the same file, find the `useMemo` block that defines `priorityDebt`.
    - Examine the `.sort()` function. 
    - **Hint:** By what criteria is it picking the "top" debt? Interest rate? Alphabetical? Balance?

- [ ] **Step 3: The Data Pipeline (The Service)**
    - Open `src/services/tillerService.js`.
    - Find the function `processDebtData`.
    - **Hint:** This function iterates through CSV rows. Look for the `debtAccounts.push({...})` block. Which index of the `values` array maps to `minPayment`? 

- [ ] **Step 4: The Source of Truth (The CSV)**
    - Open `public/Debt Payoff Planner.csv`.
    - Compare the columns in the CSV with the indices you found in Step 3.
    - **Hint:** Tiller CSVs often have "Hidden" columns. Count carefully. Is index `[4]` actually the Minimum Payment column?

- [ ] **Step 5: The "Live" Test**
    - While your dev server is running, change a "Current Balance" or "Min Payment" for one of your debts in `public/Debt Payoff Planner.csv`.
    - Save the file.
    - **Observation:** Does the widget update automatically? If not, why? (Look at `FinancialContext.jsx` for the "Auto-load" logic).

## 💡 Pro-Tips for Obsidian
- Use `Ctrl+Click` (or `Cmd+Click`) on function names in your IDE to jump to their definitions.
- Keep the `ARCHITECTURE.md` open as a map.
- If you find a bug in the mapping, try to fix it and see how the UI changes!
