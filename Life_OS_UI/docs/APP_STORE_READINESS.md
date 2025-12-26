# App Store Readiness Strategy: The "Wrapper" Defense

**Objective:** Successfully deploy Life.io to the Apple App Store by exceeding "Minimum Functionality" requirements (Guideline 4.2) and ensuring a native-grade experience.

## 1. The Challenge: "Guideline 4.2" 🚧
Apple rejects apps that are:
*   "Simply web clippings, content aggregators, or a collection of links."
*   "Apps that provide the same experience as a mobile website."

**The Fix:** The app must do things the website *cannot* do easily. It needs "Native DNA."

## 2. The "Native DNA" Features 🧬
To pass inspection, we will implement these specific native bridges (using Capacitor/Cordova):

### A. Hardware Integration (The "Golden Ticket")
*   **HealthKit (High Priority):** Deep integration for the Workout Tracker. Reading steps/heart rate is a valid "App" feature.
*   **Haptics:** Vibration feedback when checking off a To-Do or completing a workout set.
*   **Camera:** Scanning receipts for the Finance module or taking photos of "Small Wins."
*   **Biometrics:** FaceID/TouchID for "Bank Grade" login (even if the backend is simple).

### B. "App-Like" UX (User Requests)
*   **Moveable Widgets:** A grid system (like iOS home screen) for the Dashboard. This feels distinctly "Appy" vs. a static web page.
*   **Tool Store:** An in-app catalog to enable/disable modules (Finance, DJ, Health).
    *   *Why it helps:* It shows "Configuration" and "Personalization," not just static content.
*   **Offline Mode:** The app *must* load something when airplane mode is on.
    *   *Strategy:* Cache the last known Dashboard state and allow "Read-Only" access to offline data.

### C. The "Help Wiki"
*   A native-feeling overlay for documentation, rather than opening a Safari browser window.

## 3. Compliance & Policy Checklist 📋

### Data & Privacy
*   **Health Data:** If we touch HealthKit, we generally *cannot* use that data for advertising.
*   **Account Deletion:** **Mandatory.** There must be a button inside the app to completely delete the user's account and data. (Apple Rule 5.1.1).
*   **Privacy Policy:** Must be accessible from the App Store page and within the app.

### Monetization (The "30% Tax" Zone)
*   **Reader App Rule:** Since we are a SaaS, we can potentially let users sign up on the web and just "login" on the app.
*   **No "Sign Up" Links:** We cannot link directly to a Stripe checkout page from the app. It's safer to have "Login" and "Contact Admin" for upgrades, or use In-App Purchases (IAP) if we want to avoid friction (but pay 30%).

## 4. Technical Spike: Capacitor vs. React Native
*   **Current Path:** Capacitor (Web Wrapper + Native Plugins).
    *   *Pros:* Reuses 100% of current React code.
    *   *Cons:* Performance tuning is critical.
    *   *Verdict:* Stick with Capacitor for now, but heavily utilize plugins for the "Native DNA" features.

## 5. Action Plan (Pre-Submission)
1.  **Biometrics Spike:** Implement `capacitor-native-biometric` for login.
2.  **Offline Strategy:** Configure Vite PWA plugin or TanStack Query persistence.
3.  **Account Deletion Flow:** Build the backend endpoint and UI button.
4.  **HealthKit Hook:** Spike the read connection for the Workout module.
