import prisma from '../server/shared/db.js';

async function seedQA() {
    try {
        console.log('🌱 Seeding Synthetic System Data...');
        console.log('Prisma Models:', Object.keys(prisma).filter(k => !k.startsWith('$')));

        // 1. Clear existing
        if (prisma.user) await prisma.user.deleteMany();
        if (prisma.userStory) await prisma.userStory.deleteMany();
        if (prisma.bug) await prisma.bug.deleteMany();
        if (prisma.dailyRead) await prisma.dailyRead.deleteMany();
        if (prisma.transaction) await prisma.transaction.deleteMany();
        if (prisma.financialAccount) await prisma.financialAccount.deleteMany();
        if (prisma.debtItem) await prisma.debtItem.deleteMany();
        if (prisma.client) await prisma.client.deleteMany();
        if (prisma.invoice) await prisma.invoice.deleteMany();
        if (prisma.contentItem) await prisma.contentItem.deleteMany();
        if (prisma.workoutLog) await prisma.workoutLog.deleteMany();
        if (prisma.recipe) await prisma.recipe.deleteMany();
        if (prisma.weeklyPlan) await prisma.weeklyPlan.deleteMany();

        // 2. Create Primary User
        if (prisma.user) {
            await prisma.user.create({
                data: {
                    id: 'admin-user-123',
                    email: 'admin@life.io',
                    name: 'Neauxla',
                    role: 'admin',
                    installedTools: JSON.stringify(['finance', 'life_admin', 'professional', 'social', 'health']),
                    dashboardLayout: JSON.stringify({
                        widgets: [
                            { id: 'balances', position: { x: 0, y: 0 } },
                            { id: 'daily_reads', position: { x: 1, y: 0 } },
                            { id: 'content_factory', position: { x: 0, y: 1 } },
                        ]
                    })
                }
            });
        }

        // 3. Create User Stories
        const stories = [
            {
                title: 'Implement PII Obfuscation Layer for Tiller Sync',
                description:
                    'As a security-conscious user, I want all sensitive bank data (account numbers, real names) to be masked before it hits the database so that I can demo the app safely.',
                state: 'Active',
                assignedTo: 'Neauxla',
                acceptanceCriteria:
                    '1. All account numbers are masked.\n2. Raw vendor descriptions are scrubbed of personal names.\n3. Logic is implemented in mappingService.js.',
            },
            {
                title: 'Refactor Professional Hub to Prisma/SQLite',
                description:
                    'The current JSON-based storage is not scalable for enterprise use. We need to migrate to a relational database to support complex queries and future Azure DevOps integration.',
                state: 'Closed',
                assignedTo: 'Gemini AI',
                acceptanceCriteria:
                    '1. Remove legacy JSON files.\n2. Create qaRepository.js.\n3. Verify CRUD operations via frontend.',
            },
            {
                title: 'Integrate Azure DevOps Integration Connector (Phase 3)',
                description:
                    'To enable bi-directional sync with corporate environments, we need to leverage the Google Cloud Integration Connectors for ADO.',
                state: 'New',
                assignedTo: 'Unassigned',
                acceptanceCriteria:
                    '1. Configure OAuth in Google Cloud Console.\n2. Implement ADO sync logic in professional_engine.\n3. Support webhook updates for ticket states.',
            },
            {
                title: "Build 'Sorting Hat' Transaction Classifier UI",
                description:
                    "Users need a fast, intuitive way to assign orphaned transactions to Bill Nodes. This 'Tinder for Finance' interface will gamify the cleanup process.",
                state: 'Active',
                assignedTo: 'Neauxla',
                acceptanceCriteria:
                    '1. Render unassigned transactions.\n2. Allow manual mapping to Bill nodes.\n3. Persist rules to SQLite.',
            },
            // --- COMPLIANCE EPIC ---
            {
                title: 'Legal: Draft Terms of Service & Privacy Policy',
                description: 'Essential legal shield for the business. Must cover Data Liability (Finance), Assumption of Risk (Health), and UGC (Social).',
                state: 'New',
                assignedTo: 'Legal Dept',
                acceptanceCriteria: '1. Limitation of Liability Clause\n2. Health/Medical Disclaimer\n3. DMCA Safe Harbor registration plan',
            },
            {
                title: 'Compliance: Implement GDPR/CCPA Account Deletion',
                description: 'Mandatory "Right to be Forgotten". Users must be able to nuke their data from the app settings.',
                state: 'New',
                assignedTo: 'Neauxla',
                acceptanceCriteria: '1. API endpoint to cascade delete User + all relations.\n2. UI Button in Settings (Red Zone).',
            },
            {
                title: 'Accessibility: ADA Compliance Audit',
                description: 'Ensure the app is usable by screen readers. Critical for "Public Accommodation" laws.',
                state: 'New',
                assignedTo: 'QA',
                acceptanceCriteria: '1. All images/icons have alt text.\n2. Charts have data-table fallbacks.\n3. Keyboard navigation works 100%.',
            }
        ];

        for (const s of stories) {
            await prisma.userStory.create({ data: s });
        }

        // 3. Create Bugs
        const bugs = [
            {
                title: 'Duplicate Header Error in Debt Planner Sync',
                state: 'Closed',
                severity: 1,
            },
            {
                title: 'Node Drift Detection False Positive on Zelle Transfers',
                state: 'Active',
                severity: 2,
            },
            {
                title: 'Mobile View Layout Break on Strategy Map',
                state: 'Active',
                severity: 3,
            },
        ];

        for (const b of bugs) {
            await prisma.bug.create({ data: b });
        }

        // 4. Create Daily Reads
        console.log('📚 Seeding Daily Reads...');
        const reads = [
            {
                title: 'The 10X Rule',
                author: 'Grant Cardone',
                type: 'book',
                status: 'in_progress',
                progress: 45,
                total: 100,
                notes: 'Focus on wealth creation and massive action.',
            },
            {
                title: 'Building a Second Brain',
                author: 'Tiago Forte',
                type: 'book',
                status: 'completed',
                progress: 100,
                total: 100,
                notes: 'Essential for Obsidian vault organization.',
            },
            {
                title: 'Prisma Documentation: Advanced Modeling',
                type: 'article',
                status: 'in_progress',
                progress: 1,
                total: 5,
                link: 'https://www.prisma.io/docs/',
            },
        ];

        for (const r of reads) {
            await prisma.dailyRead.create({ data: r });
        }

        // Seed Accounts (The Tiller Truth - Assets & Liabilities)
        const accounts = [
            // --- ASSETS ---
            { id: '694342aab1c45759f665b650', name: 'EveryDay Checking', institution: 'Navy Federal', type: 'checking', balance: 1040.64 },
            { id: '69434249b1c45759f665b28d', name: 'HSC', institution: 'Chase', type: 'checking', balance: 764.42 },
            { id: '694342aab1c45759f665b665', name: 'Share Savings', institution: 'Navy Federal', type: 'savings', balance: 5.03 },
            
            // --- LIABILITIES (Balances) ---
            { id: '694342aab1c45759f665b626', name: 'Used Vehicle Loan', institution: 'Navy Federal', type: 'loan', balance: 23164.57 },
            { id: '69434375b1c45759f665ba9e', name: 'Discover More Card', institution: 'Discover', type: 'credit', balance: 2285.82 },
            { id: '694342f1b1c45759f665b750', name: 'Platinum', institution: 'Capital One', type: 'credit', balance: 746.84 },
            { id: '694342aab1c45759f665b63b', name: 'Visa Platinum', institution: 'Navy Federal', type: 'credit', balance: 7397.56 },
            { id: '694342f2b1c45759f665b765', name: 'QuicksilverOne', institution: 'Capital One', type: 'credit', balance: 4310.42 },
            
            // --- STUDENT LOANS ---
            { id: '69434429b1c45759f665bdf4', name: 'Student Loan AA', institution: 'Dept of Ed', type: 'loan', balance: 974.08 },
            { id: '69434429b1c45759f665bddf', name: 'Student Loan AB', institution: 'Dept of Ed', type: 'loan', balance: 6309.89 },
            { id: '69434429b1c45759f665bdca', name: 'Student Loan AD', institution: 'Dept of Ed', type: 'loan', balance: 3870.07 },
            { id: '69434429b1c45759f665bdb5', name: 'Student Loan AE', institution: 'Dept of Ed', type: 'loan', balance: 6962.34 },
            { id: '69434429b1c45759f665bda0', name: 'Student Loan AF', institution: 'Dept of Ed', type: 'loan', balance: 12226.30 },
            { id: '69434429b1c45759f665bd8b', name: 'Student Loan AG', institution: 'Dept of Ed', type: 'loan', balance: 3776.96 }
        ];

        for (const acc of accounts) {
            await prisma.financialAccount.create({ data: acc });
        }

        // Seed Debts (The Intelligence Layer)
        const debts = [
            { id: 'debt-quicksilver', name: 'QuicksilverOne', balance: 4310.42, interestRate: 29.2, minPayment: 206, category: 'credit_card', priority: 1 },
            { id: 'debt-platinum', name: 'Platinum', balance: 746.84, interestRate: 28.7, minPayment: 25, category: 'credit_card', priority: 2 },
            { id: 'debt-discover', name: 'Discover More Card', balance: 2285.82, interestRate: 23.7, minPayment: 62, category: 'credit_card', priority: 3 },
            { id: 'debt-visa', name: 'Visa Platinum', balance: 7397.56, interestRate: 18.0, minPayment: 183, category: 'credit_card', priority: 4 },
            { id: 'debt-auto', name: 'Used Vehicle Loan', balance: 23164.57, interestRate: 8.7, minPayment: 756, category: 'auto', priority: 5 },
            
            // Student Loans (Avalanche priority based on rate)
            { id: 'debt-sl-aa', name: 'Student Loan AA', balance: 974.08, interestRate: 6.8, minPayment: 6, category: 'student_loan', priority: 6 },
            { id: 'debt-sl-ab', name: 'Student Loan AB', balance: 6309.89, interestRate: 6.8, minPayment: 34, category: 'student_loan', priority: 7 },
            { id: 'debt-sl-ad', name: 'Student Loan AD', balance: 3870.07, interestRate: 6.8, minPayment: 21, category: 'student_loan', priority: 8 },
            { id: 'debt-sl-ae', name: 'Student Loan AE', balance: 6962.34, interestRate: 3.9, minPayment: 24, category: 'student_loan', priority: 11 },
            { id: 'debt-sl-af', name: 'Student Loan AF', balance: 12226.30, interestRate: 5.3, minPayment: 53, category: 'student_loan', priority: 10 },
            { id: 'debt-sl-ag', name: 'Student Loan AG', balance: 3776.96, interestRate: 6.0, minPayment: 18, category: 'student_loan', priority: 9 }
        ];

        for (const d of debts) {
            await prisma.debtItem.create({ data: d });
        }

        // Seed Recent Transactions (representative sample)
        const sampleTxns = [
            { id: 'tx-1', date: new Date('2025-12-15'), description: 'Huntington Payroll', amount: 2787.50, type: 'credit', category: 'Paycheck', accountId: '69434249b1c45759f665b28d' },
            { id: 'tx-2', date: new Date('2025-12-16'), description: 'Zelle Deposit', amount: 1050.00, type: 'credit', category: 'Transfer', accountId: '694342aab1c45759f665b650' },
            { id: 'tx-3', date: new Date('2025-12-16'), description: 'Interest Charge', amount: -107.11, type: 'debit', category: 'Interest', accountId: '694342f2b1c45759f665b765' }
        ];

        for (const tx of sampleTxns) {
            await prisma.transaction.create({ data: tx });
        }

        console.log(`✅ Seeded ${stories.length} Stories, ${bugs.length} Bugs, ${reads.length} Reads, and 1 Transaction.`);
    } catch (error) {
        console.error('❌ Seeding Failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seedQA();
