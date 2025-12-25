import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

// Config
const SERVER_PORT = 4001;
const STARTUP_TIMEOUT = 20000; // 20s

// Helpers
const log = (msg) => console.log(`🎥 [Recorder] ${msg}`);
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function run() {
    log("Cleaning old maps...");
    const mapDir = path.resolve('tmp/appmap');
    if (fs.existsSync(mapDir)) {
        fs.rmSync(mapDir, { recursive: true, force: true });
    }
    fs.mkdirSync(mapDir, { recursive: true });

    log("Starting AppMap-instrumented Server...");
    const server = spawn('npx', ['appmap-node', 'node', 'server.js'], {
        stdio: 'inherit',
        env: { ...process.env, PORT: SERVER_PORT }
    });

    let serverReady = false;
    
    // Give it time to boot
    await sleep(5000); 

    // Verify Health
    try {
        const response = await fetch(`http://localhost:${SERVER_PORT}/api/health`);
        if (response.ok) {
            log("Server is UP!");
            serverReady = true;
        }
    } catch (e) {
        log("Server not reachable yet...");
    }

    if (!serverReady) {
        log("Server failed to start in time. Aborting.");
        server.kill();
        process.exit(1);
    }

    log("Running Playwright Suite...");
    const tests = spawn('npx', ['playwright', 'test', 'tests/smoke_suite.spec.ts'], {
        stdio: 'inherit',
        env: { ...process.env, CI: 'true' } // Force headless
    });

    tests.on('close', async (code) => {
        log(`Tests finished with code ${code}.`);
        
        log("Gracefully stopping server to flush AppMaps...");
        server.kill('SIGINT');
        
        // Wait for AppMap to write
        await sleep(5000);
        
        log("Done! Check tmp/appmap/requests/ for your maps.");
        process.exit(code);
    });
}

run();
