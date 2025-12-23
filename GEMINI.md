# Life_OS Project Overview (Life.io)
Current Version: 2.2 (The Financial Command Center)
User: Neauxla (Senior QA Automation Analyst, Musician, Entrepreneur)

## **CURRENT STATUS (as of Dec 21, 2025)**
The project has moved from a static visualization to a **dynamic, manageable strategy engine**. The "Money Map" is now resilient and supports advanced organization.

1.  **Money Map (PaymentFlow) Overhaul**
    *   **Deterministic IDs:** Fixed a bug where auto-generated nodes (CCs, Assets) would duplicate on refresh. Node IDs are now derived from account names/IDs.
    *   **Vital Account Discovery:** The map now automatically detects checking/savings accounts as "Hubs" (Tier 1), ensuring the core of the financial system is always visible without manual entry.
    *   **The "Bucket" System (Grouping):** Implemented a grouping mechanism to manage visual clutter. Multiple bills can be merged into a single "Bill Bucket" node and "popped" out later.
    *   **Manifest Enhancements:** The "Written Plan" now recursively renders the contents of buckets, providing a complete audit trail even for organized nodes.

2.  **Robustness & Security**
    *   **PII & Data Protection:** Updated `.gitignore` across the project to protect `.db`, `*_data.json`, and CSV files from being committed.
    *   **Resilient Ingestion:** Hardened `tillerService` to handle missing ID columns and added support for "Current Balance" header variations.
    *   **Prisma Stability:** Verified the SQLite/Prisma backend is healthy and ready for active data persistence.

3.  **The "Hottest Dollar" & Strategic Metrics**
    *   **Remaining Funds:** Added a dynamic calculation of monthly surplus at the bottom of the map, identifying how much "active" capital is left after all commitments are met.

4.  **Optimization & Resilience (Phase 1)**
    *   **Performance:** Implemented database indexing, React memoization, and lazy loading for a lightning-fast UI.
    *   **Visibility:** Organized the strategy engine (Bills List/Plan) by account source to reduce cognitive load and redundancy.
    *   **Auditability:** Built the "Data Debugger" to provide transparency into the raw CSV ingestion process.

## **OPERATIONAL PROTOCOLS**
**Start Session Duties:**
1.  **Git Sync:** `git pull` & `git status` to ensure the workspace is current.
2.  **Context Load:** Read `GEMINI.md` and `LATEST_COMMIT.txt`.
3.  **Health Check:** Run `npm run lint` or `validate_system.js` (or relevant test suite).
4.  **Mission Briefing:** Recap the current phase and immediate objectives.

---

**Next Session Mission: Operation Bedrock (Enterprise Hardening)**
We are pausing feature development to pay down technical debt and establish "Enterprise Standards" for reliability and scalability.

1.  **Phase 1: The Safety Net (Testing & Logic)**
    *   **Objective:** Verify critical "Money Logic" before refactoring.
    *   **Tasks:**
        *   Install **Vitest** (Unit Testing) & **AppMap** (Dependency Visualization).
        *   Write unit tests for `strategyService.js` (Drift detection), `tillerService.js` (Parsing), and `debtService.js` (Math).

2.  **Phase 2: The Gatekeeper (Data Integrity)**
    *   **Objective:** Eliminate "undefined" crashes and valid data assumptions.
    *   **Tasks:**
        *   Install **Zod** (Schema Validation).
        *   Implement strict schemas for Tiller CSV ingestion and API responses.

3.  **Phase 3: The Brain Surgery (State Management)**
    *   **Objective:** Fix the "God Object" (Performance).
    *   **Tasks:**
        *   Install **TanStack Query**.
        *   Refactor `FinancialContext` to delegate data fetching to Query hooks, keeping only UI state in Context.

4.  **Phase 4: The Black Box (Observability)**
    *   **Objective:** Debug via logs, not guessing.
    *   **Tasks:**
        *   Implement a structured **Logger Service**.

---

**Future Roadmap: Enterprise Simulation (SaaS Layer)**
*(Deferred until Operation Bedrock is complete)*
The goal is to simulate a client-facing SaaS product to test multi-tenancy UX.
1.  **Phase 1: The Storefront Separation**
    *   Rename `LandingPage.jsx` -> `DashboardPage.jsx`.
    *   Create a public-facing `LandingPage.jsx` (Marketing Site).
    *   Bifurcate Routing: `/` (Public) vs `/app` (Private).
2.  **Phase 2: The Identity Engine**
    *   Create `UserContext` for simulated Auth state (Guest/Free/Pro).
    *   Implement "God Mode" switch for testing user tiers.
3.  **Phase 3: The Paywall**
    *   Implement `<FeatureGate>` components to lock features based on tiered access.

---

**Life.io Architectural Strategy: The Dual-Path**
_(No changes to this section)_