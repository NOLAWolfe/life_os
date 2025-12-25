# Mission: The Great Account Categorization

The `BalancesWidget` currently shows a list of names and numbers, but it doesn't distinguish between a Credit Card debt and a Checking Account asset. Your mission is to implement a categorization system that visually separates these "Account Types."

## 📋 Task List

- [ ] **Step 1: The Data Archaeology**
    - Open `src/services/tillerService.js` and find `processAccountsData`.
    - Observe how it maps the `type` property.
    - **Hint:** Look at the raw `public/Accounts.csv`. Does the column named "Type" actually contain consistent values like "Credit Card" or "Savings"? Or is it messy?

- [ ] **Step 2: Normalization Logic**
    - In `tillerService.js`, you'll likely need to "Clean" the incoming types.
    - **Hint:** If the CSV says "CREDIT CARD" and another row says "cc", you want them both to be "Credit Card". Where would you add a `.toLowerCase()` or a mapping object to fix this?

- [ ] **Step 3: The UI Badge (HTML/JSX)**
    - Open `src/components/BalancesWidget/BalancesWidget.jsx`.
    - Inside the `accounts.map()`, add a new `<span>` or `<div>` to display the `account.type`.
    - **Hint:** Don't just show the text—wrap it in a tag so you can style it in the next step.

- [ ] **Step 4: The Tailwind Struggle (Styling)**
    - Apply Tailwind classes to your new "Type" badge.
    - **Challenge:** Can you make the background color change based on the type?
    - **Hint:** Think about using a helper function or a template literal in the `className`: ``className={`badge ${account.type === 'Credit Card' ? 'bg-red-500' : 'bg-green-500'}`}``.
    - _Wait!_ You're using Tailwind now. Use classes like `px-2 py-1 rounded text-xs font-bold`.

- [ ] **Step 5: The Layout Pivot (Flex/Grid)**
    - The balances list is currently a simple list.
    - **Task:** Make the account name and the type badge sit side-by-side, but keep the balance on the far right.
    - **Hint:** You'll want to use `flex` and `justify-between` on the `<li>`. You might need a wrapper `div` for the Name + Badge combo to keep them together on the left.

- [ ] **Step 6: Grouping (Expert Level - Optional)**
    - Instead of one long list, can you group accounts by type? (e.g., "Assets" header, then "Liabilities" header).
    - **Hint:** This might require using `Object.groupBy()` or a `.reduce()` in your `BalancesWidget.jsx` before you start `.map()`-ing.

## 💡 Breadcrumbs

- **Tailwind Docs:** Look up "Flexbox" and "Background Color."
- **JS Tip:** `account.type?.toLowerCase()` is your friend to prevent "Undefined" crashes.
- **CSS Variable Warning:** Remember that `BalancesWidget.css` still exists! If your Tailwind classes aren't working, check if an old CSS rule is "fighting" them with higher specificity.
