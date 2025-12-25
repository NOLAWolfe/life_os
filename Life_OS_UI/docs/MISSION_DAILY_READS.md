# Mission: The Daily Reads Manager (New Feature)

You want to track your personal reading goals. This mission requires you to "lay the bricks" of a new feature from scratch before we wire it up to any AI or complex services.

## 📋 Task List

- [ ] **Step 1: Scaffolding (The Leg Work)**
    - Create a new folder: `src/components/DailyReads/`.
    - Create two files: `DailyReads.jsx` and `DailyReads.css`.
    - **Hint:** Start with a "Hello World" component and import it into `LandingPage.jsx` so you can see it on the dashboard.

- [ ] **Step 2: Defining the Schema**
    - Decide what a "Daily Read" looks like in your state.
    - **Hint:** Does it have a `title`, `source` (Obsidian, Web, Book), `category`, and `timeSpent`? Initialize a small mock array in your state to test the layout.

- [ ] **Step 3: The Input Form**
    - Build a simple form with Tailwind to add a new "Read."
    - **Goal:** Use two inputs (Title and Source) and an "Add" button.
    - **Hint:** Remember `e.preventDefault()` in your form submission to keep the page from refreshing!

- [ ] **Step 4: The Grid Layout**
    - Display your reads as a grid of small "cards" instead of a list.
    - **Tailwind Hint:** Use `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4`.

- [ ] **Step 5: Obsidian Integration (Conceptual)**
    - Look at `src/components/ObsidianConnector/ObsidianConnector.jsx`.
    - **Investigation:** How does it fetch data?
    - **Hint:** Your goal for the future is to have "Daily Reads" automatically pull titles from an "Articles to Read" folder in Obsidian. For now, just add a button that says "Sync with Obsidian" (it doesn't have to work yet!).

## 💡 Breadcrumbs

- **Folder Structure:** Keep it consistent with `src/components/BalancesWidget/`, etc.
- **Tailwind:** Try `hover:scale-105 transition-transform` on your cards for that "Life.io" aesthetic feel.
- **State Management:** Since this is "Personal Goals," should this stay in the component or eventually move to a `GoalsContext`? (Start in the component for now).
