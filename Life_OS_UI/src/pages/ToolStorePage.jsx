import React from 'react';
import { useUser } from '../contexts/UserContext';
import './Page.css';

const TOOLS = [
    // --- TIER 1: FOUNDATION ---
    {
        id: 'finance',
        name: 'Finance War Room',
        description: 'Advanced net worth tracking, debt payoff planning, and transaction mapping.',
        icon: '💰',
        category: 'Business',
    },
    {
        id: 'life_admin',
        name: 'Life Admin',
        description: 'Daily reads, meal planning, and personal goal tracking.',
        icon: '🗓️',
        category: 'Personal',
    },
    
    // --- TIER 2: EMPIRE (The Business) ---
    {
        id: 'professional',
        name: 'Professional Hub',
        description: 'QA Co-pilot, ticket tracking, and software engineering management.',
        icon: '💻',
        category: 'Business',
    },
    {
        id: 'social',
        name: 'Social & DJ Hub',
        description: 'CRM for clients, automated invoicing, and content pipeline management.',
        icon: '🎧',
        category: 'Creative',
    },
    {
        id: 'marketing_hq',
        name: 'Marketing HQ',
        description: 'Multi-channel social scheduler and content factory pipeline.',
        icon: '📡',
        category: 'Business',
        isComingSoon: true
    },
    {
        id: 'asset_manager',
        name: 'Asset Manager',
        description: 'Real-time tracking for Real Estate, Stocks, and Crypto portfolios.',
        icon: '🏛️',
        category: 'Business',
        isComingSoon: true
    },

    // --- TIER 3: THE VESSEL (Health) ---
    {
        id: 'health',
        name: 'Titan Protocol',
        description: 'Mobile-first workout tracker and health metrics (HealthKit Ready).',
        icon: '💪',
        category: 'Personal',
    },
    {
        id: 'bio_engine',
        name: 'Bio-Engine',
        description: 'Advanced biometrics: Sleep, Fasting, and Supplement tracking.',
        icon: '🧬',
        category: 'Personal',
        isComingSoon: true
    }
];

const ToolStorePage = () => {
    const { user, saveTools, loading: isSaving } = useUser();
    const [stagedTools, setStagedTools] = useState(user?.installedTools || []);

    useEffect(() => {
        setStagedTools(user?.installedTools || []);
    }, [user]);

    const hasChanges = JSON.stringify(stagedTools.sort()) !== JSON.stringify(user?.installedTools.sort());

    const handleToggleTool = (toolId) => {
        const isInstalled = stagedTools.includes(toolId);
        if (isInstalled) {
            setStagedTools(stagedTools.filter(t => t !== toolId));
        } else {
            setStagedTools([...stagedTools, toolId]);
        }
    };

    const handleSave = () => {
        saveTools(stagedTools);
    };

    const handleCancel = () => {
        setStagedTools(user.installedTools);
    };

    return (
        <div className="page-container" style={{ padding: '40px' }}>
            {/* ... Header ... */}
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '10px', fontFamily: 'monospace', letterSpacing: '2px' }}>
                    VANTAGE STORE
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Install modules to upgrade your Personal Enterprise.
                </p>
            </div>

            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                gap: '20px',
                paddingBottom: hasChanges ? '100px' : '20px'
            }}>
                {TOOLS.map((tool) => {
                    const isInstalled = stagedTools.includes(tool.id);
                    return (
                        <div key={tool.id} style={{
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-border)',
                            borderRadius: '16px',
                            padding: '24px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '15px',
                            transition: 'all 0.2s ease',
                            opacity: tool.isComingSoon ? 0.6 : 1
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <span style={{ fontSize: '40px' }}>{tool.icon}</span>
                                <span style={{ 
                                    fontSize: '10px', 
                                    textTransform: 'uppercase', 
                                    letterSpacing: '1px',
                                    background: tool.isComingSoon ? 'rgba(255, 165, 0, 0.1)' : 'rgba(255,255,255,0.05)',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    color: tool.isComingSoon ? 'orange' : 'var(--text-secondary)',
                                    border: tool.isComingSoon ? '1px solid orange' : 'none'
                                }}>
                                    {tool.isComingSoon ? 'COMING SOON' : tool.category}
                                </span>
                            </div>

                            <div>
                                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem' }}>{tool.name}</h3>
                                <p style={{ 
                                    margin: 0, 
                                    fontSize: '0.9rem', 
                                    color: 'var(--text-secondary)',
                                    lineHeight: '1.5'
                                }}>
                                    {tool.description}
                                </p>
                            </div>

                            <button
                                onClick={() => !tool.isComingSoon && handleToggleTool(tool.id)}
                                disabled={tool.isComingSoon || isSaving}
                                style={{
                                    marginTop: 'auto',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: tool.isComingSoon 
                                        ? 'transparent' 
                                        : (isInstalled ? 'rgba(255, 255, 255, 0.1)' : 'var(--primary-color)'),
                                    color: tool.isComingSoon 
                                        ? 'var(--text-secondary)' 
                                        : 'white',
                                    fontWeight: '600',
                                    cursor: tool.isComingSoon ? 'not-allowed' : 'pointer',
                                    border: tool.isComingSoon ? '1px dashed var(--border-border)' : 'none',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {tool.isComingSoon ? 'In Development' : (isInstalled ? '✓ Installed' : 'Install Module')}
                            </button>
                        </div>
                    );
                })}
            </div>

            {hasChanges && (
                <div style={{
                    position: 'fixed',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--bg-card)',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-border)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    zIndex: 100,
                    animation: 'fade-in-up 0.3s ease'
                }}>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>You have unsaved changes.</p>
                    <button className="btn-secondary" onClick={handleCancel} disabled={isSaving}>Cancel</button>
                    <button className="btn-primary" onClick={handleSave} disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            )}
        </div>
    );
};


export default ToolStorePage;
