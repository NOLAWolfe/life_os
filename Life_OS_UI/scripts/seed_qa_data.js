import prisma from '../server/shared/db.js';

async function seedQA() {
    try {
        console.log('🌱 Seeding Synthetic System Data...');

        // 1. Clear existing
        await prisma.user.deleteMany();
        await prisma.userStory.deleteMany();
        await prisma.bug.deleteMany();

        // 2. Create Primary User
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

        // 5. Create Transactions for Mapper
        console.log('💸 Seeding Transactions...');
        await prisma.transaction.deleteMany(); // Clear old ones
        await prisma.transaction.create({
            data: {
                date: new Date(),
                description: 'Unknown Vendor 123',
                amount: -50.00,
                type: 'debit',
                category: 'Uncategorized',
                accountId: null // Orphaned
            }
        });

        console.log(`✅ Seeded ${stories.length} Stories, ${bugs.length} Bugs, ${reads.length} Reads, and 1 Transaction.`);
    } catch (error) {
        console.error('❌ Seeding Failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seedQA();
