import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TIERS } from '../services/defaults';
import { UserContext } from './contextRegistry';

const fetchUser = async () => {
    const response = await fetch('/api/system/user/admin-user-123');
    const result = await response.json();
    if (result.status !== 'success') throw new Error(result.message);
    return result.data;
};

export const UserProvider = ({ children }) => {
    const queryClient = useQueryClient();
    const [isGodMode, setIsGodMode] = useState(false);

    // Fetch User with React Query (Deduplicates requests, Caches result)
    const { data: user, isLoading, error } = useQuery({
        queryKey: ['user', 'admin-user-123'],
        queryFn: fetchUser,
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
        retry: 1
    });

    // Mutation to update tools
    const toolMutation = useMutation({
        mutationFn: async (newTools) => {
            const response = await fetch(`/api/system/user/${user.id}/preferences`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ installedTools: newTools }),
            });
            if (!response.ok) throw new Error('Failed to update tools');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['user']);
        },
    });

    const updateTier = (role) => {
        // Optimistic update logic could go here, for now just a console log as we don't persist tier changes in this demo context
        console.log('Role update requested:', role);
    };

    const toggleGodMode = () => setIsGodMode((prev) => !prev);

    const saveTools = (newTools) => {
        toolMutation.mutate(newTools);
    };

    const switchIdentity = (_identityId) => {
        window.location.reload();
    };

    const value = {
        user,
        loading: isLoading || toolMutation.isPending,
        error,
        updateTier,
        isGodMode,
        toggleGodMode,
        switchIdentity,
        saveTools, // Expose the new save function
        TIERS,
    };

    if (isLoading) return <div className="p-4 text-center">Loading Vantage Identity...</div>;
    if (error) return <div className="p-4 text-center text-red-500">System Identity Failed</div>;

    return (
        <UserContext.Provider value={value}>
            {children}
            {isGodMode && (
                <GodModePanel user={user} updateTier={updateTier} switchIdentity={switchIdentity} />
            )}
        </UserContext.Provider>
    );
};

// Internal Dev Tool for switching states
const GodModePanel = ({ user, updateTier, switchIdentity }) => (
    <div
        style={{
            position: 'fixed',
            bottom: '10px',
            right: '10px',
            background: '#1a1a1a',
            border: '1px solid #333',
            padding: '10px',
            borderRadius: '8px',
            zIndex: 9999,
            fontSize: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
        }}
    >
        <h4 style={{ margin: '0 0 8px 0', color: '#888' }}>⚡ God Mode</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label>
                Role:
                <select
                    value={user.role}
                    onChange={(e) => updateTier(e.target.value)}
                    style={{ marginLeft: '5px' }}
                >
                    {Object.values(TIERS).map((t) => (
                        <option key={t} value={t}>
                            {t}
                        </option>
                    ))}
                </select>
            </label>
            <label>
                User ID:
                <select
                    value={user.id}
                    onChange={(e) => switchIdentity(e.target.value)}
                    style={{ marginLeft: '5px' }}
                >
                    <option value="user-123">User A (Default)</option>
                    <option value="user-999">User B (Clean Slate)</option>
                </select>
            </label>
        </div>
    </div>
);
