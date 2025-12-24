# Life.io Monetization Strategy: "Insight as a Service"

## 💎 Core Philosophy
**"Utility is Free, Strategy is Paid."**

We provide the basic tools to *track* your life for free, replacing spreadsheets. We charge for the tools that help you *improve* your life, replacing consultants.

## 📊 Tier Breakdown

### 1. Free Tier (The "Ledger")
*Target: Users who just want to know "What do I have?"*
*   **Features:**
    *   **Balances Widget:** Live account totals.
    *   **Spending Trends:** Historical spending graphs.
    *   **Budget vs. Actuals:** Monthly tracking.
    *   **Transaction List:** Searchable history.
    *   **Life Admin:** Basic Workout & Meal Logging.

### 2. Pro Tier (The "Advisor")
*Target: Users actively seeking financial growth, debt freedom, or optimization.*
*   **Features:**
    *   **🗺️ The Money Map:** Interactive visualizer of cash flow and drift.
    *   **📉 Debt Payoff Planner:** Avalanche/Snowball calculators and simulations.
    *   **💸 Leak Detector:** AI-driven analysis of wasted spend (subscriptions, fees).
    *   **💰 Income Streams:** 10X tracking and passive income analysis.
    *   **🎧 DJ World:** Client & Invoice Management (Business Tools).

### 3. Enterprise / Family (The "Empire")
*Target: Couples, Families, or Power Users managing multiple entities.*
*   **Features:**
    *   Multi-User Sync (Partner Login).
    *   "God Mode" Admin Tools.
    *   Priority Support.

## 🔒 Implementation
*   **Gatekeeper:** `<FeatureGate>` component wraps Pro components.
*   **Fallback:** Upsell UI is displayed in place of the widget (e.g., "Unlock the Money Map").
*   **Identity:** `UserContext` manages the `tier` state (`guest` -> `free` -> `pro`).
