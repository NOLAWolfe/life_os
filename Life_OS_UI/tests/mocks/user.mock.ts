// tests/mocks/user.mock.ts
import { TIERS } from '../../src/services/defaults';

export const SUPER_ADMIN_USER = {
    id: 'admin-user-123',
    email: 'admin@vantage.io',
    name: 'Super Admin',
    role: TIERS.ADMIN,
    installedTools: ['finance', 'life_admin', 'professional', 'social', 'health'],
    dashboardLayout: {
        widgets: [
            { id: 'balances', position: { x: 0, y: 0 } },
            { id: 'daily_reads', position: { x: 1, y: 0 } },
        ]
    },
    termsAcceptedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};
