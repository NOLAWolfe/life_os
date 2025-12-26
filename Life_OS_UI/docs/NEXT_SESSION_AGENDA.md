# Session Agenda: Design Systems & Memory Orchestration

**Goal:** Bridge the gap between code and design intuition while finalizing our toolchain.

## 1. 🎨 Tailwind & Design Tokens (Top Priority)
*   **v4 Integration:** Use the `@theme` directive in `index.css` to map our "Enterprise" variables (`--bg-card`, etc) to Tailwind utility classes.
*   **The Goal:** Writing `className="bg-card text-primary"` should automatically handle Light/Dark mode without custom CSS files.

## 2. 🧠 Mem0 MCP Setup
*   **Persistent Context:** Configure Mem0 to store our architectural decisions, design rules, and project milestones.
*   **Design Memory:** Teach the agent our specific palette and spacing rules so it never builds "off-brand" components again.

## 3. 🛠️ MCP General Config Audit
*   **Sync & Health:** Audit the configurations for all active MCP servers (Google Sheets, GitHub, Memory).
*   **Permissions:** Ensure the agent has the necessary "write" access for the next phase of automation.

## 4. 🚀 feature: The Enterprise Flywheel (Booking Agent Spike)
*   **Concept:** Adapting the Vendor Orchestrator for DJ Booking Agents and Bar Managers.
*   **Connectivity Engine:** Prototype the Global Calendar Sync and conflict detection logic.

## 5. 🏗️ Architectural Audit (The "Council" Review)
*   **Dead Code:** Remove the now-unused `scripts/verify_data.js` if redundant.
*   **Standards:** Verify all new `ContentFactory` logic follows the `AppError` contract.