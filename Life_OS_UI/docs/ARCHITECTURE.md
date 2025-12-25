# Life.io System Architecture

This document provides a human-friendly overview of the Life_OS project (Life.io), bridging the gap between the codebase and system-wide understanding.

## 1. The Core Data Engine (SQLite + Prisma)

Life.io has transitioned from a legacy CSV-based model to a robust **SQLite-First** architecture. The Node.js backend serves as the single source of truth, managing data via Prisma.

```mermaid
erDiagram
    FINANCIAL_ACCOUNT ||--o{ TRANSACTION : "contains"
    DEBT_ITEM }|--|| FINANCIAL_ACCOUNT : "links to metadata"
    USER_STORY ||--o{ AI_ANALYSIS : "analyzed by"
    BUG ||--o{ USER_STORY : "references"

    FINANCIAL_ACCOUNT {
        String id PK "Unique ID from Tiller or generated"
        String name
        Float balance
        String type "checking, savings, credit"
        String class "asset, liability"
    }

    TRANSACTION {
        String id PK
        Date date
        String description
        Float amount
        String category
        Boolean isLateral "Internal transfer flag"
    }

    DEBT_ITEM {
        String id PK
        String name
        Float interestRate
        Float minPayment
        Float balance
    }
```

## 2. Modular Engine Architecture (Backend)

The server is organized into specialized engines, each with its own Repository, Service, and Controller.

*   **Financial Engine**: Processes Tiller syncs, calculates "The Hottest Dollar", and manages drift detection.
*   **Professional Engine**: Manages Agile workflows (User Stories, Bugs) and prepares data for AI Analysis.
*   **Social Engine**: Manages Clients, Invoices, and DJ performance metrics.
*   **Life Admin Engine**: (Upcoming) Will manage health, reading, and personal logistics.

## 3. UI Component Hierarchy (Frontend)

The React application is organized into **Domain-Specific Modules** to support eventually selling different tiers (Free, Pro, Enterprise).

```mermaid
graph TD
    Root[main.jsx] --> App[App.jsx]
    App --> Prov[FinancialContext]

    subgraph System Module
    Nav[Navbar + Workspace Switcher]
    DB[Data Debugger]
    end

    Prov --> Nav
    Prov --> Routes[React Router]

    subgraph Finance Module (Life OS)
    FD[Financial Dashboard]
    FD --> MF[Strategic Money Map]
    FD --> SH[The Sorting Hat]
    FD --> ST[Spending Trends]
    end

    subgraph Professional Module (Work OS)
    PH[Professional Hub]
    PH --> AB[Agile Board]
    PH --> AI[AI QA Co-Pilot]
    end

    subgraph Life Admin Module
    LP[Landing Page]
    LP --> Cal[Calendar]
    LP --> DR[Daily Reads]
    end
```

## 4. Sync & Integration Flow

```mermaid
graph LR
    GS(Google Sheets / Tiller) -->|MCP Sync| FE(Financial Engine)
    FE -->|Prisma Upsert| SQL(SQLite DB)
    SQL -->|Fetch| UI(React Dashboard)
    
    ADO(Azure DevOps) -.->|Future Connector| PE(Professional Engine)
    PE --> SQL
```



## 📊 Data Ingestion Layer
*   **Legacy Engine:** Tiller CSV exports (Accounts, Transactions, Categories) via `tillerService.js`.
*   **Next-Gen Engine (Primary):** Direct Bank Connection via Teller.io / Plaid (Pay-as-you-go).
*   **Flow:** Webhook -> `financial_engine` (API) -> SQLite (Prisma).