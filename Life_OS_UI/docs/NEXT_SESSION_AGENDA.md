# Session Agenda: The Great Audit & Future Planning

**Goal:** Establish a pristine baseline for the "Life.io SaaS" era. We will ruthlessly audit our code, design, and architecture to ensure they match our high-level ambitions.

## 1. 🔭 High-Level Alignment (The Vision Check)
*   **Narrative Consistency:** Does the "Landing Page" promise match the "Dashboard" reality?
*   **Monetization Logic:** Are the "Pro" gates placed logically? Do they feel like "value-adds" or "punishments"?
*   **The Viral Loop:** How do we turn a "Gig Acceptance" notification into a frictionless onboarding for new DJs?
*   **The "A La Carte" Model:** How do we present the "App Store" of modules to a user? (Brainstorming the UI).

## 2. 🔬 Technical Scrutiny (The Codebase Audit)
*   **File Organization:**
    *   Are components strictly strictly domain-scoped? (e.g., `src/components/Finance` vs `src/components/Shared`).
    *   Identify and delete "Dead Code" (Legacy CSV parsers, unused utils).
*   **Dependency Audit:**
    *   Review `package.json` for unused libraries.
    *   Standardize imports (Absolute vs Relative paths).
*   **Testing Gaps:**
    *   We have "Safety Net" unit tests. Do we need Integration Tests for the *entire* Money Map flow?
    *   Verify "God Mode" works in all edge cases.
*   **API Security:**
    *   Verify `userId` injection is foolproof in `tillerService` and `social_engine`.
    *   Plan for `Helmet` and Rate Limiting (Express).

## 3. 🎨 UX & Design Audit (The "Feel" Check)
*   **Visual Consistency:**
    *   Are we using CSS Variables (`--primary-color`) everywhere?
    *   Do buttons and inputs have consistent states (hover, active, disabled)?
*   **Responsiveness:**
    *   Does the `PaymentFlow` (Visualizer) break on mobile?
    *   Is the Navbar toggle usable on touch screens?
*   **Onboarding Flow:**
    *   Simulate a "New User" (Empty State). Is it friendly or empty/broken?

## 4. 🛠️ Tooling & Infrastructure
*   **Linting & Formatting:**
    *   Configure `Prettier` to run on save.
    *   Stricter ESLint rules for `unused-vars` and `console.log` (except in Logger).
*   **CI/CD Prep:**
    *   Draft a GitHub Actions workflow for automated testing on PRs.
*   **Documentation:**
    *   Generate a fresh AppMap.
    *   Update `README.md` for public consumption.

## 5. 🎓 Life.io Academy (The "Bootcamp")
*   **Goal:** Create a "Golden Path" tutorial for new contributors.
*   **Concept:** "The Pet Tracker Project" - A guided walkthrough where a new dev builds a full-stack module (Model -> API -> UI) to learn the patterns.
*   **Deliverable:** A `docs/BOOTCAMP` directory with step-by-step guides (`01_SETUP.md`, `02_HELLO_WORLD.md`) and architectural diagrams.

## 6. 🎥 The Content Factory (New Mission)
*   **Review:** `docs/MISSION_CONTENT_CREATION.md`.
*   **Discuss:** The "Science of Attention" findings (`LifeVault/Project Documentation/Research/Science_of_Attention.md`).
*   **Plan:** Scoping the `ContentScheduler` widget for Social Hub.

## 7. 🎧 The Enterprise Flywheel & Booking Agent Spike
*   **Concept:** Adapting the Vendor Orchestrator for DJ Booking Agents and Bar Managers.
*   **The Connectivity Engine:**
    *   **Global Calendar Sync:** Seamlessly sync gigs across Bar Managers, Booking Agents, and DJs.
    *   **Double-Booking Alerts:** Real-time conflict detection during the booking process.
    *   **Gig Acceptance Workflow:** A secure, "No-Install" mobile web view for DJs to accept gigs and sync to their personal calendars instantly.
*   **The Viral Growth Spike:**
    *   **Child Entitlements:** Provision "Lite" accounts for DJs under a Bar Manager's Enterprise subscription.
    *   **Referral Incentives:** Prototype the "Refer-a-Bar" and "Refer-a-DJ" credit systems (e.g., free months of Pro).
*   **Venue Profiles:** Store specific needs per restaurant (e.g., "Restaurant A").
*   **Financials:** Automated invoice generation upon gig completion (Email intake via n8n).
*   **Taste Profile:** `Genre Rankings` (5-star system for genre presence in setlists).

---
**Preparation for Next Session:**
*   **Direct Connect Spike (Critical):** Research Teller.io/Plaid pay-as-you-go implementation to replace manual Tiller uploads.
*   Review this list and prioritize the "Top 3" blockers.
*   Come ready to delete code. Less code = Less bugs.