import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import { connectDB } from './server/shared/db.js';

// --- MODULE IMPORTS ---
import financialAccountRouter from './server/modules/financial_engine/api/accountController.js';
import transactionRouter from './server/modules/financial_engine/api/transactionController.js';

const app = express();
const PORT = 4001; 

// --- 1. SAFETY FIRST: Global Process Handlers ---
process.on('uncaughtException', (err) => {
    console.error('🔥 [CRITICAL] UNCAUGHT EXCEPTION:', err);
    console.error(err.stack);
    // process.exit(1); // Optional: Keep running if possible, or restart via PM2/Docker
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('🔥 [CRITICAL] UNHANDLED REJECTION:', reason);
});

// --- 2. MIDDLEWARE: Logging & Body Parsing ---
app.use((req, res, next) => {
    console.log(`📨 [${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use(express.json({ limit: '50mb' }));

// --- 3. MOUNT MODULES ---
console.log("⚙️  [System] Mounting Financial Modules...");
app.use('/api/finance/accounts', financialAccountRouter);
app.use('/api/finance/txns', transactionRouter);

// --- 4. LEGACY / OTHER ROUTES ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Daily Reads (Life Admin)
app.get("/api/daily-reads", async (req, res) => {
  try {
    const dailyReadsFilePath = path.resolve(__dirname, "../Personal_Goals/daily_reads.json");
    const data = await fs.readFile(dailyReadsFilePath, "utf8");
    const jsonData = JSON.parse(data);
    res.json(jsonData.reading_items);
  } catch (error) {
    console.error("⚠️ [Legacy] Error reading daily reads:", error.message);
    res.status(500).json({ error: "Failed to fetch daily reads." });
  }
});

// Professional Hub
const getProfessionalData = async () => {
  const filePath = path.resolve(__dirname, "../Personal_Goals/professional_data.json");
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) { 
      console.warn("⚠️ [Legacy] Professional data file missing, returning empty.");
      return { user_stories: [], bugs: [] }; 
  }
};

app.get("/api/professional/stories", async (req, res) => {
  try {
    const data = await getProfessionalData();
    res.json(data.user_stories);
  } catch (error) { res.status(500).json({ error: "Failed to fetch stories" }); }
});

// --- 5. GLOBAL ERROR MIDDLEWARE ---
app.use((err, req, res, next) => {
    console.error("❌ [Express] Error Middleware Caught:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
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