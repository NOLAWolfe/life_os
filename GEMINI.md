# Life_OS Project Overview (Life.io)
Current Version: 2.0 (The Web Migration Phase)
User: Neauxla (Senior QA Automation Analyst, Musician, Entrepreneur)

1.  **The Vision: "Life.io"**
    Life.io is a unified, aesthetic web platform serving as a comprehensive "Operating System" for Neauxla's life. It bridges the gap between personal management (health, finance, creativity) and high-level professional productivity (QA automation, DevOps).
    Core Philosophy: "Stop using 5 different apps. Centralize Data. Automate Everything."

2.  **Technical Architecture (The Hybrid Stack)**
    To leverage existing Python strengths while modernizing the interface:
    *   **Frontend:** React (Vite) + Tailwind/Custom CSS (Squarespace/Wix aesthetic).
    *   **Backend Orchestrator:** Node.js/Express (Handles routing, auth, and light logic).
    *   **Data Services (Python):**
        *   **Finance Engine:** Existing Plaid scripts wrapped in an API (FastAPI/Flask) for portfolio analysis.
        *   **DevOps Engine:** Future Python modules for Azure DevOps interaction and AI processing.
    *   **Database:** (To be decided: JSON storage for now, moving to SQLite/PostgreSQL).

3.  **Project Roadmap & Modules**

    **A. Professional Hub (New: "The QA Co-Pilot")**
    *   **Status:** Planning
    *   A centralized workspace to interact with the day job (Azure DevOps) and streamline QA tasks.
    *   **ADO Integration:** Connect to Azure DevOps API to fetch User Stories and Bugs.
    *   **AI Analysis:** Summarize complex User Stories into concise "Testing Requirements."
    *   **Scenario Generator:** Generate Playwright Scenarios based on acceptance criteria.
    *   **Automation Stencils:** Generate boilerplate code for automation scripts based on the selected test scenarios.

    **B. Business & Finance (The Financial Dashboard)**
    *   **Status:** Live (Beta)
    *   **Current:** Python script (plaid-assistant) fetching data, cleaning it, and outputting JSON. React UI displays this data.
    *   **Next Steps:**
        *   Automate the Python script execution via the Node backend (remove manual CLI steps).
        *   Build "Cash Flow" and "Burn Rate" visualizations.

    **C. Creative & DJ World**
    *   **Status:** Refactoring
    *   **Current:** Node.js interactive assistant.
    *   **Pivot:** Switch Music API from Apple Music (High Cost) to Spotify API (Free Dev Tier) to validate features.
    *   **Next Steps:**
        *   Build the "Setlist Critic" Agent (Brutal feedback on Key/BPM flow).
        *   Create a "Wishlist" interface in the UI.

    **D. Health & Personal (The "Legacy" Migration)**
    *   **Status:** Legacy CLI -> Web Migration
    *   **Current:** Python CLI tools (workout_tracker.py, meal_planner.py).
    *   **Action:** These scripts are deprecated. Logic is being rewritten/migrated directly into the Node.js/React stack for better interactivity.
    *   **Goal:** A "Daily Briefing" dashboard showing today's workout and meal plan.

4.  **Visual Project Tracking**
    To manage this complexity, the project can use GitHub Projects (V2):
    *   **View:** Kanban Board.
    *   **Columns:** Backlog, Planned (Next Cycle), In Progress, Testing, Done.
    *   **Methodology:** Treating "Life.io" as a software product with version control and issue tracking.

5.  **Long-Term Business Potential**
    The "Professional Hub" represents a significant pivot toward a B2B or "Prosumer" tool.
    *   **Target Market:** Solopreneurs, QA Leads, and "Over-employed" tech workers.
    *   **Value Prop:** An AI assistant that doesn't just chat, but connects directly to enterprise tools (ADO, Jira, Plaid) to perform actual work.

---

**Life.io Architectural Strategy: The Dual-Path**

1.  **The Hierarchy**
    Life.io is the umbrella brand for a suite of AI-powered productivity tools. It shares a common "Core" (UI, AI Logic, Automation Engine) but produces two distinct products:

    *   **Product A: Life.io Personal (The "Life OS")**
        *   **Target:** Individuals, Solopreneurs, Creators.
        *   **Scope:** Broad & Holistic (Health, Wealth, Creativity).
        *   **Data Model:** Multi-tenant SaaS or Local Self-Hosted.
        *   **Security:** Standard Consumer Privacy.

    *   **Product B: Life.io Enterprise (The "QA Co-Pilot")**
        *   **Target:** Enterprise QA Teams, DevOps Leads.
        *   **Scope:** Deep & Narrow (ADO Integration, Test Generation, Automation).
        *   **Data Model:** Single-Tenant / On-Premise Container.
        *   **Security:** Enterprise-Grade (SOC2 ready, Zero-Data Retention).

2.  **Development Phase: The "Neauxla Hybrid"**
    *   **Current State:** Developing as a Monorepo.
    *   **Strategy:** The user (Neauxla) acts as the "Client Zero." He runs a hybrid instance that mounts both the Personal Modules and the Enterprise Modules locally.
    *   **Strict Separation:** Code for interacting with Azure DevOps is kept in isolated services (/services/qa-engine) to ensure it can be packaged independently for future B2B sales without dragging along personal finance or music logic.

3.  **Enterprise Integration Logic**
    *   **Connection:** Uses a Local Agent model. The software connects to ADO via user-supplied Personal Access Tokens (PAT) stored locally or via Enterprise SSO (Azure AD).
    *   **Data Flow:** No proprietary code is stored on Life.io servers. The AI processes data in-stream and returns results to the user's secure interface.