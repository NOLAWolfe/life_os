# Alpha Launch Plan: The Road to First Customer

**Target Date:** ASAP
**Objective:** Secure **1 Paying Business Hub Client ($49.99/mo)**.
_Why?_ One Bar Manager covers 100% of our initial infrastructure costs, allowing the Personal Finance tier to remain "Free" for growth.

## 1. The Critical Path (Must-Have for Alpha)

These features must be bug-free and fully functional.

### A. Business Hub (The Profit Engine)

- [ ] **Bar Manager (Forecasting):**
    - [x] Calendar Date Picker (Implemented).
    - [ ] **Data Feed:** Replace Mock Data with `TheSportsDB` (Free Tier) or a robust scraper.
    - [ ] **Export:** Implement "Print to PDF" for daily staff sheets.
- [ ] **Invoice Manager:**
    - [ ] **Smart Inbox:** Setup `n8n` workflow (Email -> PDF -> Data).
    - [ ] **Upload:** Add "Manual Upload" button in UI.
    - [ ] **Approval Flow:** "Approve" button must trigger a final status change (Visual only for now).
- [ ] **Client Manager:**
    - [ ] Ensure "Add Client" persists to SQLite DB.

### B. Personal Dashboard (The Growth Engine)

- [ ] **Wealth Creation:**
    - [ ] **Passive Roadmap:** Ensure the "Strategy" tab correctly reflects the 7 streams.
- [ ] **Finance:**
    - [ ] **Transactions:** Verify Tiller import still works after recent refactors.

## 2. Technical Debt & Cleanup (The Polish)

- [ ] **Remove Placeholders:** Delete `KateTodoList` (Legacy) if unused.
- [ ] **Validation:** Add Zod schemas to `clientService.js` and `invoiceService.js`.
- [ ] **Testing:**
    - [ ] **CI/CD:** Activate GitHub Actions (Lint + Test).
    - [ ] **Smoke Tests:** Add Playwright tests for `BusinessHubPage`.

## 3. Infrastructure & Deployment (The Bootstrapper Stack)

- [ ] **Environment Strategy:**
    - **Dev:** Localhost + SQLite.
    - **Staging:** Vercel (Preview Branch) + Railway DB (Test).
    - **Prod:** Vercel (Main) + Railway DB (Prod).
- [ ] **Mobile:**
    - [ ] Verify PWA Installability (Manifest.json check).

## 4. The "Nice to Haves" (Post-Alpha)

- [ ] **DJ Booking Agent Expansion:**
    - [ ] Venue Profile Engine (Pay, Times, Genre Preferences).
    - [ ] Matchmaking Logic (DJ style vs Venue rankings).
- [ ] **Crate Digger:** Apple Music integration.
- [ ] **Health Hub:** Full integration with Apple Health.
- [ ] **App Store:** Capacitor wrapper implementation.
