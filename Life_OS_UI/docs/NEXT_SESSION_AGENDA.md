# Session Agenda: The Great Audit & Future Planning

**Goal:** Establish a pristine baseline for the "Life.io SaaS" era. We will ruthlessly audit our code, design, and architecture to ensure they match our high-level ambitions.

## 1. 🔭 High-Level Alignment (The Vision Check)
*   **Narrative Consistency:** Does the "Landing Page" promise match the "Dashboard" reality?
*   **Monetization Logic:** Are the "Pro" gates placed logically? Do they feel like "value-adds" or "punishments"?
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

---
**Preparation for Next Session:**
*   Review this list and prioritize the "Top 3" blockers.
*   Come ready to delete code. Less code = Less bugs.
