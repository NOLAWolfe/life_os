import React, { useState, useMemo, useEffect } from 'react';
import { useFinancials } from '../../../contexts/FinancialContext';
import {
    getOrphanedTransactions,
    suggestKeyword,
    getAllBillNodes,
} from '../../../services/mappingService';
import { initialNodes, initialEdges } from '../../../services/defaults';
import strategyService from '../../../services/strategyService';
import './TransactionMapper.css';

const TransactionMapper = () => {
    const { transactions, accounts, debtAccounts } = useFinancials();
    const [mappingRules, setMappingRules] = useState({});
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);

    // Load config & SYNC with Real Data
    useEffect(() => {
        const savedRules = localStorage.getItem('paymentFlowRules');
        if (savedRules) setMappingRules(JSON.parse(savedRules));

        const savedNodes = localStorage.getItem('paymentFlowNodes');
        const baseNodes = savedNodes ? JSON.parse(savedNodes) : initialNodes;

        const savedEdges = localStorage.getItem('paymentFlowEdges');
        if (savedEdges) setEdges(JSON.parse(savedEdges));

        // Enforce Truth
        const { nodes: syncedNodes } = strategyService.syncNodesWithRealData(baseNodes, accounts || [], debtAccounts || []);
        setNodes(syncedNodes);

    }, [accounts, debtAccounts]);

    const orphans = useMemo(() => {
        return getOrphanedTransactions(transactions, mappingRules);
    }, [transactions, mappingRules]);

    // Local state for the "Mapping Action" currently being performed
    const [selectedOrphan, setSelectedOrphan] = useState(null);
    const [targetNodeId, setTargetNodeId] = useState('');
    const [customKeyword, setCustomKeyword] = useState('');
    const [isCreatingNewNode, setIsCreatingNewNode] = useState(false);
    const [newNodeName, setNewNodeName] = useState('');
    const [sourceAccountFilter, setSourceAccountFilter] = useState('All');
    const [payFromAccountId, setPayFromAccountId] = useState('');

    // Handlers
    const handleSelectOrphan = (orphan) => {
        setSelectedOrphan(orphan);
        setCustomKeyword(suggestKeyword(orphan.name));
        setTargetNodeId('');
        setIsCreatingNewNode(false);
        setNewNodeName(orphan.name.split(' ').slice(0, 2).join(' ')); // Default new name

        // Auto-select "Pay From" based on transaction source
        const matchingAccountNode = nodes.find(
            (n) =>
                (n.className?.includes('node-account') || n.className?.includes('node-hub')) &&
                orphan.accountList.some((acc) =>
                    n.data.label.toLowerCase().includes(acc.toLowerCase())
                )
        );
        setPayFromAccountId(matchingAccountNode ? matchingAccountNode.id : '');
    };

    const handleSaveMapping = () => {
        if (!selectedOrphan || !customKeyword) return;

        let finalNodeId = targetNodeId;
        let updatedEdges = [...edges];

        // 1. If Creating New Node
        if (isCreatingNewNode) {
            if (!newNodeName) return alert('Please name the new bill.');

            const newNodeId = `node-bill-${Date.now()}`;
            const newNode = {
                id: newNodeId,
                data: { label: newNodeName },
                position: { x: 100, y: 400 }, // Default position, user can move later
                className: 'node-bill',
            };

            // Save new node
            const updatedNodes = [...nodes, newNode];
            setNodes(updatedNodes);
            localStorage.setItem('paymentFlowNodes', JSON.stringify(updatedNodes));
            finalNodeId = newNodeId;

            // If "Pay From" is selected, create the edge
            if (payFromAccountId) {
                const newEdge = {
                    id: `e-${payFromAccountId}-${newNodeId}-${Date.now()}`,
                    source: payFromAccountId,
                    target: newNodeId,
                    animated: false,
                };
                updatedEdges.push(newEdge);
                setEdges(updatedEdges);
                localStorage.setItem('paymentFlowEdges', JSON.stringify(updatedEdges));
            }
        }

        if (!finalNodeId) return alert('Please select a target bill.');

        // 2. Add Rule to Node
        const currentKeywords = mappingRules[finalNodeId] || [];
        const updatedRules = {
            ...mappingRules,
            [finalNodeId]: [...currentKeywords, customKeyword.toLowerCase()],
        };

        setMappingRules(updatedRules);
        localStorage.setItem('paymentFlowRules', JSON.stringify(updatedRules));

        // Reset UI
        setSelectedOrphan(null);
    };

    // Derived Lists
    const eligibleNodes = useMemo(() => getAllBillNodes(nodes), [nodes]);
    const eligibleAccountNodes = nodes.filter(
        (n) => n.className?.includes('node-account') || n.className?.includes('node-hub')
    );

    const uniqueSourceAccounts = useMemo(() => {
        const accs = new Set();
        orphans.forEach((o) => o.accountList.forEach((a) => accs.add(a)));
        return Array.from(accs).sort();
    }, [orphans]);

    const filteredOrphans = useMemo(() => {
        if (sourceAccountFilter === 'All') return orphans;
        return orphans.filter((o) => o.accountList.includes(sourceAccountFilter));
    }, [orphans, sourceAccountFilter]);

    return (
        <div className="transaction-mapper widget-card">
            <header className="widget-header mb-4 flex justify-between items-end">
                <div>
                    <h2 className="widget-title">🎩 The Sorting Hat</h2>
                    <p className="text-sm text-[var(--text-secondary)]">
                        Unassigned transactions: {orphans.length}
                    </p>
                </div>

                {/* Account Filter */}
                <div className="flex flex-col items-end">
                    <label className="text-[10px] uppercase text-[var(--text-secondary)] font-bold mb-1">
                        Filter Source
                    </label>
                    <select
                        className="bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs rounded px-2 py-1"
                        value={sourceAccountFilter}
                        onChange={(e) => setSourceAccountFilter(e.target.value)}
                    >
                        <option value="All">All Accounts</option>
                        {uniqueSourceAccounts.map((acc) => (
                            <option key={acc} value={acc}>
                                {acc}
                            </option>
                        ))}
                    </select>
                </div>
            </header>

            <div className="mapper-container grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* LIST COLUMN */}
                <div className="orphans-list col-span-1 border-r border-[var(--border-color)] pr-4 max-h-[500px] overflow-y-auto">
                    {filteredOrphans.slice(0, 50).map((orphan, idx) => (
                        <div
                            key={idx}
                            className={`orphan-item p-3 mb-2 rounded cursor-pointer border transition-colors ${selectedOrphan?.name === orphan.name ? 'border-[var(--accent-color)] bg-[var(--bg-secondary)]' : 'border-transparent hover:bg-[var(--bg-secondary)]'}`}
                            onClick={() => handleSelectOrphan(orphan)}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span
                                    className="font-medium text-sm truncate w-2/3"
                                    title={orphan.name}
                                >
                                    {orphan.name}
                                </span>
                                <div className="flex gap-1">
                                    {orphan.isLikelyBill && (
                                        <span className="text-[8px] bg-blue-900/50 text-blue-300 px-1 rounded uppercase font-bold">Likely Bill</span>
                                    )}
                                    <span className="text-xs bg-gray-700 px-1.5 py-0.5 rounded">
                                        {orphan.count}
                                    </span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center text-xs text-[var(--text-secondary)]">
                                <div className="flex flex-col">
                                    <span className="font-mono text-[var(--text-primary)]">
                                        ~${Math.round(orphan.averageAmount)}
                                    </span>
                                </div>
                                <div className="text-right max-w-[50%] truncate">
                                    <span title={orphan.accountList.join(', ')}>
                                        {orphan.accountList[0]}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredOrphans.length === 0 && (
                        <p className="text-center text-gray-500 py-10">
                            All clean! No orphans found.
                        </p>
                    )}
                </div>

                {/* ACTION COLUMN */}
                <div className="mapping-action col-span-2 flex flex-col justify-center items-center p-6 bg-[var(--bg-secondary)] rounded-lg min-h-[300px]">
                    {selectedOrphan ? (
                        <div className="w-full max-w-lg space-y-6">
                            {/* Detailed Info Card */}
                            <div className="bg-[var(--bg-primary)] p-4 rounded border border-[var(--border-color)] mb-6">
                                <h3 className="text-lg font-bold mb-2 text-center text-[var(--accent-color)]">
                                    {selectedOrphan.name}
                                </h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-[10px] text-[var(--text-secondary)] uppercase">
                                            Source Account
                                        </p>
                                        <p className="font-medium flex items-center gap-2">
                                            🏦 {selectedOrphan.accountList.join(', ')}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-[var(--text-secondary)] uppercase">
                                            Avg Amount
                                        </p>
                                        <p className="font-medium font-mono">
                                            ${Math.round(selectedOrphan.averageAmount)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-[var(--text-secondary)] uppercase">
                                            Last Seen
                                        </p>
                                        <p>
                                            {new Date(selectedOrphan.lastDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-[var(--text-secondary)] uppercase">
                                            Occurrences
                                        </p>
                                        <p>{selectedOrphan.count} times</p>
                                    </div>
                                </div>
                            </div>

                            {/* Step 1: Assign to Node */}
                            <div className="space-y-3 p-4 border border-[var(--border-color)] rounded bg-[var(--bg-primary)]">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-bold uppercase text-[var(--text-secondary)]">
                                        1. Assign to Bill
                                    </label>
                                    <div className="flex bg-[var(--bg-secondary)] p-1 rounded">
                                        <button
                                            className={`px-3 py-1 text-xs rounded ${!isCreatingNewNode ? 'bg-[var(--accent-color)] text-white shadow' : 'text-gray-400 hover:text-white'}`}
                                            onClick={() => setIsCreatingNewNode(false)}
                                        >
                                            Existing
                                        </button>
                                        <button
                                            className={`px-3 py-1 text-xs rounded ${isCreatingNewNode ? 'bg-[var(--accent-color)] text-white shadow' : 'text-gray-400 hover:text-white'}`}
                                            onClick={() => setIsCreatingNewNode(true)}
                                        >
                                            Create New
                                        </button>
                                    </div>
                                </div>

                                {!isCreatingNewNode ? (
                                    <select
                                        className="w-full p-2 rounded bg-[var(--bg-secondary)] border border-[var(--accent-color)] focus:ring-2 focus:ring-blue-500"
                                        value={targetNodeId}
                                        onChange={(e) => setTargetNodeId(e.target.value)}
                                    >
                                        <option value="">Select Existing Bill...</option>
                                        {eligibleNodes.map((n) => (
                                            <option key={n.id} value={n.id}>
                                                {n.data.label}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <div className="space-y-3 animate-fade-in">
                                        <div>
                                            <p className="text-[10px] mb-1 text-[var(--text-secondary)]">
                                                New Bill Name
                                            </p>
                                            <input
                                                className="w-full p-2 rounded bg-[var(--bg-secondary)] border border-[var(--accent-color)]"
                                                placeholder="e.g. Netflix"
                                                value={newNodeName}
                                                onChange={(e) => setNewNodeName(e.target.value)}
                                                autoFocus
                                            />
                                        </div>

                                        <div>
                                            <p className="text-[10px] mb-1 text-[var(--text-secondary)]">
                                                Pay From Account (Creates Logic Flow)
                                            </p>
                                            <select
                                                className="w-full p-2 rounded bg-[var(--bg-secondary)] border border-gray-600"
                                                value={payFromAccountId}
                                                onChange={(e) =>
                                                    setPayFromAccountId(e.target.value)
                                                }
                                            >
                                                <option value="">Select Source Account...</option>
                                                {eligibleAccountNodes.map((n) => (
                                                    <option key={n.id} value={n.id}>
                                                        {n.data.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Step 2: Define Keyword */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-[var(--text-secondary)]">
                                    2. Keyword Match Rule
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        className="flex-1 p-2 rounded bg-[var(--bg-primary)] border border-gray-600 focus:border-[var(--accent-color)]"
                                        value={customKeyword}
                                        onChange={(e) => setCustomKeyword(e.target.value)}
                                        placeholder="e.g. netflix"
                                    />
                                </div>
                                <p className="text-[10px] text-gray-400">
                                    Transactions containing this text will be mapped to the selected
                                    bill.
                                </p>
                            </div>

                            <button
                                className="w-full py-3 mt-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded shadow-lg transition-transform transform active:scale-95 flex justify-center items-center gap-2"
                                onClick={handleSaveMapping}
                            >
                                <span>✅</span> Save Rule
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
