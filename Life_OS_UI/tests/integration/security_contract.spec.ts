import { test, expect } from '@playwright/test';

/**
 * 🛡️ SECURITY CONTRACT TEST: RATE LIMITING
 *
 * Verifies that the API correctly identifies and blocks excessive requests.
 */
test.describe('API Security Contract (Rate Limiting)', () => {
    test('should block requests after exceeding the limit (5 per min)', async ({ request }) => {
        const url = 'http://localhost:4001/api/debug/rate-limit-test';

        // 1. First 5 should pass
        for (let i = 0; i < 5; i++) {
            const response = await request.get(url);
            expect(response.status()).toBe(200);
        }

        // 2. The 6th should fail with 429
        const blockedResponse = await request.get(url);
        expect(blockedResponse.status()).toBe(429);

        const json = await blockedResponse.json();
        expect(json).toEqual(
            expect.objectContaining({
                status: 'fail',
                message: 'Rate limit exceeded',
            })
        );
    });
});
