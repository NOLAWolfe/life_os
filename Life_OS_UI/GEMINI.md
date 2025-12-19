# Life_OS_UI Project Context

This is the React-based frontend for the Life.io "Operating System". It serves as the unified dashboard for financial management, personal productivity, and creative workflows.

## Tech Stack
- **Framework:** React 18+ (Vite)
- **Styling:** CSS Modules, Tailwind CSS, and global theme variables in `index.css`.
- **State Management:** React Context (`FinancialContext.jsx`) for global financial data.
- **Routing:** React Router (implicit in `App.jsx`).
- **Data Ingestion:** CSV parsing for Tiller/Plaid exports via `tillerService.js`.
- **Visualization:** `@xyflow/react` for interactive flowcharts, `chart.js` for graphs.
- **APIs:** Integrations with `adoService` (Azure DevOps), `spotifyService`, and local Python-based health services.

## Core Components
- **Dashboard:** A widget-based layout featuring `BalancesWidget`, `SmallWinWidget`, and `Calendar`.
- **Financial Hub (The "War Room"):**
    - `PaymentFlow`: Interactive strategy map with drift detection and node inspection.
    - `LeakDetector`: Analyzes micro-spending and amortizes ghost bills.
    - `IncomeStreams`: Wealth creation tool with active/passive classification and 10X targets.
    - `DebtPayoffPlanner`: Strategic debt reduction calculator.
- **Professional Hub:** QA-focused tools for user story and bug tracking.
- **Creative Page:** DJ-specific utilities and creative planning tools.
- **Health/Workout:** Trackers for meals and exercises.

## Development Conventions
- **Component Structure:** Each component has its own folder containing `.jsx` and `.css` files.
- **Service Layer:** API calls and data processing logic are encapsulated in `src/services/`.
- **Theming:** Use CSS variables (e.g., `--primary-color`, `--bg-dark`) defined in `index.css` for consistent styling.
- **Mocking:** For features without a live backend, use mock data services in `src/services/` to simulate API behavior.

## Key Files
- `src/App.jsx`: Main routing and layout.
- `src/contexts/FinancialContext.jsx`: Central hub for financial data parsed from CSVs.
- `src/services/tillerService.js`: Logic for processing Tiller CSV exports (includes robust header deduplication).
- `src/pages/FinancialDashboard.jsx`: The main tabbed interface (Strategy, Analytics, Data).

## Session Log (Dec 19, 2025)
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