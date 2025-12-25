import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const CHECKS = [
    // 1. Directory Structure
    { type: 'dir', path: 'src/components/Finance', name: 'Finance Module' },
    { type: 'dir', path: 'src/components/Professional', name: 'Professional Module' },
    { type: 'dir', path: 'src/components/LifeAdmin', name: 'LifeAdmin Module' },
    { type: 'dir', path: 'src/components/SocialHub', name: 'SocialHub Module' },
    { type: 'dir', path: 'src/components/System', name: 'System Module' },

    // 2. Critical File Logic
    { type: 'content', path: 'src/components/System/Navbar/Navbar.jsx', match: 'data-workspace', name: 'Workspace Switcher Logic' },
    { type: 'content', path: 'src/pages/DashboardPage.jsx', match: 'components/Finance', name: 'Financial Dashboard Imports' },
    
    // 3. Security / Cleanup
    { type: 'missing', path: 'src/components/Finance/CsvUploader', name: 'Legacy CsvUploader' },
    { type: 'missing', path: 'public/Transactions.csv', name: 'Public PII CSVs' }
];

async function checkServerHealth() {
    console.log("⏳ [TEST] checking Server Health...");

    const checkHealth = () => new Promise((resolve) => {
        const req = http.get('http://localhost:4001/api/health', (res) => {
            if (res.statusCode === 200) {
                console.log("✅ [PASS] Server is active & healthy (HTTP 200)");
                resolve(true);
            } else {
                console.error(`❌ [FAIL] Server responded with status: ${res.statusCode}`);
                resolve(false);
            }
        });

        req.on('error', () => resolve(false));
    });

    // 1. Try to ping existing server first
    const isRunning = await checkHealth();
    if (isRunning) return true;

    // 2. If not running, spawn our own instance
    console.log("   ...Server not detected. Spawning temporary instance...");
    return new Promise((resolve) => {
        const serverProcess = spawn('node', ['server.js'], { cwd: ROOT_DIR, stdio: 'pipe' });
        
        let started = false;
        let output = '';

        serverProcess.stdout.on('data', (data) => { output += data.toString(); });
        serverProcess.stderr.on('data', (data) => { output += data.toString(); });

        const cleanup = () => {
            if (!serverProcess.killed) serverProcess.kill();
        };

        const timeout = setTimeout(async () => {
            const success = await checkHealth();
            if (success) {
                console.log("✅ [PASS] Temporary Server Booted Successfully");
                started = true;
            } else {
                console.error("❌ [FAIL] Temporary Server failed to respond");
                console.error("--- Server Log Dump ---");
                console.error(output.slice(-500));
            }
            cleanup();
            resolve(success);
        }, 3000);

        serverProcess.on('exit', (code) => {
            if (!started) {
                clearTimeout(timeout);
                console.error(`❌ [FAIL] Server crashed immediately (Exit Code: ${code})`);
                console.error("--- Crash Log ---");
                console.error(output);
                resolve(false);
            }
        });
    });
}

async function runChecks() {
    console.log("🏥 Running System Health Check...\n");
    let passed = 0;
    let failed = 0;

    // Static Checks
    for (const check of CHECKS) {
        const fullPath = path.join(ROOT_DIR, check.path);
        try {
            if (check.type === 'dir') {
                if (fs.existsSync(fullPath) && fs.lstatSync(fullPath).isDirectory()) {
                    console.log(`✅ [PASS] ${check.name} exists.`);
                    passed++;
                } else {
                    console.error(`❌ [FAIL] ${check.name} missing at ${check.path}`);
                    failed++;
                }
            } else if (check.type === 'content') {
                const content = fs.readFileSync(fullPath, 'utf8');
                if (content.includes(check.match)) {
                    console.log(`✅ [PASS] ${check.name} verified.`);
                    passed++;
                } else {
                    console.error(`❌ [FAIL] ${check.name} missing required code: "${check.match}"`);
                    failed++;
                }
            } else if (check.type === 'missing') {
                if (!fs.existsSync(fullPath)) {
                    console.log(`✅ [PASS] ${check.name} is clean.`);
                    passed++;
                } else {
                    console.error(`❌ [FAIL] ${check.name} STILL EXISTS! Delete immediately.`);
                    failed++;
                }
            }
        } catch (error) {
            console.error(`❌ [ERR] Error checking ${check.name}:`, error.message);
            failed++;
        }
    }

    // Dynamic Server Check
    const serverHealthy = await checkServerHealth();
    if (serverHealthy) passed++;
    else failed++;

    console.log(`\n🏁 Result: ${passed}/${CHECKS.length + 1} Passed.`);
    if (failed > 0) process.exit(1);
}

runChecks();