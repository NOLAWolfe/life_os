import { test, expect } from '@playwright/test';

/**
 * 🛡️ SECURITY CONTRACT TEST: RATE LIMITING
 *
 * Verifies that the API correctly identifies and blocks excessive requests.
 */
test.describe('API Security Contract (Rate Limiting)', () => {
    test.skip('should block requests after exceeding the limit', async ({ request }) => {
        const url = '/api/debug/rate-limit-test';
        const limit = 50;

        // 1. First 'limit' should pass
        for (let i = 0; i < limit; i++) {
            const response = await request.get(url);
            expect(response.status()).toBe(200);
        }

        // 2. The next should fail with 429
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
