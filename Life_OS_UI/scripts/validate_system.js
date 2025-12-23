import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const CHECKS = [
    // 1. Directory Structure (Modular Architecture)
    { type: 'dir', path: 'src/components/Finance', name: 'Finance Module' },
    { type: 'dir', path: 'src/components/Professional', name: 'Professional Module' },
    { type: 'dir', path: 'src/components/LifeAdmin', name: 'LifeAdmin Module' },
    { type: 'dir', path: 'src/components/SocialHub', name: 'SocialHub Module' },
    { type: 'dir', path: 'src/components/System', name: 'System Module' },

    // 2. Critical File Logic
    {
        type: 'content', 
        path: 'src/components/System/Navbar/Navbar.jsx', 
        match: 'data-workspace',
        name: 'Workspace Switcher Logic' 
    },
    {
        type: 'content', 
        path: 'src/pages/FinancialDashboard.jsx', 
        match: 'components/Finance/PaymentFlow',
        name: 'Financial Dashboard Imports' 
    },
    
    // 3. Security / Cleanup
    { type: 'missing', path: 'src/components/Finance/CsvUploader', name: 'Legacy CsvUploader (Should be gone)' },
    { type: 'missing', path: 'public/Transactions.csv', name: 'Public PII CSVs (Should be gone)' }
];

async function runChecks() {
    console.log("🏥 Running System Health Check...\n");
    let passed = 0;
    let failed = 0;

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

    console.log(`\n🏁 Result: ${passed}/${CHECKS.length} Passed.`);
    if (failed > 0) process.exit(1);
}

runChecks();