import React from 'react';
import { useUser, TIERS } from '../../contexts/UserContext';

const TIER_LEVELS = {
    [TIERS.GUEST]: 0,
    [TIERS.FREE]: 1,
    [TIERS.PRO]: 2,
    [TIERS.ADMIN]: 3
};

const FeatureGate = ({ minTier = TIERS.FREE, children, fallback = null }) => {
    const { user, isGodMode } = useUser();

    if (isGodMode) return children;

    const userLevel = TIER_LEVELS[user.tier] || 0;
    const requiredLevel = TIER_LEVELS[minTier] || 1;

    if (userLevel >= requiredLevel) {
        return children;
    }

    return fallback || (
        <div className="p-4 border border-dashed border-gray-600 rounded-lg text-center opacity-70">
            <h4 className="text-yellow-500 font-bold mb-1">🔒 Pro Feature</h4>
            <p className="text-sm">Upgrade to unlock this capability.</p>
        </div>
    );
};

export default FeatureGate;
