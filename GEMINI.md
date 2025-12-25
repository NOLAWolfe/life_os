# Life_OS Project Overview (Life.io)
Current Version: 2.2 (The Financial Command Center)
User: Neauxla (Senior QA Automation Analyst, Musician, Entrepreneur)

## **CURRENT STATUS (as of Dec 23, 2025)**
The project has evolved into **The Enterprise Simulation**. We have successfully transitioned from a personal dashboard to a multi-tenant SaaS architecture with strict separation of concerns.

1.  **The SaaS Architecture (Live)**
    *   **Storefront Separation:** Public Marketing Site (`/`) vs. Private Dashboard (`/app`).
    *   **Identity Engine:** `UserContext` with Guest/Free/Pro tiers and "God Mode" administration.
    *   **The Paywall:** Feature Gating implemented for "Income Streams", "Leak Detector", and "Debt Planner".

2.  **The Household Commander (Meal Planner 2.0)**
    *   **Dual-Profile Engine:** Manages separate dietary tracks (Performance vs. Medical) with a unified grocery output.
    *   **Backend:** Dedicated `life_admin` engine (SQLite/Prisma) replaces legacy APIs.

3.  **Operation Bedrock (Hardened Foundation)**
    *   **Safety Net:** 10/10 System Health Check (including Live Server Smoke Test).
    *   **Logic Core:** Financial logic (Side Hustles, Lateral Transfers) ported to Backend and Unit Tested.
    *   **Clean Slate:** Legacy CSV parsers purged.

---

**Next Session Mission: Alpha Launch & Real Data**
1.  **SportsDB Integration:** Replace mock data in Bar Manager with live API feed.
2.  **n8n Setup:** Provision the invoice email intake workflow.
3.  **App Store Spike:** Initial Capacitor setup for mobile wrapper.

---

**Current Status: Enterprise & SaaS Transformation**
**STATUS: ALPHA READINESS (Dec 23, 2025)**
The system has completed its pivot into a multi-tenant business suite.

**New Features (Live):**
*   **Business Hub:** Tabbed ERP for Operations (Invoices, CRM, Forecasting) and Creative tools.
*   **Bar Manager:** Multi-location forecasting with printable staff sheets.
*   **Invoice Command Center:** Automated review queue and source tracking (Email/Manual).
*   **CI/CD:** GitHub Actions enabled for automated quality checks.

---

**Next Session Mission: The Great Audit & Planning**
*   **Objective:** Scrutinize the codebase for "Broken Windows," consolidate UX, and plan the technical roadmap.
*   **Agenda:** See `docs/NEXT_SESSION_AGENDA.md`.

---

**Life.io Architectural Strategy: The Dual-Path**

1.  **Phase 1: The Storefront Separation**
    *   **Public Face:** `/` is now the Marketing Site.
    *   **Private App:** `/app` is the Dashboard.
    *   **Routing:** Fully bifurcated with verified smoke tests.

2.  **Phase 2: The Identity Engine**
    *   **UserContext:** Manages `guest`, `free`, `pro`, `admin` tiers.
    *   **God Mode:** Triple-click Logo to toggle identities instantly.
    *   **Isolation:** `userId` injected into API calls.

3.  **Phase 3: The Paywall**
    *   **Gatekeeper:** `<FeatureGate>` component implemented.
    *   **Demo:** "Income Streams" widget is now gated for PRO users.

---

**Future Roadmap: DJ Assistant Expansion**
*   **Module 1: Content Factory:** "No-Design" Flyer Bot & Audio-to-Video Promo Generator.
*   **Module 2: Crate Digger:** Apple Music -> "To Buy" List pipeline.
*   **Module 3: Admin Ops:** Automated PDF Invoicing to replace manual templates.

---

**Life.io Architectural Strategy: The Dual-Path**
*   **Module 1: Content Factory:** "No-Design" Flyer Bot & Audio-to-Video Promo Generator.
*   **Module 2: Crate Digger:** Apple Music -> "To Buy" List pipeline.
*   **Module 3: Admin Ops:** Automated PDF Invoicing to replace manual templates.

---

**Life.io Architectural Strategy: The Dual-Path**
_(No changes to this section)_