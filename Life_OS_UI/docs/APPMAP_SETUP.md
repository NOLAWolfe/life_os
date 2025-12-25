# AppMap Integration & Workflow

We have integrated **AppMap** to generate dynamic documentation, sequence diagrams, and flow charts automatically from your running code.

## 🚀 How to Record

### 1. Server-Side Recording (API & Backend Logic)
To record all backend interactions (API calls, Database queries, Logic execution):

```bash
npm run record:server
```

1.  The server will start on Port **4001**.
2.  Interact with the app (or run frontend tests).
3.  When you stop the server (Ctrl+C), the `.appmap.json` files will be saved to `tmp/appmap/process/`.

### 2. Viewing the Maps
1.  Open this project in **VS Code**.
2.  Ensure the **AppMap** extension is installed.
3.  Navigate to `tmp/appmap/requests` in the file explorer.
4.  Click on any `.appmap.json` file to open the interactive diagram.

## 🔍 What is Mapped?
*   **`server`**: All Express routes and middleware.
*   **`src/services`**: Business logic and data processing.

## 📊 Use Cases
*   **"The Council" Review:** Before major refactors, generate a map of the current flow to ensure no regressions.
*   **Onboarding:** New devs can click through the "Flow View" to see exactly how data moves from API to Database.
*   **Debugging:** Trace a failed request down to the exact SQL query.
