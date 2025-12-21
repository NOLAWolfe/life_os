import React, { useState, useMemo, useEffect } from 'react';
import { useFinancials } from '../../contexts/FinancialContext';
import { getOrphanedTransactions, suggestKeyword } from '../../services/mappingService';
import './TransactionMapper.css';

const TransactionMapper = () => {
    const { transactions } = useFinancials();
    const [mappingRules, setMappingRules] = useState({});
    const [nodes, setNodes] = useState([]);
    
    // Load existing config from LocalStorage (Shared with PaymentFlow)
    useEffect(() => {
        const savedRules = localStorage.getItem('paymentFlowRules');
        if (savedRules) setMappingRules(JSON.parse(savedRules));

        const savedNodes = localStorage.getItem('paymentFlowNodes');
        if (savedNodes) setNodes(JSON.parse(savedNodes));
    }, []);

    const orphans = useMemo(() => {
        return getOrphanedTransactions(transactions, mappingRules);
    }, [transactions, mappingRules]);

    // Local state for the "Mapping Action" currently being performed
    const [selectedOrphan, setSelectedOrphan] = useState(null);
    const [targetNodeId, setTargetNodeId] = useState('');
    const [customKeyword, setCustomKeyword] = useState('');
    const [isCreatingNewNode, setIsCreatingNewNode] = useState(false);
    const [newNodeName, setNewNodeName] = useState('');

    // Handlers
    const handleSelectOrphan = (orphan) => {
        setSelectedOrphan(orphan);
        setCustomKeyword(suggestKeyword(orphan.name));
        setTargetNodeId('');
        setIsCreatingNewNode(false);
        setNewNodeName(orphan.name.split(' ').slice(0, 2).join(' ')); // Default new name
    };

    const handleSaveMapping = () => {
        if (!selectedOrphan || !customKeyword) return;

        let finalNodeId = targetNodeId;

        // 1. If Creating New Node
        if (isCreatingNewNode) {
            if (!newNodeName) return alert('Please name the new bill.');
            
            const newNodeId = `node-bill-${Date.now()}`;
            const newNode = {
                id: newNodeId,
                data: { label: newNodeName },
                position: { x: 100, y: 400 }, // Default position, user can move later
                className: 'node-bill'
            };
            
            // Save new node
            const updatedNodes = [...nodes, newNode];
            setNodes(updatedNodes);
            localStorage.setItem('paymentFlowNodes', JSON.stringify(updatedNodes));
            finalNodeId = newNodeId;
        }

        if (!finalNodeId) return alert('Please select a target bill.');

        // 2. Add Rule to Node
        const currentKeywords = mappingRules[finalNodeId] || [];
        const updatedRules = {
            ...mappingRules,
            [finalNodeId]: [...currentKeywords, customKeyword.toLowerCase()]
        };

        setMappingRules(updatedRules);
        localStorage.setItem('paymentFlowRules', JSON.stringify(updatedRules));

        // Reset UI
        setSelectedOrphan(null);
    };

    const eligibleNodes = nodes.filter(n => n.className?.includes('node-bill'));

    return (
        <div className="transaction-mapper widget-card">
            <header className="widget-header mb-4">
                <h2 className="widget-title">🎩 The Sorting Hat (Transaction Mapper)</h2>
                <p className="text-sm text-[var(--text-secondary)]">
                    Found {orphans.length} unassigned transaction groups. Map them to bills to improve accuracy.
                </p>
            </header>

            <div className="mapper-container grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* LIST COLUMN */}
                <div className="orphans-list col-span-1 border-r border-[var(--border-color)] pr-4 max-h-[500px] overflow-y-auto">
                    {orphans.slice(0, 50).map((orphan, idx) => (
                        <div 
                            key={idx} 
                            className={`orphan-item p-3 mb-2 rounded cursor-pointer border transition-colors ${selectedOrphan?.name === orphan.name ? 'border-[var(--accent-color)] bg-[var(--bg-secondary)]' : 'border-transparent hover:bg-[var(--bg-secondary)]'}`}
                            onClick={() => handleSelectOrphan(orphan)}
                        >
                            <div className="flex justify-between items-start">
                                <span className="font-medium text-sm truncate w-3/4" title={orphan.name}>{orphan.name}</span>
                                <span className="text-xs bg-gray-700 px-1.5 py-0.5 rounded">{orphan.count}</span>
                            </div>
                            <div className="flex justify-between mt-1 text-xs text-[var(--text-secondary)]">
                                <span>~${Math.round(orphan.averageAmount)}</span>
                                <span>Last: {orphan.lastDate}</span>
                            </div>
                        </div>
                    ))}
                    {orphans.length === 0 && <p className="text-center text-gray-500 py-10">All clean! No orphans found.</p>}
                </div>

                {/* ACTION COLUMN */}
                <div className="mapping-action col-span-2 flex flex-col justify-center items-center p-6 bg-[var(--bg-secondary)] rounded-lg min-h-[300px]">
                    {selectedOrphan ? (
                        <div className="w-full max-w-md space-y-6">
                            <div className="text-center mb-6">
                                <h3 className="text-lg font-bold mb-1">Mapping: "{selectedOrphan.name}"</h3>
                                <p className="text-sm text-[var(--text-secondary)]">
                                    Appears {selectedOrphan.count} times. Avg: ${Math.round(selectedOrphan.averageAmount)}
                                </p>
                            </div>

                            {/* Step 1: Assign to Node */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-[var(--text-secondary)]">1. Assign to Bill</label>
                                <div className="flex gap-2">
                                    <select 
                                        className={`flex-1 p-2 rounded bg-[var(--bg-primary)] border ${isCreatingNewNode ? 'border-gray-700 text-gray-500' : 'border-[var(--accent-color)]'}`}
                                        value={targetNodeId}
                                        disabled={isCreatingNewNode}
                                        onChange={(e) => setTargetNodeId(e.target.value)}
                                    >
                                        <option value="">Select Existing Bill...</option>
                                        {eligibleNodes.map(n => (
                                            <option key={n.id} value={n.id}>{n.data.label}</option>
                                        ))}
                                    </select>
                                    <div className="flex items-center text-xs text-gray-400">OR</div>
                                    <button 
                                        className={`px-3 py-2 rounded text-xs border ${isCreatingNewNode ? 'bg-[var(--accent-color)] border-[var(--accent-color)] text-white' : 'border-gray-600 hover:border-gray-400'}`}
                                        onClick={() => setIsCreatingNewNode(!isCreatingNewNode)}
                                    >
                                        {isCreatingNewNode ? 'Creating New...' : 'Create New'}
                                    </button>
                                </div>
                                
                                {isCreatingNewNode && (
                                    <input 
                                        className="w-full p-2 mt-2 rounded bg-[var(--bg-primary)] border border-[var(--accent-color)]"
                                        placeholder="New Bill Name (e.g. Netflix)"
                                        value={newNodeName}
                                        onChange={(e) => setNewNodeName(e.target.value)}
                                        autoFocus
                                    />
                                )}
                            </div>

                            {/* Step 2: Define Keyword */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-[var(--text-secondary)]">2. Keyword Match Rule</label>
                                <input 
                                    className="w-full p-2 rounded bg-[var(--bg-primary)] border border-gray-600 focus:border-[var(--accent-color)]"
                                    value={customKeyword}
                                    onChange={(e) => setCustomKeyword(e.target.value)}
                                    placeholder="e.g. netflix"
                                />
                                <p className="text-[10px] text-gray-400">Any future transaction containing this text will be mapped to this bill.</p>
                            </div>

                            <button 
                                className="w-full py-3 mt-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded shadow-lg transition-transform transform active:scale-95"
                                onClick={handleSaveMapping}
                            >
                                ✅ Save Rule
                            </button>

                        </div>
                    ) : (
                        <div className="text-center text-gray-500">
                            <span className="text-4xl block mb-2">👈</span>
                            <p>Select a transaction from the left to map it.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TransactionMapper;
