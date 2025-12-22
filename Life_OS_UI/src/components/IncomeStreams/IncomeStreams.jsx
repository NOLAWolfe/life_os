import React, { useState, useEffect, useMemo } from 'react';
import { useFinancials } from '../../contexts/FinancialContext';
import './IncomeStreams.css';

const STREAM_TYPES = {
    active: { label: 'Active (Job)', color: '#1565c0', bg: '#e3f2fd' },
    side: { label: 'Side Hustle', color: '#ef6c00', bg: '#fff3e0' },
    passive: { label: 'Passive / Asset', color: '#2e7d32', bg: '#e8f5e9' },
    ignored: { label: 'Ignored / Transfer', color: '#757575', bg: '#f5f5f5' }
};

const IncomeStreams = () => {
    const { incomeStreams, loading } = useFinancials();
    
    // Config: { [originalName]: { type: 'active', alias: 'My Job', target: 5000 } }
    const [streamConfig, setStreamConfig] = useState(() => {
        const saved = localStorage.getItem('incomeStreamConfig');
        return saved ? JSON.parse(saved) : {};
    });
    
    const [showIgnored, setShowIgnored] = useState(false);

    useEffect(() => {
        localStorage.setItem('incomeStreamConfig', JSON.stringify(streamConfig));
    }, [streamConfig]);

    const updateConfig = (originalName, key, value) => {
        setStreamConfig(prev => ({
            ...prev,
            [originalName]: {
                ...prev[originalName],
                [key]: value
            }
        }));
    };

    // Merge API data with Local Config
    const enrichedStreams = useMemo(() => {
        if (!incomeStreams) return [];
        return incomeStreams.map(s => {
            const config = streamConfig[s.name] || {};
            return {
                ...s,
                type: config.type || 'active', // Default to active
                alias: config.alias || s.name,
                target: config.target || 0,
                monthlyAvg: s.monthlyAvg || s.average // Use true monthly avg, fallback to avg per txn
            };
        });
    }, [incomeStreams, streamConfig]);

    // Grouping
    const groupedStreams = useMemo(() => {
        const groups = { active: [], side: [], passive: [], ignored: [] };
        enrichedStreams.forEach(s => {
            if (groups[s.type]) groups[s.type].push(s);
        });
        return groups;
    }, [enrichedStreams]);

    // Summary Stats (Exclude Ignored)
    const totalIncome = enrichedStreams
        .filter(s => s.type !== 'ignored')
        .reduce((acc, s) => acc + s.monthlyAvg, 0); 
        
    const passiveIncome = groupedStreams.passive.reduce((acc, s) => acc + s.monthlyAvg, 0);
    const passiveRatio = totalIncome > 0 ? (passiveIncome / totalIncome) * 100 : 0;

    const [expandedStream, setExpandedStream] = useState(null);

    if (loading) return <div>Loading Wealth Data...</div>;

    const toggleExpand = (name) => {
        setExpandedStream(prev => prev === name ? null : name);
    };

    const renderStreamGroup = (typeKey) => {
        const group = groupedStreams[typeKey];
        if (group.length === 0) return null;
        if (typeKey === 'ignored' && !showIgnored) return null;

        const groupTotal = group.reduce((sum, s) => sum + s.monthlyAvg, 0);
        const groupTarget = group.reduce((sum, s) => sum + Number(s.target), 0);

        return (
            <div className="income-group" key={typeKey}>
                <div className="group-header">
                    <span className="group-title" style={{ color: STREAM_TYPES[typeKey].color }}>
                        {STREAM_TYPES[typeKey].label}
                    </span>
                    <span className="group-total font-mono font-bold">
                        ${groupTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        {groupTarget > 0 && <span className="text-xs text-gray-400 font-normal"> / ${groupTarget.toLocaleString()} goal</span>}
                    </span>
                </div>
                {group.map((stream, idx) => (
                    <div key={idx} className="stream-item" style={{ opacity: typeKey === 'ignored' ? 0.6 : 1 }}>
                        <div className="stream-header">
                            <div className="flex items-center gap-2 flex-1">
                                <button 
                                    className="expand-btn text-gray-400 hover:text-white transition-colors"
                                    onClick={() => toggleExpand(stream.name)}
                                >
                                    {expandedStream === stream.name ? '▼' : '▶'}
                                </button>
                                <input 
                                    className="stream-name-edit" 
                                    value={stream.alias} 
                                    onChange={(e) => updateConfig(stream.name, 'alias', e.target.value)}
                                    style={{ color: typeKey === 'ignored' ? '#999' : 'inherit' }}
                                />
                            </div>
                            <select 
                                className="stream-tag"
                                value={stream.type}
                                onChange={(e) => updateConfig(stream.name, 'type', e.target.value)}
                                style={{ 
                                    backgroundColor: STREAM_TYPES[stream.type].bg, 
                                    color: STREAM_TYPES[stream.type].color 
                                }}
                            >
                                <option value="active">Active</option>
                                <option value="side">Side Hustle</option>
                                <option value="passive">Passive</option>
                                <option value="ignored">Ignored</option>
                            </select>
                        </div>
                        
                        <div className="stream-stats" onClick={() => toggleExpand(stream.name)} style={{ cursor: 'pointer' }}>
                            <div className="stat-block">
                                <label>Monthly Avg</label>
                                <span className={`amount ${typeKey === 'ignored' ? 'text-gray-500' : 'text-green-700'}`}>
                                    ${stream.monthlyAvg.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                </span>
                            </div>
                            {typeKey !== 'ignored' && (
                                <div className="stat-block text-right">
                                    <label>Target (10X)</label>
                                    <input 
                                        type="number" 
                                        className="target-input" 
                                        placeholder="$0"
                                        value={stream.target}
                                        onChange={(e) => updateConfig(stream.name, 'target', e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Progress Bar */}
                        {stream.target > 0 && typeKey !== 'ignored' && (
                            <div className="progress-track">
                                <div 
                                    className="progress-fill" 
                                    style={{ 
                                        width: `${Math.min((stream.monthlyAvg / stream.target) * 100, 100)}%`,
                                        backgroundColor: STREAM_TYPES[stream.type].color 
                                    }}
                                ></div>
                            </div>
                        )}

                        {/* Transaction Drill-down */}
                        {expandedStream === stream.name && (
                            <div className="mt-4 pt-3 border-t border-[var(--border-color)]">
                                <p className="text-xs font-bold text-[var(--text-secondary)] mb-2 uppercase">Recent Transactions (Top 5)</p>
                                <ul className="space-y-2">
                                    {stream.transactions.slice(0, 5).map((t, tIdx) => (
                                        <li key={tIdx} className="flex justify-between items-center text-sm">
                                            <div className="flex gap-2 items-baseline overflow-hidden">
                                                <span className="text-[10px] text-gray-500 font-mono whitespace-nowrap">{t.date}</span>
                                                <span className="truncate text-gray-300" title={t.name}>{t.name}</span>
                                            </div>
                                            <span className="text-green-500 font-mono text-xs whitespace-nowrap">
                                                +${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                                {stream.transactions.length > 5 && (
                                    <p className="text-[10px] text-center text-gray-500 mt-2 italic">
                                        + {stream.transactions.length - 5} more transactions
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="income-streams-widget widget-card">
            <h2 className="widget-title">Income Streams (Wealth Creation)</h2>
            
            <div className="total-income-banner">
                <div className="banner-left">
                    <h3>Total Monthly Income</h3>
                    <div className="value">${totalIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                </div>
                <div className="banner-right">
                    <div className="passive-ratio">
                        <strong>{passiveRatio.toFixed(1)}%</strong> Passive
                    </div>
                    <div className="flex flex-col items-end gap-1 mt-1">
                        <span className="text-xs text-green-100">Target: 50%</span>
                        <button 
                            onClick={() => setShowIgnored(!showIgnored)}
                            className="text-[10px] text-white/60 hover:text-white underline cursor-pointer bg-transparent border-none p-0"
                        >
                            {showIgnored ? 'Hide Ignored' : 'Show Ignored'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="streams-list">
                {renderStreamGroup('passive')}
                {renderStreamGroup('side')}
                {renderStreamGroup('active')}
                {renderStreamGroup('ignored')}
                
                {enrichedStreams.length === 0 && (
                    <p className="no-data">No income detected. Check filters.</p>
                )}
            </div>
        </div>
    );
};

export default IncomeStreams;
