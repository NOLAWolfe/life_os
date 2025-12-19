# Life_OS_UI Project Context

This is the React-based frontend for the Life.io "Operating System". It serves as the unified dashboard for financial management, personal productivity, and creative workflows.

## Tech Stack
- **Framework:** React 18+ (Vite)
- **Styling:** CSS Modules, Tailwind CSS, and global theme variables in `index.css`.
- **State Management:** React Context (`FinancialContext.jsx`) for global financial data.
- **Routing:** React Router (implicit in `App.jsx`).
- **Data Ingestion:** CSV parsing for Tiller/Plaid exports via `tillerService.js`.
- **APIs:** Integrations with `adoService` (Azure DevOps), `spotifyService`, and local Python-based health services.

## Core Components
- **Dashboard:** A widget-based layout featuring `BalancesWidget`, `SmallWinWidget`, and `Calendar`.
- **Financial Hub:** Advanced tools like `DebtPayoffPlanner`, `IncomeStreams`, and `SpendingTrends`.
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
- `src/services/tillerService.js`: Logic for processing Tiller CSV exports.
- `docs/GEMINI_LOG.md`: Detailed session-by-session history of AI-assisted changes.
