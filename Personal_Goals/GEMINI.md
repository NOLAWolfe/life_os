# Personal_Goals Project Overview

This directory (`Personal_Goals`) is a core component of the "Life.io" project, designed as a suite of personal management and tracking tools. It's a **Code Project** built primarily with Python scripts and local JSON files for data persistence. The goal is to provide modular command-line interfaces for various aspects of personal development and daily life management, with an eventual vision for integration into a unified "Life.io" dashboard.

## Key Components:

1.  **Content Idea Generator:**
    *   **Files:** `content_data.json`, `content_idea_generator.py`
    *   **Purpose:** Manages a list of topics and generates content ideas based on predefined templates and keywords. `content_data.json` is reserved for future use with a content creator assistant.
    *   **Data Structure (`content_data.json`):**
        ```json
        {
          "topics": [],
          "saved_ideas": []
        }
        ```

2.  **Daily Reads / Learning Tracker:**
    *   **Files:** `daily_reads.json`, `daily_reads_manager.py`
    *   **Purpose:** Tracks progress on books, certifications, articles, and motivational quotes. Designed to be a backend for a "Daily Reads" widget on the Life.io dashboard.
    *   **Data Structure (`daily_reads.json`):**
        ```json
        {
          "reading_items": [
            {
              "id": 1,
              "type": "book",
              "title": "Example Book Title",
              "author": "Author Name",
              "link": "https://example.com/book",
              "progress_unit": "Chapter",
              "current_progress": 5,
              "total_progress": 12,
              "status": "in progress",
              "tags": ["personal_growth", "reading"],
              "last_updated": "YYYY-MM-DD"
            }
            // ... other types: certification, article, quote
          ]
        }
        ```

3.  **Meal Planning:**
    *   **Files:** `meal_data.json`, `meal_planner.py`
    *   **Purpose:** Manages recipes, generates weekly meal plans, and creates shopping lists.
    *   **Data Structure (`meal_data.json`):**
        ```json
        {
          "recipes": {
            "Recipe Name": { "ingredients": ["Ingredient 1", "Ingredient 2"] }
          },
          "current_plan": [
            { "day": 1, "meal": "Recipe Name" }
          ]
        }
        ```

4.  **To-Do List:**
    *   **Files:** `pgoals_todo.json`
    *   **Purpose:** (Inferred) Likely a simple system for managing personal to-do tasks. (Details to be confirmed upon deeper inspection).

5.  **Skill Tracking:**
    *   **Files:** `skill_tracker.json`, `skills.py`
    *   **Purpose:** (Inferred) For tracking and managing personal skills and development progress. (Details to be confirmed upon deeper inspection).

6.  **Workout Tracking:**
    *   **Files:** `workout_data.json`, `workout_tracker.py`
    *   **Purpose:** (Inferred) For managing workout routines, exercises, and tracking fitness data. (Details to be confirmed upon deeper inspection).

## Building and Running:

All Python scripts (`*.py`) in this directory are designed to be executed directly from the command line using `python3`. They utilize the `argparse` module for command and argument parsing.

**General Command Structure:**

```bash
python3 <script_name>.py <command> [arguments]
```

**Examples:**

*   **List daily reading items:**
    ```bash
    python3 daily_reads_manager.py list
    ```
*   **Add a recipe:**
    ```bash
    python3 meal_planner.py add-recipe "New Dish" --ingredients "Ingredient A, Ingredient B"
    ```
*   **Generate content ideas:**
    ```bash
    python3 content_idea_generator.py generate-ideas Fatherhood
    ```

## Development Conventions:

*   **Language:** Python 3.
*   **Data Storage:** JSON files (`.json`) are used for persistent data storage for each module.
*   **Interface:** Command-line interfaces (CLI) via `argparse`.
*   **Modularity:** Each personal goal area is encapsulated within its own script(s) and data file(s).
*   **File Paths:** Scripts typically locate their associated data files using `os.path.join(os.path.dirname(__file__), 'data_file.json')`.
*   **Error Handling:** Basic error handling is present (e.g., file not found, recipe already exists).

## Next Steps / Future Enhancements:

*   Integration with the broader "Life.io" React frontend for dashboard widgets.
*   API exposure for data access from frontend applications.
*   More sophisticated data management (e.g., database integration instead of flat JSON files for larger scale).
*   Enhanced functionality for individual modules (e.g., historical tracking, reminders, advanced filtering).
*   Development of the "content creator assistant" using `content_data.json`.


## Session Log (Dec 18, 2025)

*   **Financial Assistant:**
    *   Implemented Debt Payoff Planner with Avalanche, Snowball, and Hybrid strategies.
    *   Unified data pipeline to handle 5 different Tiller CSVs (Accounts, Balances, Transactions, Categories, Debt).
    *   Refined simulation logic to handle predatory loan structures empathetically (Student Loans).
    *   Added auto-loading of data from the `public/` folder for immediate troubleshooting and working state.
*   **UI/UX Modernization:**
    *   Centralized theme variables in `index.css` for light/dark mode support.
    *   Aesthetic refinements to widgets (Small Win, Debt Planner, Spending Trends).
    *   Resilient error handling and optional chaining in components to prevent crashes from malformed CSV data.
*   **Infrastructure:**
    *   Verified build stability after each major logic change.
    *   Unified account object structure across services and components.
