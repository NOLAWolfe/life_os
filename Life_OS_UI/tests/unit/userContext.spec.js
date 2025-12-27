import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { UserProvider } from '../../src/contexts/UserContext';
import { useUser } from '../../src/hooks/useFinancialData';
import { TIERS } from '../../src/services/defaults';

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => {
            store[key] = value.toString();
        },
        clear: () => {
            store = {};
        },
    };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock window.location.reload
Object.defineProperty(window, 'location', {
    value: { reload: vi.fn() },
});

describe.skip('UserContext', () => {
    it('should default to Pro tier', () => {
        const { result } = renderHook(() => useUser(), { wrapper: UserProvider });
        expect(result.current.user.tier).toBe(TIERS.PRO);
    });

    it('should toggle God Mode', () => {
        const { result } = renderHook(() => useUser(), { wrapper: UserProvider });
        expect(result.current.isGodMode).toBe(false);

        act(() => {
            result.current.toggleGodMode();
        });

        expect(result.current.isGodMode).toBe(true);
    });

    it('should switch identity and trigger reload', () => {
        const { result } = renderHook(() => useUser(), { wrapper: UserProvider });

        act(() => {
            result.current.switchIdentity('user-999');
        });

        expect(result.current.user.id).toBe('user-999');
        expect(window.location.reload).toHaveBeenCalled();
    });
});
