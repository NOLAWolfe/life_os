# Life_OS Project Overview

This project, "Life_OS," is a suite of personal and professional development tools being built for the user, Neauxla. It is evolving into a unified "Life.io" platform with a central UI.

## The Vision: "Life.io"

The ultimate goal is to create a single, aesthetic, and user-friendly web platform that serves as a personal and professional life assistant. This platform will provide a UI for all the tools built within `Life_OS`, offering features like charts, tables, and forms to interact with the underlying data and scripts. The vision is to build a tool that assists with daily life, personal growth, and business management, with the potential for future productization.

## The User: "Neauxla"

Neauxla is a senior quality automation analyst, a musician (DJ, pianist, producer), and a father. He is focused on personal growth, productivity, and financial independence. The tools in this project are designed to help him manage his diverse interests, from fitness and meal planning to social media content creation and financial analysis for his business (EIN).

## Project Roadmap

The development is focused on several key areas, which will eventually be integrated into the "Life.io" UI:

1.  **Foundation (`Personal_Goals`):** A suite of Python-based command-line tools for tracking personal development.
2.  **Health Hub (`Personal_Goals`):** Tools for managing fitness and nutrition.
3.  **Creative & Social (`Personal_Goals`, `DJ_World`):** Tools for brainstorming content and enhancing the DJ workflow.
4.  **Business & Finance (`Software_Projects/plaid-assistant`):** The core financial analysis engine, designed to provide insights into personal and business finance, now integrated into the `Life_OS_UI`.
5.  **The UI (`Life_OS_UI`):** The central React-based web interface for the entire "Life.io" platform, now featuring a multi-page structure, navigation, and the first integrated financial dashboard.

## Directory Overview

*   **`Life_OS_UI/`**: The new central UI for the "Life.io" platform. This is a React project (created with Vite) with an Express.js backend. It now features a multi-page structure using `react-router-dom`, including a landing page with a roadmap, and a dedicated financial dashboard which successfully integrates data from the `plaid-assistant`. Future goals include advanced UI styling (Squarespace/Wix aesthetic) and a simple user/pass login system. The Apple Music integration is currently on hold due to developer account costs.

*   **`DJ_World/`**: Contains the "DJ World" project. This is being refactored from a set of separate scripts into a unified, interactive Node.js assistant. The long-term goal is to integrate it with Apple Music to create a "wishlist" of tracks to acquire from record pools (currently on hold due to developer account costs).

*   **`Personal_Goals/`**: A collection of Python scripts for personal development and tracking. This directory now contains:
    *   `skills.py`: A command-line tool to track time spent on developing new skills.
    *   `workout_tracker.py`: A tool to define and log workout routines.
    *   `meal_planner.py`: A tool to manage recipes and generate meal plans and shopping lists.
    *   `content_idea_generator.py`: A tool to brainstorm and save content ideas for social media.

*   **`Software_Projects/plaid-assistant/`**: A Python script that uses the Plaid API. This is the foundation for the "Business & Finance" module of Life.io. It has been modified to output clean JSON, and its data is now successfully displayed in the `Life_OS_UI`. The goal is to expand this to perform deep portfolio analysis and provide financial guidance for both personal and business use cases.

## Long-Term Vision & Future Modules
*   **DJ Assistant UI Integration:** Create a dedicated section in the Life.io UI for the DJ World assistant.
*   **Advanced Features:** Implement calendar widgets and advanced macro/nutrition counting tools.
*   **Productivity & Business Planning:** Develop tools for creating productivity schedules, project timelines, and learning business planning to support the growth of "Life.io" itself.
*   **Modular Corporate Version:** Design the platform with a modular architecture that could be adapted for a business-focused, corporate environment in the future.
*   **Monetization Model:** Explore a subscription-based tier system for offering different "assistants" to the public.