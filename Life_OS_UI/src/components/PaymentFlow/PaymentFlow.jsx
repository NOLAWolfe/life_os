import React, { useCallback, useMemo, useEffect } from 'react';
import {
  ReactFlow,
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useFinancials } from '../../contexts/FinancialContext';
import './PaymentFlow.css';

const initialNodes = [
  // Tier 0: Income (Placeholder if dynamic fails)
  { id: 'income', data: { label: '💰 Income (Paycheck)' }, position: { x: 250, y: 0 }, className: 'node-hub' },
  
  // Tier 1: Hubs
  { id: 'navy-fed', data: { label: '🏦 Navy Fed (Primary)' }, position: { x: 250, y: 150 }, className: 'node-hub' },
  
  // Tier 3: Strategy / MMI
  { id: 'mmi-group', data: { label: '🛡️ MMI / Debt Mgmt' }, position: { x: 600, y: 450 }, className: 'node-bill' },

  // Tier 2: Secondary Accounts / Liabilities
  { id: 'chase-8211', data: { label: '🏠 Chase 8211 (Joint/House)' }, position: { x: 50, y: 300 }, className: 'node-account' },
  
  // Tier 3: Target Bills
  { id: 'mortgage', data: { label: 'Mortgage/Housing' }, position: { x: -50, y: 450 }, className: 'node-bill' },
  { id: 'auto-loan', data: { label: 'Auto Loan' }, position: { x: 150, y: 450 }, className: 'node-bill' },
  { id: 'savings', data: { label: 'Savings' }, position: { x: 250, y: 450 }, className: 'node-bill' },
  { id: 'phone-wifi', data: { label: 'Utility Bills' }, position: { x: 350, y: 450 }, className: 'node-bill' },
  { id: 'subs', data: { label: 'Subscriptions' }, position: { x: 450, y: 450 }, className: 'node-bill' },
];

const initialEdges = [
  { id: 'e-inc-navy', source: 'income', target: 'navy-fed', animated: true },
  { id: 'e-navy-chase', source: 'navy-fed', target: 'chase-8211', label: 'Bulk Transfer' },
  { id: 'e-navy-mmi', source: 'navy-fed', target: 'mmi-group', label: 'Consolidated Pmt', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e-chase-mortgage', source: 'chase-8211', target: 'mortgage' },
  { id: 'e-navy-auto', source: 'navy-fed', target: 'auto-loan' },
  { id: 'e-navy-savings', source: 'navy-fed', target: 'savings' },
];

const PaymentFlow = ({ viewMode = 'map', setViewMode }) => {
    const { transactions, accounts, incomeStreams } = useFinancials();
    
    // Load Nodes/Edges from LocalStorage or use Default
    const [nodes, setNodes, onNodesChange] = useNodesState(() => {
        const saved = localStorage.getItem('paymentFlowNodes');
        return saved ? JSON.parse(saved) : initialNodes;
    });
    const [edges, setEdges, onEdgesChange] = useEdgesState(() => {
        const saved = localStorage.getItem('paymentFlowEdges');
        return saved ? JSON.parse(saved) : initialEdges;
    });

    const [selectedNode, setSelectedNode] = React.useState(null);
    const [newRule, setNewRule] = React.useState('');
    const [expandedRows, setExpandedRows] = React.useState({}); 

    // -- Auto-Populate CC Liabilities (Tier 2) --
    useEffect(() => {
        if (!accounts || accounts.length === 0) return;

        setNodes(currentNodes => {
            const newNodes = [...currentNodes];
            let hasChanges = false;

            accounts.forEach(acc => {
                const type = (acc.type || '').toLowerCase();
                const group = (acc.group || '').toLowerCase();
                
                // User requirement: CC Liabilities only, exclude Student Loans
                const isCC = type.includes('credit') || group.includes('credit');
                const isStudentLoan = acc.name?.toLowerCase().includes('student') || type.includes('student');

                if (!isCC || isStudentLoan) return;

                const exists = currentNodes.some(n => n.id === acc.account_id || n.data.label.includes(acc.name));
                if (!exists) {
                    hasChanges = true;
                    newNodes.push({
                        id: acc.account_id || `node-liab-${Date.now()}`,
                        data: { label: `💳 ${acc.name}` },
                        position: { x: 450, y: 300 }, // Tier 2
                        className: 'node-account'
                    });
                }
            });

            return hasChanges ? newNodes : currentNodes;
        });
    }, [accounts]);

    // -- Defensive Adapter: Dynamic Income Streams (Tier 0) --
    const { dynamicNodes, dynamicEdges, totalMonthlyIncome } = useMemo(() => {
        if (!incomeStreams || incomeStreams.length === 0) {
            return { dynamicNodes: [], dynamicEdges: [], totalMonthlyIncome: 0 };
        }

        const config = JSON.parse(localStorage.getItem('incomeStreamConfig') || '{}');
        const dns = [];
        const des = [];
        let total = 0;

        incomeStreams.forEach((stream, index) => {
            const streamConf = config[stream.name] || {};
            if (streamConf.type === 'ignored') return;

            const id = `dynamic-income-${stream.name.replace(/\s+/g, '-').toLowerCase()}`;
            const avg = Math.round(stream.average || 0);
            total += avg;

            dns.push({
                id,
                data: { label: `💰 ${streamConf.alias || stream.name} ($${avg.toLocaleString()}/mo)` },
                position: { x: (index - (incomeStreams.length / 2)) * 250 + 250, y: 0 },
                className: 'node-hub ring-2 ring-green-500/50',
                type: 'input'
            });

            des.push({
                id: `edge-${id}-navy`,
                source: id,
                target: 'navy-fed',
                animated: true,
                style: { stroke: '#10b981', strokeWidth: 2 },
                label: 'Income'
            });
        });

        return { dynamicNodes: dns, dynamicEdges: des, totalMonthlyIncome: total };
    }, [incomeStreams]);

    // Load rules from localStorage
    const [rules, setRules] = React.useState(() => {
        const saved = localStorage.getItem('paymentFlowRules');
        return saved ? JSON.parse(saved) : {};
    });

    useEffect(() => {
        localStorage.setItem('paymentFlowRules', JSON.stringify(rules));
    }, [rules]);

    // -- Node Statistics (Balances & Bill Costs) --
    const { nodeStats, totalMonthlyCommitments } = useMemo(() => {
        const stats = {};
        let totalCommitments = 0;
        
        // 1. Calculate Account Balances
        if (accounts) {
            nodes.forEach(node => {
                if (node.className?.includes('node-account') || node.className?.includes('node-hub')) {
                    const match = accounts.find(acc => 
                        node.data.label.toLowerCase().includes(acc.name.toLowerCase()) || 
                        acc.name.toLowerCase().includes(node.data.label.toLowerCase())
                    );
                    if (match) {
                        stats[node.id] = { 
                            type: 'balance', 
                            value: match.balances.current,
                            label: `$${match.balances.current.toLocaleString()}`
                        };
                    }
                }
            });
        }

        // 2. Calculate Bill Costs (Avg Monthly)
        if (transactions && rules) {
            Object.entries(rules).forEach(([nodeId, keywords]) => {
                const matches = transactions.filter(t => 
                    t.type === 'debit' &&
                    keywords.some(k => t.name.toLowerCase().includes(k))
                );

                if (matches.length > 0) {
                    const totalCheck = matches.reduce((sum, t) => sum + t.amount, 0);
                    const dates = matches.map(t => new Date(t.date));
                    const minDate = new Date(Math.min(...dates));
                    const maxDate = new Date(Math.max(...dates));
                    const daysDiff = (maxDate - minDate) / (1000 * 60 * 60 * 24);
                    const months = Math.max(daysDiff / 30, 1);
                    
                    const avgMonthly = totalCheck / months;
                    totalCommitments += avgMonthly;

                    stats[nodeId] = {
                        type: 'bill',
                        value: avgMonthly,
                        label: `-$${Math.round(avgMonthly).toLocaleString()}/mo`
                    };
                }
            });
        }
        
        return { nodeStats: stats, totalMonthlyCommitments: totalCommitments };
    }, [nodes, accounts, transactions, rules]);

    // -- The Big Picture: Remaining Funds Node (Tier 4) --
    const remainingFundsNode = useMemo(() => {
        const remaining = totalMonthlyIncome - totalMonthlyCommitments;
        const isHealthy = remaining > 0;

        return {
            id: 'node-remaining-funds',
            data: { 
                label: `🌟 Remaining Funds\n$${Math.round(remaining).toLocaleString()}/mo` 
            },
            position: { x: 250, y: 650 }, // Tier 4 (Bottom)
            className: `node-remaining ${isHealthy ? 'healthy' : 'tight'}`, // Corrected class name
            type: 'output',
            draggable: false
        };
    }, [totalMonthlyIncome, totalMonthlyCommitments]);

    // Merge State nodes with Dynamic nodes and Remaining Funds
    const finalNodes = useMemo(() => {
        const hasDynamic = dynamicNodes.length > 0;
        const filteredNodes = nodes.filter(n => {
            if (hasDynamic && n.id === 'income') return false;
            return true;
        });

        const allNodes = [...filteredNodes, ...dynamicNodes];
        
        // Add Remaining Funds node only in map view
        if (viewMode === 'map') {
            allNodes.push(remainingFundsNode);
        }

        return allNodes;
    }, [nodes, dynamicNodes, remainingFundsNode, viewMode]);

    const finalEdges = useMemo(() => {
        const hasDynamic = dynamicEdges.length > 0;
        const filteredEdges = edges.filter(e => {
            if (hasDynamic && e.source === 'income') return false;
            return true;
        });
        return [...filteredEdges, ...dynamicEdges];
    }, [edges, dynamicEdges]);

    // -- Actions --
    const saveLayout = () => {
        localStorage.setItem('paymentFlowNodes', JSON.stringify(nodes));
        localStorage.setItem('paymentFlowEdges', JSON.stringify(edges));
        alert('Strategy layout saved!');
    };

    const resetLayout = () => {
        if (confirm('Reset to default layout? Unsaved changes will be lost.')) {
            setNodes(initialNodes);
            setEdges(initialEdges);
            localStorage.removeItem('paymentFlowNodes');
            localStorage.removeItem('paymentFlowEdges');
        }
    };

    const reorganizeLayout = () => {
        // Automatically snap nodes to their designated tiers for "The Sorting Hat" effect
        setNodes(nds => nds.map(node => {
            let y = 0;
            if (node.id === 'income' || node.id.startsWith('dynamic-income')) y = 0;
            else if (node.className?.includes('node-hub')) y = 150;
            else if (node.className?.includes('node-account')) y = 300;
            else if (node.className?.includes('node-bill')) y = 450;
            
            return {
                ...node,
                position: { ...node.position, y }
            };
        }));
    };

    const addNode = () => {
        const label = prompt('Node Name:');
        if (!label) return;
        const type = prompt('Type (hub, account, bill):', 'bill');
        const newNode = {
            id: `node-${Date.now()}`,
            data: { label },
            position: { x: 100, y: 100 },
            className: `node-${type || 'bill'}`
        };
        setNodes((nds) => nds.concat(newNode));
    };

    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
    const onNodeClick = useCallback((event, node) => setSelectedNode(node), []);

    const addRule = (e) => {
        e.preventDefault();
        if (!selectedNode || !newRule) return;
        const nodeId = selectedNode.id;
        const currentRules = rules[nodeId] || [];
        if (!currentRules.includes(newRule.toLowerCase())) {
            setRules({ ...rules, [nodeId]: [...currentRules, newRule.toLowerCase()] });
        }
        setNewRule('');
    };

    const removeRule = (nodeId, ruleToRemove) => {
        setRules({ ...rules, [nodeId]: rules[nodeId].filter(r => r !== ruleToRemove) });
    };

    const updateBillSource = (billId, newSourceId) => {
        if (!newSourceId) return;
        setEdges(currentEdges => {
            const filtered = currentEdges.filter(e => e.target !== billId);
            const newEdge = { id: `e-${newSourceId}-${billId}-${Date.now()}`, source: newSourceId, target: billId, animated: false };
            return [...filtered, newEdge];
        });
    };

    const updateNodeData = (nodeId, field, value) => {
        setNodes(currentNodes => currentNodes.map(n => {
            if (n.id === nodeId) return { ...n, data: { ...n.data, [field]: value } };
            return n;
        }));
    };

    // -- Audit Logic (Drift Detection) --
    const auditResults = useMemo(() => {
        if (!transactions) return [];
        const issues = [];
        const nodeToParentMap = {};
        finalEdges.forEach(edge => { nodeToParentMap[edge.target] = edge.source; });

        const accountMapping = {
            'chase-8211': ['chase', '8211'],
            'navy-fed': ['navy federal', 'navy fed']
        };

        Object.entries(rules).forEach(([nodeId, keywords]) => {
            const parentId = nodeToParentMap[nodeId];
            if (!parentId || !accountMapping[parentId]) return;
            const expectedKeywords = accountMapping[parentId];
            const matchedTransactions = transactions.filter(t => keywords.some(k => t.name.toLowerCase().includes(k)));

            matchedTransactions.forEach(t => {
                const actualAccount = t.accountName.toLowerCase();
                const isCorrect = expectedKeywords.some(ek => actualAccount.includes(ek));
                if (!isCorrect) {
                    issues.push({
                        nodeId: nodeId,
                        message: `Drift: ${t.name} ($${t.amount}) found in ${t.accountName}. Expected: ${parentId}`,
                        severity: 'error'
                    });
                }
            });
        });
        return issues;
    }, [transactions, rules, finalEdges]);

    // Apply Visuals
    const auditedNodes = useMemo(() => {
        return finalNodes.map(node => {
            const hasIssue = auditResults.find(r => r.nodeId === node.id);
            const stat = nodeStats[node.id];
            let label = node.data.label;

            if (stat && !node.id.startsWith('dynamic-income-') && node.id !== 'node-remaining-funds') {
                label = `${node.data.label} (${stat.label})`;
            }

            if (hasIssue) {
                return { ...node, className: `${node.className} ring-4 ring-red-500`, data: { ...node.data, label: `${label} ⚠️` } };
            }
            return { ...node, data: { ...node.data, label } };
        });
    }, [finalNodes, auditResults, nodeStats]);

    const planHierarchy = useMemo(() => {
        const incomingEdges = new Set(finalEdges.map(e => e.target));
        const roots = finalNodes.filter(n => !incomingEdges.has(n.id) && n.id !== 'node-remaining-funds');
        const buildTree = (nodeId) => {
            const childrenEdges = finalEdges.filter(e => e.source === nodeId);
            return childrenEdges.map(e => {
                const childNode = finalNodes.find(n => n.id === e.target);
                return { edge: e, node: childNode, children: childNode ? buildTree(childNode.id) : [] };
            });
        };
        return roots.map(root => ({ node: root, children: buildTree(root.id) }));
    }, [finalNodes, finalEdges]);

    const renderPlanItem = (item, depth = 0) => {
        const stat = nodeStats[item.node?.id];
        return (
            <div key={item.node?.id || Math.random()} style={{ marginLeft: `${depth * 20}px` }} className="plan-item mb-2 border-l border-gray-700 pl-2">
                <div className="flex items-center gap-2">
                    <span className="text-gray-400">{depth > 0 ? '└─' : '•'}</span>
                    <span className={`font-medium ${depth === 0 ? 'text-lg text-blue-400' : 'text-sm'}`}>{item.node?.data.label}</span>
                    {stat && <span className={`text-xs px-2 py-0.5 rounded font-mono ${stat.type === 'balance' ? 'bg-green-900 text-green-200' : 'bg-orange-900 text-orange-200'}`}>{stat.label}</span>}
                    {item.edge?.label && <span className="text-xs bg-gray-700 px-2 py-0.5 rounded text-gray-300">{item.edge.label}</span>}
                </div>
                {item.children.map(child => renderPlanItem(child, depth + 1))}
            </div>
        );
    };

    return (
        <div className="widget-card flex flex-col h-full min-h-[700px]">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-[var(--border-color)]">
                <h2 className="text-xl font-bold text-[var(--accent-color)]">🗺️ Strategic Money Map</h2>
                <div className="flex gap-2">
                    <button onClick={addNode} className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded">+ Node</button>
                    <button onClick={reorganizeLayout} className="px-3 py-1 text-xs bg-purple-700 hover:bg-purple-600 rounded">✨ Auto-Tier</button>
                    <button onClick={saveLayout} className="px-3 py-1 text-xs bg-blue-700 hover:bg-blue-600 rounded">💾 Save</button>
                    <button onClick={resetLayout} className="px-3 py-1 text-xs bg-red-900/50 hover:bg-red-900 rounded text-red-200">Reset</button>
                </div>
            </div>
            
            <div className="flow-content-wrapper bg-[var(--bg-primary)] rounded-lg border border-[var(--border-color)] overflow-hidden">
                {viewMode === 'map' ? (
                    <>
                        <div className="flow-main">
                            <ReactFlow nodes={auditedNodes} edges={finalEdges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} onNodeClick={onNodeClick} fitView>
                                <Background color="var(--border-color)" gap={20} />
                                <Controls />
                                <MiniMap nodeColor={(n) => {
                                    if (n.className?.includes('node-hub')) return '#2575fc';
                                    if (n.className?.includes('node-account')) return '#4a5568';
                                    if (n.className?.includes('node-bill')) return '#2e7d32';
                                    if (n.className?.includes('node-remaining')) return '#f59e0b';
                                    return '#ccc';
                                }} />
                            </ReactFlow>
                        </div>
                        {selectedNode && (
                            <div className="node-inspector">
                                <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-sm">Inspector</h3><button onClick={() => setSelectedNode(null)} className="text-xs hover:text-red-500">Close</button></div>
                                <div className="mb-4">
                                    <p className="text-xs text-[var(--text-secondary)] uppercase font-bold mb-1">Target</p>
                                    <p className="text-sm font-medium">{selectedNode.data.label}</p>
                                    <button onClick={() => {setNodes(nodes.filter(n => n.id !== selectedNode.id)); setSelectedNode(null);}} className="mt-2 text-xs text-red-400 border border-red-900 px-2 py-1 rounded hover:bg-red-900/20">Delete</button>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-[var(--text-secondary)] uppercase font-bold mb-2">Merchant Rules</p>
                                    <div className="flex flex-wrap gap-1 mb-4">{(rules[selectedNode.id] || []).map(rule => (<span key={rule} className="rule-tag">{rule} <span onClick={() => removeRule(selectedNode.id, rule)} className="remove-rule">×</span></span>))}</div>
                                    <form onSubmit={addRule} className="mb-2"><input className="rule-input bg-[var(--input-bg)] border border-[var(--border-color)] rounded px-2 py-1 text-xs" placeholder="e.g. Netflix" value={newRule} onChange={e => setNewRule(e.target.value)}/></form>
                                </div>
                            </div>
                        )}
                    </>
                ) : viewMode === 'plan' ? (
                    <div className="p-8 overflow-y-auto h-full bg-[var(--bg-primary)]">
                        <h3 className="text-xl font-bold mb-6 border-b border-[var(--border-color)] pb-2">Manifest: The Strategy</h3>
                        <div className="space-y-4">{planHierarchy.map(item => renderPlanItem(item))}</div>
                    </div>
                ) : (
                    <div className="p-6 overflow-y-auto h-full bg-[var(--bg-primary)] text-[var(--text-primary)]">
                        <h3 className="text-xl font-bold mb-6 border-b border-[var(--border-color)] pb-2">Master Bills List (Control Panel)</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-[var(--border-color)] text-[var(--text-secondary)] text-sm uppercase">
                                        <th className="py-3 font-semibold w-1/5">Bill Name</th>
                                        <th className="py-3 font-semibold w-1/5">Source (Re-Route)</th>
                                        <th className="py-3 font-semibold w-1/6">Method</th>
                                        <th className="py-3 font-semibold w-1/6">Est. Cost</th>
                                        <th className="py-3 font-semibold w-1/6">Due Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {finalNodes
                                        .filter(n => n.className?.includes('node-bill'))
                                        .map(bill => {
                                            const stat = nodeStats[bill.id];
                                            const parentEdge = finalEdges.find(e => e.target === bill.id);
                                            const parentNode = parentEdge ? finalNodes.find(n => n.id === parentEdge.source) : null;
                                            const keywords = rules[bill.id] || [];
                                            const isExpanded = expandedRows[bill.id];

                                            const potentialSources = finalNodes.filter(n => 
                                                (n.className?.includes('node-hub') || n.className?.includes('node-account')) &&
                                                !n.id.startsWith('dynamic-income')
                                            );

                                            let allMatches = [];
                                            const breakdown = keywords.map(k => {
                                                const matches = transactions ? transactions.filter(t => 
                                                    t.type === 'debit' && t.name.toLowerCase().includes(k)
                                                ) : [];
                                                
                                                if (matches.length > 0) allMatches = [...allMatches, ...matches];
                                                if (matches.length === 0) return { name: k, cost: 0, count: 0, day: '-' };

                                                const total = matches.reduce((sum, t) => sum + t.amount, 0);
                                                const dates = matches.map(t => new Date(t.date));
                                                const minDate = new Date(Math.min(...dates));
                                                const maxDate = new Date(Math.max(...dates));
                                                const daysDiff = (maxDate - minDate) / (1000 * 60 * 60 * 24);
                                                const months = Math.max(daysDiff / 30, 1);
                                                const days = dates.map(d => d.getDate());
                                                const avgDay = Math.round(days.reduce((a, b) => a + b, 0) / days.length);

                                                return { name: k, cost: total / months, count: matches.length, day: avgDay };
                                            }).filter(b => b.cost > 0).sort((a,b) => b.cost - a.cost);

                                            let dueString = '-';
                                            if (allMatches.length > 0) {
                                                const days = allMatches.map(t => new Date(t.date).getDate());
                                                const avgDay = Math.round(days.reduce((a, b) => a + b, 0) / days.length);
                                                const getOrdinal = (n) => {
                                                    const s = ["th", "st", "nd", "rd"];
                                                    const v = n % 100;
                                                    return n + (s[(v - 20) % 10] || s[v] || s[0]);
                                                };
                                                dueString = getOrdinal(avgDay);
                                            }

                                            return (
                                                <React.Fragment key={bill.id}>
                                                    <tr className="border-b border-[var(--border-color)] hover:bg-[var(--bg-secondary)] transition-colors">
                                                        <td className="py-3 pr-4 font-medium flex items-center gap-2 cursor-pointer" onClick={() => setExpandedRows(prev => ({ ...prev, [bill.id]: !prev[bill.id] }))}>
                                                            <span className="text-[var(--text-secondary)] text-xs transform transition-transform duration-200" style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
                                                            <input className="bg-transparent border-none text-[var(--text-primary)] font-medium w-full focus:ring-1 focus:ring-blue-500 rounded px-1" value={bill.data.label} onChange={(e) => updateNodeData(bill.id, 'label', e.target.value)} onClick={(e) => e.stopPropagation()}/>
                                                        </td>
                                                        <td className="py-3 pr-4">
                                                            <select className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded px-2 py-1 text-xs w-full" value={parentNode ? parentNode.id : ''} onChange={(e) => updateBillSource(bill.id, e.target.value)}>
                                                                <option value="" disabled>Select Source...</option>
                                                                {potentialSources.map(src => (<option key={src.id} value={src.id}>{src.data.label}</option>))}
                                                            </select>
                                                        </td>
                                                        <td className="py-3 pr-4">
                                                            <select className="bg-transparent border-none text-xs text-[var(--text-secondary)] focus:text-[var(--text-primary)] w-full cursor-pointer" value={bill.data.method || 'autopay'} onChange={(e) => updateNodeData(bill.id, 'method', e.target.value)}>
                                                                <option value="autopay">🔄 Autopay</option>
                                                                <option value="manual">👆 Manual</option>
                                                                <option value="billpay">🏦 Bill Pay</option>
                                                                <option value="check">✍️ Check</option>
                                                            </select>
                                                        </td>
                                                        <td className="py-3 pr-4">{stat ? <span className="text-orange-400 font-mono font-bold">{stat.label}</span> : <span className="text-gray-500 text-sm">-</span>}</td>
                                                        <td className="py-3 font-medium text-[var(--text-primary)]">{dueString}</td>
                                                    </tr>
                                                    {isExpanded && (
                                                        <tr className="bg-[var(--bg-secondary)]/50">
                                                            <td colSpan="5" className="p-0">
                                                                <div className="p-3 pl-8 border-l-4 border-[var(--accent-color)]">
                                                                    <div className="flex justify-between items-center mb-2">
                                                                        <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Transaction Matches</p>
                                                                        <div className="flex gap-2">
                                                                            <input className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded px-2 py-1 text-xs w-64" placeholder="Paste Login URL" value={bill.data.link || ''} onChange={(e) => updateNodeData(bill.id, 'link', e.target.value)}/>
                                                                            {bill.data.link && <a href={bill.data.link} target="_blank" rel="noopener noreferrer" className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded">Go ↗</a>}
                                                                        </div>
                                                                    </div>
                                                                    {breakdown.length > 0 ? (
                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                                            {breakdown.map((item, idx) => (
                                                                                <div key={idx} className="flex justify-between items-center text-sm bg-[var(--bg-primary)] p-2 rounded border border-[var(--border-color)]">
                                                                                    <div className="flex flex-col"><span className="font-medium">{item.name}</span><span className="text-[10px] text-[var(--text-secondary)]">Due ~{item.day}th</span></div>
                                                                                    <div className="text-right"><span className="text-[var(--text-primary)] font-mono block">-${Math.round(item.cost).toLocaleString()}/mo</span><span className="text-[10px] text-[var(--text-secondary)]">{item.count} txns</span></div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    ) : <p className="text-sm text-gray-500 italic">No transactions found</p>}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            );
                                        })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentFlow;
