import { test, expect } from '@playwright/test';

/**
 * 🛡️ CORE CONTRACT TEST: ERROR HANDLING
 *
 * Ensures the API returns consistent, structured JSON errors
 * regardless of whether the failure is User-driven (4xx) or Server-driven (500).
 */
test.describe('API Error Handling Contract', () => {
    // 1. Verify 404 Catch-All
    test('should return formatted 404 for unknown routes', async ({ request }) => {
        const response = await request.get('/api/ghost-route-xyz');

        // Assert Status
        expect(response.status()).toBe(404);

        // Assert Structure
        const json = await response.json();
        expect(json).toEqual(
            expect.objectContaining({
                status: 'fail',
                message: expect.stringContaining("Can't find /api/ghost-route-xyz"),
            })
        );
    });

    // 2. Verify Operational Error (Trusted Logic)
    test('should return formatted 400 for invalid input', async ({ request }) => {
        // Send object instead of expected array
        const response = await request.post('/api/finance/accounts/upload', {
            data: { invalid: 'object' },
        });

        // Assert Status (Bad Request)
        expect(response.status()).toBe(400);

        // Assert Structure
        const json = await response.json();
        expect(json).toEqual(
            expect.objectContaining({
                status: 'fail',
                message: 'Invalid data format. Expected array.',
            })
        );
    });
});
