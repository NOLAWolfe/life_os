# Legal Spike: SaaS Liability & Compliance

**Context:** We are simulating an Enterprise SaaS environment. A Fitness/Health app carries inherent risk. We need to implement the "Legal Layer" to protect the platform.

## 1. The "Clickwrap" Agreement 🤝
*   **Definition:** A mandatory modal that prevents app usage until "I Agree" is clicked.
*   **Technical Implementation:**
    *   **Database:** `User.termsAcceptedAt` (DateTime).
    *   **Middleware:** Express middleware that checks `req.user.termsAccepted`.
    *   **Frontend:** `<LegalGate>` component (similar to `<FeatureGate>`).

## 2. Common Pitfalls & Clauses 🕳️
*   **Assumption of Risk:** "I understand exercise is dangerous."
*   **Medical Disclaimer:** "This app is not a doctor. Consult one before starting."
*   **Data Privacy (Health):**
    *   If we touch Apple Health data, we strictly *cannot* sell it (Apple Policy).
    *   We need a clear "Privacy Policy" linked in the store.

## 3. The "Waiver" Content
*   *Note: We are not lawyers, but we will draft a "Standard Template" for the simulation.*
*   **Key Sections:**
    1.  No Medical Advice.
    2.  Limitation of Liability (We aren't responsible if you drop a weight).
    3.  User Conduct (Don't be a jerk in the social features).

## 4. Action Plan for Next Session
1.  Add `termsAcceptedAt` to `User` schema.
2.  Build the `<LegalModal>` component.
3.  Draft the `TERMS_OF_SERVICE.md` file.
