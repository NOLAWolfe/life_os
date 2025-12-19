# Session Update: Dec 18, 2025
## Mission: Wealth Creation (The 10X Pivot)

### 1. "Offense" Implementation
- **Income Streams Widget:** Added to Financial Dashboard. Automatically parses `Transactions.csv` to calculate total income and visualize streams (e.g., Paycheck, Side Hustle).
- **10X Targets Widget:** Added to Landing Page. Calculates "Annual Run Rate" dynamically based on the date range of uploaded transactions and visualizes progress toward a $1M Moonshot goal.
- **Wealth Mentor:** Added to Landing Page. Provides daily "Rules of Wealth" and 10X action steps.

### 2. Smart Financial Logic (The Pipeline)
- **Cash Flow Analysis:** Updated `tillerService.js` to calculate Monthly Income, Expenses, and Surplus based on exact transaction history (not just assuming 1 month).
- **Surplus-Based Recommendations:** `SmallWinWidget` now recommends debt payments based on *actual* monthly surplus (50% of surplus) rather than a static "$50 extra".
- **PII & Side Hustle Protection:** 
    - Implemented `.env` protection for User Names (`VITE_USER_NAME`).
    - Added logic to ignore self-transfers (Zelle) from income calculations.
    - Added "Smart Categorizer" to auto-tag Cash App/Venmo deposits in Navy Federal accounts as "**DJ Business / Side Hustle**".

### 3. Interactive Roadmap (Operating System)
- **TodoTracker Upgrade:** Converted the static roadmap into an interactive checklist.
- **Persistence:** Progress is now saved to `localStorage`.
- **UI Polish:** Added progress bars and collapsible "Add Task" inputs for dynamic roadmap management.
- **Daily Reads:** Added collapsible "Add Book" form.

### 4. Codebase Hygiene
- **Casing Fix:** Corrected import paths for `TodoTracker` to ensure cross-platform compatibility.
- **Tailwind Integration:** Continued migration of component styling to Tailwind utility classes where appropriate.

## Next Steps
- **The Hottest Dollar:** Deep dive into this capital allocation strategy.
- **Meal Planner Macros:** Add calorie/macro tracking to the Health Hub.

# Session Update: Dec 18, 2025 (Documentation Sync)
## Mission: Context Alignment

### 1. Documentation Infrastructure
- **Life_OS_UI/GEMINI.md:** Created a new module-level context file for the UI project. This provides a direct landing spot for the assistant to understand the React tech stack, services, and conventions without needing to scan the whole root project.
- **Root GEMINI.md Update:** Integrated the "Useful Assistant Suite" vision from `ADDITIONAL_ASSISTANT_CONCEPTS.md`.
- **Roadmap Alignment:** Acknowledged the shift toward a collection of specialized, local-first assistants (Life Admin, Knowledge Memory, etc.).

# Next Session Strategy: The "Weekly Ops" & Meal Planner
**Date:** Tomorrow Morning
**Focus:** Dual-Track Nutrition & Systemizing the Week

## Context
User requires a robust **Meal Planner** capable of handling two distinct diets:
1.  **User:** High Protein / Performance.
2.  **Partner:** Pre-gestational diabetes management (Scientific/Medical constraints).

## Battle Plan (To-Dos)
1.  **Dual-Profile Refactor:** Update `MealPlanner.jsx` to handle distinct "User" and "Partner" meal tracks.
2.  **Nutrition Guardrails:** Create `nutrition_rules.json` to enforce constraints (e.g., Glycemic Load, Protein minimums).
3.  **Unified Grocery Logic:** Implement logic to merge two distinct meal plans into a single, categorized shopping list.
4.  **The "Weekly Reset" System:**
    *   Create a "Weekly Template" for recurring tasks (Meal Prep, Bill Assess, Content Roadmap).
    *   Avoid Google Calendar for now; focus on a high-utility local "Week at a Glance."
