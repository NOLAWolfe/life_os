const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const { generateSnapshot, proposeCrates, approveCrates } = require('./lib/aiCrateManager');

const BASE_DIR = path.join(__dirname, '..');
const PROPOSAL_FILE = path.join(BASE_DIR, 'ai_crate_proposal.json');

/**
 * Main menu for the interactive assistant.
 */
async function mainMenu() {
    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'Welcome to your DJ World Assistant! What would you like to do?',
            choices: [
                { name: '1. Generate AI Crates from a history file', value: 'propose' },
                { name: '2. Approve and create proposed AI Crates', value: 'approve' },
                new inquirer.Separator(),
                { name: 'Update library snapshot (run this when you add new music)', value: 'snapshot' },
                new inquirer.Separator(),
                { name: 'Exit', value: 'exit' },
            ],
        },
    ]);

    return action;
}

/**
 * Lets the user choose a history file to analyze.
 */
async function selectHistoryFile() {
    const historyFiles = fs.readdirSync(BASE_DIR).filter(file => file.startsWith('history-') && file.endsWith('.csv'));

    if (historyFiles.length === 0) {
        console.log('No history files (history-*.csv) found in the root directory.');
        return null;
    }

    const { chosenFile } = await inquirer.prompt([
        {
            type: 'list',
            name: 'chosenFile',
            message: 'Which history file would you like to analyze?',
            choices: historyFiles,
        },
    ]);

    return path.join(BASE_DIR, chosenFile);
}

/**
 * Lets the user choose which proposed crates to approve.
 */
async function selectCratesToApprove() {
    if (!fs.existsSync(PROPOSAL_FILE)) {
        console.log('No proposal file found. Please generate proposals first.');
        return null;
    }

    const proposal = JSON.parse(fs.readFileSync(PROPOSAL_FILE, 'utf-8'));
    const proposedCrates = proposal.proposed_crates;

    if (proposedCrates.length === 0) {
        console.log('The current proposal contains no crates to approve.');
        return null;
    }

    const { chosenCrates } = await inquirer.prompt([
        {
            type: 'checkbox',
            name: 'chosenCrates',
            message: 'Which AI crates would you like to approve and create?',
            choices: proposedCrates.map(crate => ({
                name: `${crate.name} (${crate.track_count} tracks)`,
                value: crate.id,
            })),
        },
    ]);

    return chosenCrates;
}


/**
 * Main application loop.
 */
async function run() {
    let running = true;
    while (running) {
        const action = await mainMenu();

        try {
            switch (action) {
                case 'snapshot':
                    await generateSnapshot();
                    break;
                case 'propose':
                    const historyFile = await selectHistoryFile();
                    if (historyFile) {
                        await proposeCrates(historyFile);
                    }
                    break;
                case 'approve':
                    const cratesToApprove = await selectCratesToApprove();
                    if (cratesToApprove && cratesToApprove.length > 0) {
                        await approveCrates(cratesToApprove);
                    } else if (cratesToApprove) {
                        console.log("No crates selected for approval.");
                    }
                    break;
                case 'exit':
                    running = false;
                    console.log('Goodbye!');
                    break;
            }
        } catch (error) {
            console.error('\n❌ An unexpected error occurred:', error);
        }

        if (running) {
             await inquirer.prompt([{ type: 'input', name: 'continue', message: '\nPress Enter to return to the main menu...' }]);
        }
    }
}

// Start the application
run();
