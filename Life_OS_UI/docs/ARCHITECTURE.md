# Life.io System Architecture

This document provides a human-friendly overview of the Life_OS project (Life.io), bridging the gap between the codebase and system-wide understanding.

## 1. Financial Data Pipeline (ERD)

Life.io uses a "CSV-as-Database" architecture, primarily ingesting data exported from Tiller Money templates. The `FinancialContext` acts as the central state manager.

```mermaid
erDiagram
    CSV_FILES ||--o{ TILLER_SERVICE : "parsed by"
    TILLER_SERVICE ||--o{ FINANCIAL_CONTEXT : "populates"

    FINANCIAL_CONTEXT {
        Array accounts
        Array transactions
        Array debtAccounts
        Object summaryBalances
    }

    ACCOUNTS_CSV {
        String Account_Id
        String Account_Name
        String Institution
        Number Last_Balance
    }

    TRANSACTIONS_CSV {
        Date Date
        String Description
        String Category
        Number Amount
        String Account_ID
    }

    DEBT_PAYOFF_CSV {
        String Account
        Float Interest_Rate
        Number Min_Payment
        Number Current_Balance
    }

    ACCOUNTS_CSV ||--o{ TRANSACTIONS_CSV : "references via Account ID"
    ACCOUNTS_CSV ||--o{ DEBT_PAYOFF_CSV : "mapped by name"
```

## 2. Professional Hub: AI QA Co-Pilot (Flow Chart)

The Professional Hub leverages AI to accelerate the QA lifecycle by transforming raw Azure DevOps (ADO) data into actionable automation assets.

```mermaid
graph TD
    A[ADO Service] -->|Fetch| B(User Stories / Bugs)
    B -->|Select Item| C{User Action}

    C -->|Analyze| D[AI: Summarize Requirements]
    D -->|Refine| E[AI: Generate Scenarios]
    E -->|Approve| F[AI: Generate Automation Stencil]

    F -->|Output| G[Playwright Spec Code]

    subgraph AI Processing Layer
    D
    E
    F
    end

    subgraph Engineering Output
    G
    end
```

## 3. Application Component Hierarchy

Visualizing how the React application is structured and how state flows through the system.

```mermaid
graph TD
    Root[main.jsx] --> App[App.jsx]
    App --> Prov[FinancialProvider]

    subgraph Global State Wrapper
    Prov
    end

    Prov --> Nav[Navbar]
    Prov --> Routes[React Router]

    Routes --> LP[Landing Page]
    Routes --> FD[Financial Dashboard]
    Routes --> PH[Professional Hub]

    subgraph Landing Page Widgets
    LP --> Cal[Calendar]
    LP --> SWW[Small Win Widget]
    LP --> BW[Balances Widget]
    LP --> OC[Obsidian Connector]
    end

    subgraph Financial Dashboard
    FD --> DU[CSV Uploader]
    FD --> DPP[Debt Payoff Planner]
    FD --> ST[Spending Trends]
    FD --> BVA[Budget vs Actuals]
    end
```

## 4. Debt Payoff Logic (Strategic Sequence)

The `debtService.js` performs contextual analysis based on the user's financial health.

```mermaid
sequenceDiagram
    participant UI as Debt Planner UI
    participant DS as debtService.js
    participant AI as Strategic Logic

    UI->>DS: calculatePayoff(accounts, extra, strategy)
    DS->>DS: Sort by Strategy (Avalanche/Snowball)
    DS->>AI: Check for Predatory Structures
    Note over AI: Detects Negative Amortization
    AI-->>DS: Return Status (HEALTHY/SLOW_PAYOFF/...)
    DS->>DS: Simulate Month-by-Month
    DS-->>UI: Return Months, Total Interest, & Status
```
