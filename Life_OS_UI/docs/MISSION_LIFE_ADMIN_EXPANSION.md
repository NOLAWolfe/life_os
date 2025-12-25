# Mission: Life Admin Expansion (The "A La Carte" OS)

## 🎯 Strategic Objective

Transition Life.io from a fixed dashboard to a modular "Operating System" where users can enable/disable specialized assistants based on their lifestyle needs.

## 📦 Proposed Modules (The "App Store" Phase)

### 1. 💊 The Med Bay (Health & Insurance)

- **Target:** People managing complex medical histories or multiple insurance policies.
- **Features:**
    - **Policy Wallet:** Encrypted storage for Plan IDs and Coverage details.
    - **Vax/Checkup Log:** "Last physical: June 2024".
    - **Medication Sync:** (Future) Integration with pharmacies.

### 2. 🧸 The Kid Command Center (Parenting)

- **Target:** Parents managing the "mental load" of growing children.
- **Features:**
    - **The Size Tracker:** Shoe/Shirt sizes updated quarterly (crucial for gift-giving).
    - **The Gift Locker:** Year-round wish-list tracker for birthdays and holidays.
    - **Activity Radar:** Aggregated view of practices, games, and school events.

### 3. 🏠 The Asset Ledger (Home & Vehicle)

- **Target:** Homeowners and car owners wanting to preserve resale value.
- **Features:**
    - **Maintenance Heartbeat:** Reminders for HVAC filters, oil changes, and smoke alarm batteries.
    - **Warranty Vault:** Serial numbers and purchase dates for major appliances.

### 4. 🎁 The Event Horizon (Social CRM)

- **Target:** Busy professionals who want to stay thoughtful.
- **Features:**
    - **Relationship Timeline:** Birthdays, anniversaries, and notable milestones.
    - **Gift History:** Tracking what was given to whom to avoid repetition.

## 🛠️ Technical Infrastructure (Layer 3)

### A. The Module Manager

- **Settings UI:** A "Toggle" interface to enable/disable modules.
- **Dynamic Navbar:** Navigation links are rendered conditionally based on `user.activeModules`.

### B. User Profile (Industry Standard)

- **Schema:** Expanding the `User` model to include `phone`, `address`, and `subscriptionTier`.
- **Preference Persistence:** Saving UI state (Theme, Module Visibility) to SQLite.

## 💰 Monetization Vectors

- **Tier 1 (Free):** Financial Dashboard + 1 Life Module.
- **Tier 2 (Pro):** All Life Modules + AI Insights + Data Exports.
- **Tier 3 (Family/Enterprise):** Multi-user sync and collaborative planning.

---

**Status:** Brainstorming / Planning
**Next Step:** Prototype the `Settings` page and the `Module Manager` logic.
