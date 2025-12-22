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

---

**Next Session Mission: The Architectural Refactor & AppMap Integration**
*   **AppMap Baseline:** Generate and analyze the current system map to identify any lingering circular dependencies or hidden bottlenecks.
*   **Logic Extraction:** Move grouping, flow, and drift detection logic out of `PaymentFlow.jsx` and into a dedicated `strategyService.js` (Per Senior Dev's audit).
*   **Data Debugger Expansion:** 
    *   Add "Lateral Movement" audit to show why specific transactions were flagged.
    *   Audit `cleanNum` edge cases in the UI (Data Debugger sample view).
*   **The "Council" Workflow:** Initiate the first planning session for the "Life Admin Assistant" module using the Council of Three protocol.

5.  **The Future Vision: "The Useful Assistant Suite"**
    Beyond the current modules, Life.io is evolving into a collection of specialized, local-first AI assistants.
    *   **Core Principles:** Personal-First, Local-First/Privacy-Respecting, and Decision Simplification.
    *   **Planned Assistants:**
        *   **Life Admin Assistant:** Handles logistics (bills, insurance, warranties).
        *   **Knowledge Memory (RAG):** A personal knowledge base for notes, PDFs, and snippets.
        *   **Decision Journal:** Tracks decisions and context to improve judgment quality.
        *   **Goal Decomposition:** Converts high-level goals into realistic weekly plans.
        *   **Home/Asset Manager:** Maintenance schedules and repair histories.

---

**Life.io Architectural Strategy: The Dual-Path**
_(No changes to this section)_