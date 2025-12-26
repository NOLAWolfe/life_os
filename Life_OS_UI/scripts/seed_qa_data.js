import prisma from '../server/shared/db.js';

async function seedQA() {
    try {
        console.log('🌱 Seeding Synthetic Professional Data...');

        // 1. Clear existing
        await prisma.userStory.deleteMany();
        await prisma.bug.deleteMany();

        // 2. Create User Stories
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

        console.log(`✅ Seeded ${stories.length} Stories, ${bugs.length} Bugs, and ${reads.length} Reads.`);
    } catch (error) {
        console.error('❌ Seeding Failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seedQA();
