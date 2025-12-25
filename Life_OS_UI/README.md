# Life.io Financial Dashboard

The central hub for the "Life.io" Operating System. This React-based dashboard transforms raw financial data (CSV exports) into actionable strategy, wealth tracking, and leak detection.

## Key Features

### 1. 🗺️ Strategy & Planning (The "War Room")

- **Payment Strategy Flowchart:** An interactive map of your financial pipeline (Hubs -> Accounts -> Bills).
    - **Drift Detection:** Automatically flags bills paid from the wrong account based on your rules.
    - **Money Flow:** Visualizes real-time account balances and monthly bill costs on the chart.
    - **Visual vs. Plan Mode:** Toggle between the flowchart and a text-based "Manifest" or "Master Bills List".
- **Leak Detector:**
    - **Death by 1000 Cuts:** Aggregates micro-transactions (<$30) to show their cumulative impact.
    - **Ghost Bills:** Amortization calculator for large, irregular expenses (e.g., Car Insurance).
    - **Habitual Spenders:** Identifies top merchants by frequency.

### 2. 📊 Analytics & Trends (Wealth Creation)

- **Income Streams (Offense):**
    - Classify income as **Active**, **Side Hustle**, or **Passive**.
    - **Ignored Streams:** Mute transfers/refunds for accurate totals.
    - **Transaction Drill-down:** Click any stream to see the exact bank transactions powering it.
    - **10X Targets:** Set and track income goals.
- **Spending Analysis:** Categorized breakdown of monthly outflows.
- **Budget vs. Actuals:** Real-time tracking against your Tiller budget columns.

### 3. 💾 Data Management (The Engine)

- **Bank Connect:** (Placeholder) Future integration point for Plaid.
- **CSV Uploader:** robust drag-and-drop zone for Tiller exports (`Transactions.csv`, `Accounts.csv`, etc.).
- **Smart Parsing:** Handles duplicate headers and fuzzy matching to ensure data integrity.

## Tech Stack

- **Frontend:** React 18 (Vite)
- **Visualization:** `@xyflow/react` (Flowcharts), `chart.js` (Trends).
- **Data Processing:** Custom API validation logic.
- **Styling:** Tailwind CSS + CSS Modules.
- **Persistence:** `localStorage` for user configs (Flowchart layout, Merchant Rules, Income Targets).

## Getting Started

1.  Place your Tiller CSV exports in the `public/` folder:
    - `Transactions.csv`
    - `Accounts.csv`
    - `Categories.csv`
    - `Balances.csv`
    - `Debt Payoff Planner.csv`
2.  Run `npm run dev`.
3.  Navigate to the **Finance** page.
