-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Invoice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "number" TEXT NOT NULL DEFAULT 'TEMP-INV',
    "status" TEXT NOT NULL DEFAULT 'Draft',
    "source" TEXT NOT NULL DEFAULT 'Manual',
    "originId" TEXT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" DATETIME,
    "totalAmount" REAL NOT NULL,
    "items" TEXT NOT NULL,
    "notes" TEXT,
    "clientId" TEXT NOT NULL,
    CONSTRAINT "Invoice_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Invoice" ("clientId", "date", "dueDate", "id", "items", "notes", "number", "status", "totalAmount") SELECT "clientId", "date", "dueDate", "id", "items", "notes", "number", "status", "totalAmount" FROM "Invoice";
DROP TABLE "Invoice";
ALTER TABLE "new_Invoice" RENAME TO "Invoice";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
