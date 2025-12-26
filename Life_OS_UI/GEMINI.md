# Vantage OS UI (Life_OS_UI)

This is the React-based frontend for **Vantage OS** (formerly Life.io). It serves as the unified dashboard for financial management, personal productivity, and creative workflows.

## Tech Stack

- **Framework:** React 18+ (Vite)
- **Styling:** CSS Modules, Tailwind CSS, and global theme variables in `index.css`.
- **State Management:** 
    - `UserContext.jsx`: Handles Identity, Permissions, and **Grid Layouts**.
    - `FinancialContext.jsx`: Global financial data.
- **Routing:** React Router (implicit in `App.jsx`).
- **Data Ingestion:** Prisma (SQLite) + Tiller CSV Sync.
- **Visualization:** `@xyflow/react` for interactive flowcharts, `react-grid-layout` for Dashboards.

## Core Components

- **Tool Store:** (`/app/store`) App-store style interface to enable/disable modules.
- **Vantage Dashboard:** Draggable grid layout featuring:
    - `BalancesWidget`, `SmallWinWidget`, `Calendar`.
    - `WealthTargets`, `WealthMentor`.
- **Financial War Room:**
    - `PaymentFlow`: Interactive strategy map.
    - `LeakDetector`: Analyzes micro-spending.
- **Professional Hub:** QA tools, Agile Board.

## Session Log (Dec 26, 2025)

- **The "Vantage" Rebrand:**
    - **Identity:** Renamed from "Life.io" to **Vantage OS**.
    - **Personalization:** Implemented `User` model in Prisma with `installedTools` and `dashboardLayout`.
    - **UI:** Added `ToolStorePage` for managing active modules.
    - **UX:** Implemented `react-grid-layout` for a draggable, distinct "OS" feel.
    - **Legal:** Added "Compliance Epic" to Professional Hub (Terms, GDPR, ADA).

## Session Log (Dec 22, 2025)

- **Financial Strategy Overhaul:**
    - Created **Payment Strategy Flowchart** (`@xyflow/react`) to visualize money movement.
    - Implemented **Drift Detection**: Flags bills paid from the wrong account based on user-defined rules.
    - Added **Money Flow Stats**: Nodes now display live account balances and monthly bill costs.
    - Built **Leak Detector**: Identifies "Death by 1000 Cuts" and "Habitual Spenders".
- **Wealth Creation:**
    - Enhanced **Income Streams** to support Active/Side/Passive classification.
    - Added **Transaction Drill-down** to audit income sources.
    - Implemented "Ignored" streams to clean up transfer noise.
- **Infrastructure:**
    - Refactored `FinancialDashboard` into a unified **Tabbed Card** interface (Strategy / Analytics / Data).
    - Hardened `tillerService.js` to handle **Duplicate CSV Headers** and use smart value hunting (`findVal`).
    - Fixed connectivity issues with `BudgetVsActuals` and `SpendingTrends` by improving data parsing.

## Session Log (Dec 22, 2025)

- **The "Enterprise" Refactor:**
    - **SQLite Core:** Migrated `FinancialContext` and `adoService` to fully rely on the local SQLite database. Removed legacy JSON/CSV dependency.
    - **Professional Engine:** Replaced `professional_data.json` with a robust `UserStory` and `Bug` Prisma schema.
    - **Agile Board:** Upgraded `ProfessionalHubPage` with a Kanban-style board and rich descriptions for "Demo Mode".
- **The "Sorting Hat" & Debt:**
    - **Live Debt Sync:** Bypassed Tiller header errors to extract _actual_ Interest Rates and Min Payments from the "Debt Payoff Planner" sheet.
    - **Normalized Data:** Updated `tillerService` to map DB fields (`description` -> `name`) for seamless UI integration.
- **Security & Organization:**
    - **PII Cleanup:** Removed all `.env.example` and `public/*.csv` files to prevent data leaks.
    - **Documentation:** Created "Enterprise Growth Strategy" in Obsidian to map the path from "Tool" to "SaaS".
- **System Optimization:**
    - **Frontend Build:** Verified `vite build` passes successfully.
    - **Synthetic Data:** Seeded the database with realistic "Enterprise" tickets for immediate demo value.

    - **Testing Suite:** Added Playwright specs for `transaction_mapper` and `professional_hub` to validate critical flows.

- **Closing Verification:**
    - **Smoke Test:** Passed (5/5). Critical paths (Finance, Professional, Social, Health) are active.
    - **Visualizer Enrichment:** Confirmed "Liability + Debt Metadata" merging logic eliminates duplicate nodes.
    - **Cleanup:** Public CSVs and legacy JSONs purged.

## Development Conventions

- **Component Structure:** Organized by Domain (`src/components/{Domain}/{Widget}`).

## Key Files

- `src/App.jsx`: Main routing and layout.
- `src/contexts/FinancialContext.jsx`: Central hub for financial data (now SQLite-first).
- `server/modules/`: Modular backend engines (`financial_engine`, `professional_engine`).
- `src/pages/FinancialDashboard.jsx`: The main tabbed interface (Strategy, Analytics, Data).
