# Life_OS Project Overview (Life.io)
Current Version: 2.1 (The Dashboard & Data Pipeline Phase)
User: Neauxla (Senior QA Automation Analyst, Musician, Entrepreneur)

## **CURRENT STATUS (as of Dec 18, 2025)**
The project has evolved into a robust financial management and personal productivity suite. The focus this session was on a deep-dive implementation of debt analysis and unifying the financial data pipeline.

1.  **The Vision: "Life.io"**
    Life.io is a unified, aesthetic web platform serving as a comprehensive "Operating System" for Neauxla's life. It bridges the gap between personal management (health, finance, creativity) and high-level professional productivity (QA automation, DevOps).
    Core Philosophy: "Stop using 5 different apps. Centralize Data. Automate Everything."

2.  **The Landing Page: A Central Dashboard**
    The landing page is now a data-driven hub.
    *   **Status:** Live (Phase 1+)
    *   **Current:** Featuring a live calendar widget, an account balances widget, and the new **Small Win Widget**.
    *   **Small Win Widget:** Dynamically identifies the next debt priority and provides actionable weekly payment tasks based on the user's "Active Plan".

3.  **Project Roadmap & Modules**

    **A. Professional Hub ("The QA Co-Pilot")**
    *   **Status:** In Progress (Mock AI)
    *   **Current:** A dedicated page in the UI fetches mock User Stories and Bugs from a mock `adoService`. 

    **B. Business & Finance (The Financial Assistant)**
    *   **Status:** In Progress (Advanced Analytics)
    *   **Debt Payoff Planner:** A comprehensive tool supporting **Avalanche**, **Snowball**, and **Hybrid** strategies.
        *   **Empathetic Analysis:** Handles predatory loan structures (e.g., Student Loans) with "Strategic Notes" rather than harsh errors.
        *   **Contextual Alerts:** Incorporates net income ($5k/mo baseline) to flag unrealistic debt-to-income payment requirements.
    *   **Unified Data Pipeline:**
        *   **Multi-CSV Support:** Ingests `Accounts`, `Balances`, `Transactions`, `Categories`, and `Debt Payoff` CSVs.
        *   **Auto-Load Feature:** The app now automatically loads and parses these CSVs from the `public/` folder on startup for a seamless "Simple Working State."
    *   **UI/UX:** Modernized with theme variables supporting light/dark mode and resilient error handling for malformed data.

    **C. Creative & DJ World**
    *   **Status:** In Progress (Mock API)

    **D. Health & Personal (The "Legacy" Migration)**
    *   **Status:** Completed (Phase 1)
    *   **Current:** Interactive `WorkoutTracker` and `MealPlanner` integrated with a Node.js/Express backend.

4.  **The Future Vision: "The Useful Assistant Suite"**
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
