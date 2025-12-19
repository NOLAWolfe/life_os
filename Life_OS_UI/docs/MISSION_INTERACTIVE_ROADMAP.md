# Mission: Interactive Roadmap (Current Status)

The `TodoTracker` component is currently a "Read-Only" roadmap. To make Life.io feel like a real OS, we need to turn these static items into an interactive checklist that saves your progress.

## 📋 Task List

- [ ] **Step 1: State Transformation**
    - Open `src/components/TodoTracker/TodoTracker.jsx`.
    - Replace the static `modules` array with a React `useState` hook.
    - **Hint:** You'll need to transform the data structure so each todo has a `completed: boolean` property.

- [ ] **Step 2: The Interactive Checkbox**
    - Inside the `.map()` function for todos, add an `<input type="checkbox">`.
    - **Hint:** Connect the `checked` attribute to your new state and create an `onChange` handler that toggles the boolean.

- [ ] **Step 3: Visual Feedback (Tailwind Styling)**
    - When a todo is checked, the text should change (e.g., strikethrough, lower opacity).
    - **Hint:** Use a conditional Tailwind class like `className={`${todo.completed ? 'line-through opacity-50' : ''}`}`.

- [ ] **Step 4: Persistence (Local Storage)**
    - Use a `useEffect` hook to save the todos to `localStorage` whenever they change.
    - **Hint:** Don't forget to initialize your `useState` by checking `localStorage` first!

- [ ] **Step 5: Dynamic Progress Bar (Aesthetic Level-Up)**
    - Add a progress bar to each "Module Card" showing the percentage of tasks completed.
    - **Hint:** Calculate `(completedTodos / totalTodos) * 100` and use a Tailwind `div` with a dynamic width: `style={{ width: `${percent}%` }}`.

## 💡 Breadcrumbs
- **React Hook:** `useState(() => JSON.parse(localStorage.getItem('roadmap')) || initialData)`.
- **Flexbox Hell Warning:** If you put the checkbox next to the text, use `flex items-center gap-2` to keep them aligned.
