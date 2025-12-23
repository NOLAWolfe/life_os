import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const TIERS = {
    GUEST: 'guest',
    FREE: 'free',
    PRO: 'pro',
    ADMIN: 'admin'
};

const DEFAULT_USER = {
    id: 'user-123',
    name: 'Test User',
    tier: TIERS.PRO, // Default to Pro for dev comfort
    preferences: {
        theme: 'dark'
    }
};

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('life_os_user');
        return saved ? JSON.parse(saved) : DEFAULT_USER;
    });

    const [isGodMode, setIsGodMode] = useState(false);

    useEffect(() => {
        localStorage.setItem('life_os_user', JSON.stringify(user));
    }, [user]);

    const updateTier = (tier) => {
        setUser(prev => ({ ...prev, tier }));
    };

    const toggleGodMode = () => setIsGodMode(prev => !prev);

    // Simulation: Switch "Active User" to verify data isolation
    const switchIdentity = (identityId) => {
        setUser(prev => ({ ...prev, id: identityId, name: `User ${identityId}` }));
        // In a real app, this would trigger a data refetch/logout
        window.location.reload(); // Hard reload to force clear query cache
    };

    const value = {
        user,
        updateTier,
        isGodMode,
        toggleGodMode,
        switchIdentity,
        TIERS
    };

    return (
        <UserContext.Provider value={value}>
            {children}
            {isGodMode && <GodModePanel user={user} updateTier={updateTier} switchIdentity={switchIdentity} />}
        </UserContext.Provider>
    );
};

// Internal Dev Tool for switching states
const GodModePanel = ({ user, updateTier, switchIdentity }) => (
    <div style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        background: '#1a1a1a',
        border: '1px solid #333',
        padding: '10px',
        borderRadius: '8px',
        zIndex: 9999,
        fontSize: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
    }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#888' }}>⚡ God Mode</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label>
                Tier: 
                <select value={user.tier} onChange={(e) => updateTier(e.target.value)} style={{ marginLeft: '5px' }}>
                    {Object.values(TIERS).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
            </label>
            <label>
                User ID:
                <select value={user.id} onChange={(e) => switchIdentity(e.target.value)} style={{ marginLeft: '5px' }}>
                    <option value="user-123">User A (Default)</option>
                    <option value="user-999">User B (Clean Slate)</option>
                </select>
            </label>
        </div>
    </div>
);
