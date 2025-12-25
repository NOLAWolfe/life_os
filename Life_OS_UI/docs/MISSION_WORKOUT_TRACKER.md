# Mission: The "Spotter" (Workout Tracker 2.0)

**Goal:** A mobile-first, friction-free workout companion that manages the thinking so the user can focus on the lifting.

## 📱 Mobile-First Design Philosophy
*   **Context:** Used with sweaty hands, in a gym, between sets.
*   **UI Rules:**
    *   **Thumb Zone:** All primary actions (Next Set, Log Reps) within bottom-right reach.
    *   **No Typing:** Use +/- steppers and sliders. Typing is for rest days.
    *   **Dark Mode Default:** Saves battery, looks pro.

## 🚀 Feature Roadmap

### 1. The "Auto-Pilot" Routine ✈️
*   **Pre-Flight:** Select routine (e.g., "Push Day").
*   **In-Flight:** App guides one exercise at a time.
*   **History:** Shows "Last time you did 12 reps @ 50lbs" right next to the input.

### 2. The Form Checker (Visual Aids) 👁️
*   **Integration:** Local GIF/Video library or YouTube embed.
*   **Trigger:** "How do I do this?" button reveals a 5-second loop of perfect form.

### 3. Apple Ecosystem Integration 🍎
*   **Music:** "Power Song" button (Apple Music API) to trigger high-BPM tracks for PR attempts.
*   **Health:** 
    *   **Read:** Pull Heart Rate/Active Energy.
    *   **Write:** Close the "Move" ring upon workout completion.

### 4. Consistency & Gamification 🏆
*   **Streak Tracker:** "Don't break the chain."
*   **PR Confetti:** Visual celebration when a new 1RM is logged.

## 🛡️ Legal & Safety (The Liability Layer)
*   **Requirement:** Users must acknowledge physical risks.
*   **Implementation:** 
    *   **Terms of Service (ToS):** Global app rules.
    *   **Health Waiver:** Specific "Assumption of Risk" clause for fitness.
    *   **Mechanism:** "Clickwrap" modal on first `UserContext` initialization (if `!user.acceptedTerms`).
