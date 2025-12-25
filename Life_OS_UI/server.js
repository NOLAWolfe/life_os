import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import { connectDB } from './server/shared/db.js';
import AppError from './server/shared/AppError.js';

// --- MODULE IMPORTS ---
import financialAccountRouter from './server/modules/financial_engine/api/accountController.js';
import transactionRouter from './server/modules/financial_engine/api/transactionController.js';
import debtRouter from './server/modules/financial_engine/api/debtController.js';
import qaRouter from './server/modules/professional_engine/api/qaController.js';
import clientRouter from './server/modules/social_engine/api/clientController.js';
import invoiceRouter from './server/modules/social_engine/api/invoiceController.js';
import mealRouter from './server/modules/life_admin/api/mealController.js';

const app = express();
const PORT = 4001; 

app.use(express.json());

// --- 3. MOUNT MODULES ---
console.log("⚙️  [System] Mounting Life_OS Modules...");
app.use('/api/finance/accounts', financialAccountRouter);
app.use('/api/finance/txns', transactionRouter);
app.use('/api/finance/debts', debtRouter);
app.use('/api/professional', qaRouter);
app.use('/api/social/clients', clientRouter);
app.use('/api/social/invoices', invoiceRouter);
app.use('/api/life-admin/meals', mealRouter);

// --- 4. LEGACY / OTHER ROUTES ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Handle 404 (Undefined Routes)
// Note: In Express 5, using '*' can trigger path-to-regexp errors. 
// Using a middleware without a path captures all unmatched requests.
app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// --- 5. GLOBAL ERROR MIDDLEWARE ---
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Log the error for observability
    console.error("❌ [Express] Error:", {
        message: err.message,
        status: err.statusCode,
        stack: err.stack
    });

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        // Only show stack in development/test to prevent leaking info in prod
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined 
    });
});

// --- 6. STARTUP SEQUENCE ---
const startServer = async () => {
    try {
        console.log("⏳ [System] Connecting to Database...");
        await connectDB();
        
        app.listen(PORT, () => {
            console.log(`🚀 [System] Server successfully running on http://localhost:${PORT}`);
            console.log(`   - Health: http://localhost:${PORT}/api/health`);
            console.log(`   - Accounts: http://localhost:${PORT}/api/finance/accounts`);
            console.log(`   - Transactions: http://localhost:${PORT}/api/finance/txns`);
        });
    } catch (error) {
        console.error("💀 [System] Failed to start server:", error);
        process.exit(1);
    }
};

startServer();