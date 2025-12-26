# Vantage OS (Formerly Life.io)

An Enterprise Operating System for High-Performance Individuals.

## Overview

Vantage OS is a modular, personal ERP system designed to manage:
- **Finance:** Net worth, debt payoff, and cash flow visualization.
- **Professional:** QA workflows, user stories, and bug tracking.
- **Health:** Workout tracking and meal planning.
- **Creativity:** DJ set management and content creation pipelines.

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
