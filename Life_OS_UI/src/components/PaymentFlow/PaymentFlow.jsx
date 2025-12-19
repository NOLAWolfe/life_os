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
  // Income
  { id: 'income', data: { label: '💰 Income (Paycheck)' }, position: { x: 250, y: 0 }, className: 'node-hub' },
  
  // Primary Hubs
  { id: 'navy-fed', data: { label: '🏦 Navy Fed (Primary)' }, position: { x: 250, y: 100 }, className: 'node-hub' },
  
  // Strategy / MMI
  { id: 'mmi-group', data: { label: '🛡️ MMI / Debt Mgmt' }, position: { x: 500, y: 100 }, className: 'node-bill' },

  // Secondary Accounts
  { id: 'chase-8211', data: { label: '🏠 Chase 8211 (Joint/House)' }, position: { x: 50, y: 250 }, className: 'node-account' },
  { id: 'cap1-qs', data: { label: '💳 Cap1 Quicksilver' }, position: { x: 450, y: 250 }, className: 'node-account' },
  
  // Target Bills
  { id: 'mortgage', data: { label: 'Mortgage/Housing' }, position: { x: -50, y: 400 }, className: 'node-bill' },
  { id: 'auto-loan', data: { label: 'Auto Loan' }, position: { x: 150, y: 400 }, className: 'node-bill' },
  { id: 'savings', data: { label: 'Savings' }, position: { x: 250, y: 450 }, className: 'node-bill' },
  { id: 'phone-wifi', data: { label: 'Utility Bills' }, position: { x: 350, y: 400 }, className: 'node-bill' },
  { id: 'subs', data: { label: 'Subscriptions' }, position: { x: 550, y: 400 }, className: 'node-bill' },
];

const initialEdges = [
  { id: 'e-inc-navy', source: 'income', target: 'navy-fed', animated: true },
  { id: 'e-navy-chase', source: 'navy-fed', target: 'chase-8211', label: 'Bulk Transfer' },
  { id: 'e-navy-cap1', source: 'navy-fed', target: 'cap1-qs', label: 'Bulk Transfer' },
  { id: 'e-navy-mmi', source: 'navy-fed', target: 'mmi-group', label: 'Consolidated Pmt', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  
  { id: 'e-chase-mortgage', source: 'chase-8211', target: 'mortgage' },
  { id: 'e-navy-auto', source: 'navy-fed', target: 'auto-loan' },
  { id: 'e-navy-savings', source: 'navy-fed', target: 'savings' },
  { id: 'e-cap1-phone', source: 'cap1-qs', target: 'phone-wifi' },
  { id: 'e-cap1-subs', source: 'cap1-qs', target: 'subs' },
];

const PaymentFlow = ({ viewMode = 'map', setViewMode }) => {
    const { transactions, accounts } = useFinancials();
    
    // -- State --
    // Internal viewMode state removed in favor of props
    
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
    const [expandedRows, setExpandedRows] = React.useState({}); // Toggle state for bill rows

    // Load rules from localStorage
    const [rules, setRules] = React.useState(() => {
        const saved = localStorage.getItem('paymentFlowRules');
        return saved ? JSON.parse(saved) : {
            'phone-wifi': ['verizon', 't-mobile', 'att', 'xfinity', 'comcast'],
            'mortgage': ['chase mtg', 'mortgage'],
            'subs': ['netflix', 'spotify', 'hulu', 'apple.com']
        };
    });

    // -- Effects --
    useEffect(() => {
        localStorage.setItem('paymentFlowRules', JSON.stringify(rules));
    }, [rules]);

    // -- Actions --
    const saveLayout = () => {
        localStorage.setItem('paymentFlowNodes', JSON.stringify(nodes));
        localStorage.setItem('paymentFlowEdges', JSON.stringify(edges));
        alert('Layout saved!');
    };

    const resetLayout = () => {
        if (confirm('Reset to default layout? Unsaved changes will be lost.')) {
            setNodes(initialNodes);
            setEdges(initialEdges);
            localStorage.removeItem('paymentFlowNodes');
            localStorage.removeItem('paymentFlowEdges');
        }
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

    const onNodeClick = useCallback((event, node) => {
        setSelectedNode(node);
    }, []);

    const addRule = (e) => {
        e.preventDefault();
        if (!selectedNode || !newRule) return;
        
        const nodeId = selectedNode.id;
        const currentRules = rules[nodeId] || [];
        if (!currentRules.includes(newRule.toLowerCase())) {
            setRules({
                ...rules,
                [nodeId]: [...currentRules, newRule.toLowerCase()]
            });
        }
        setNewRule('');
    };

    const removeRule = (nodeId, ruleToRemove) => {
        setRules({
            ...rules,
            [nodeId]: rules[nodeId].filter(r => r !== ruleToRemove)
        });
    };

    // -- Audit Logic (Drift Detection) --
    const auditResults = useMemo(() => {
        if (!transactions) return [];
        
        const issues = [];
        const nodeToParentMap = {};
        edges.forEach(edge => {
            nodeToParentMap[edge.target] = edge.source;
        });

        // Simple mapping for demo purposes - in a real app, this would be more robust
        const accountMapping = {
            'chase-8211': ['chase', '8211'],
            'cap1-qs': ['quicksilver', 'cap1', '0610'],
            'navy-fed': ['navy federal', 'navy fed']
        };

        Object.entries(rules).forEach(([nodeId, keywords]) => {
            const parentId = nodeToParentMap[nodeId];
            if (!parentId || !accountMapping[parentId]) return;

            const expectedKeywords = accountMapping[parentId];
            
            const matchedTransactions = transactions.filter(t => 
                keywords.some(k => t.name.toLowerCase().includes(k))
            );

            matchedTransactions.forEach(t => {
                const actualAccount = t.accountName.toLowerCase();
                const isCorrect = expectedKeywords.some(ek => actualAccount.includes(ek));

                if (!isCorrect) {
                    issues.push({
                        nodeId: nodeId,
                        message: `Drift: ${t.name} ($${t.amount}) found in ${t.accountName}. Expected Home: ${parentId}`,
                        severity: 'error'
                    });
                }
            });
        });

        return issues;
    }, [transactions, rules, edges]);

    // -- Node Statistics (Balances & Bill Costs) --
    const nodeStats = useMemo(() => {
        const stats = {};
        
        // 1. Calculate Account Balances
        if (accounts) {
            nodes.forEach(node => {
                if (node.className?.includes('node-account') || node.className?.includes('node-hub')) {
                    // Fuzzy match node label to account name
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
                // Find transactions matching keywords
                const matches = transactions.filter(t => 
                    t.type === 'debit' &&
                    keywords.some(k => t.name.toLowerCase().includes(k))
                );

                if (matches.length > 0) {
                    const totalCheck = matches.reduce((sum, t) => sum + t.amount, 0);
                    // Approximate duration in months (based on transaction range)
                    // Quick hack: just divide total by 1 for now if we don't have full range context, 
                    // or assume the dataset is ~1 month for the prototype. 
                    // Better: Get range from transactions. For now, let's just sum it to show volume.
                    // If we assume the CSV is ~90 days, we could divide by 3. 
                    // Let's stick to "Total in View" for clarity or a simple Monthly Avg if we can.
                    
                    // Simple Average Calculation:
                    const dates = matches.map(t => new Date(t.date));
                    const minDate = new Date(Math.min(...dates));
                    const maxDate = new Date(Math.max(...dates));
                    const daysDiff = (maxDate - minDate) / (1000 * 60 * 60 * 24);
                    const months = Math.max(daysDiff / 30, 1);
                    
                    const avgMonthly = totalCheck / months;

                    stats[nodeId] = {
                        type: 'bill',
                        value: avgMonthly,
                        label: `-$${Math.round(avgMonthly).toLocaleString()}/mo`
                    };
                }
            });
        }
        
        return stats;
    }, [nodes, accounts, transactions, rules]);

    // Apply Audit Visuals AND Stats
    const auditedNodes = useMemo(() => {
        return nodes.map(node => {
            const hasIssue = auditResults.find(r => r.nodeId === node.id);
            const stat = nodeStats[node.id];
            
            let label = node.data.label;
            
            // Append Stat to Label for visual map
            if (stat) {
                label = `${node.data.label} (${stat.label})`;
            }

            if (hasIssue) {
                label = `${label} ⚠️`;
                return {
                    ...node,
                    className: `${node.className} ring-4 ring-red-500`,
                    data: { ...node.data, label }
                };
            }
            
            // Just Stats update
            if (stat) {
                 return {
                    ...node,
                    data: { ...node.data, label }
                };
            }

            return node;
        });
    }, [nodes, auditResults, nodeStats]);

    // -- Plan View Generator --
    const planHierarchy = useMemo(() => {
        // Find root nodes (no incoming edges)
        const incomingEdges = new Set(edges.map(e => e.target));
        const roots = nodes.filter(n => !incomingEdges.has(n.id));
        
        const buildTree = (nodeId) => {
            const childrenEdges = edges.filter(e => e.source === nodeId);
            return childrenEdges.map(e => {
                const childNode = nodes.find(n => n.id === e.target);
                return {
                    edge: e,
                    node: childNode,
                    children: childNode ? buildTree(childNode.id) : []
                };
            });
        };

        return roots.map(root => ({
            node: root,
            children: buildTree(root.id)
        }));
    }, [nodes, edges]);

    const renderPlanItem = (item, depth = 0) => {
        const stat = nodeStats[item.node?.id];
        
        return (
            <div key={item.node?.id || Math.random()} style={{ marginLeft: `${depth * 20}px` }} className="plan-item mb-2 border-l border-gray-700 pl-2">
                <div className="flex items-center gap-2">
                    <span className="text-gray-400">{depth > 0 ? '└─' : '•'}</span>
                    <span className={`font-medium ${depth === 0 ? 'text-lg text-blue-400' : 'text-sm'}`}>
                        {item.node?.data.label}
                    </span>
                    
                    {/* Stat Badge */}
                    {stat && (
                        <span className={`text-xs px-2 py-0.5 rounded font-mono ${stat.type === 'balance' ? 'bg-green-900 text-green-200' : 'bg-orange-900 text-orange-200'}`}>
                            {stat.label}
                        </span>
                    )}

                    {item.edge?.label && (
                        <span className="text-xs bg-gray-700 px-2 py-0.5 rounded text-gray-300">
                            {item.edge.label}
                        </span>
                    )}
                    {/* Show Drift Warning in Plan View */}
                    {auditResults.some(r => r.nodeId === item.node?.id) && (
                         <span className="text-xs text-red-400 font-bold ml-2">⚠️ Drift Detected</span>
                    )}
                </div>
                {item.children.map(child => renderPlanItem(child, depth + 1))}
            </div>
        );
    };

    return (
        <div className="widget-card flex flex-col h-full min-h-[600px]">
            {/* Header / Toolbar */}
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-[var(--border-color)]">
                <div className="flex gap-4 items-center">
                    <h2 className="text-xl font-bold text-[var(--accent-color)]">🗺️ Payment Strategy</h2>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <button onClick={addNode} className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded">
                        + Add Node
                    </button>
                    <button onClick={saveLayout} className="px-3 py-1 text-xs bg-blue-700 hover:bg-blue-600 rounded">
                        💾 Save
                    </button>
                    <button onClick={resetLayout} className="px-3 py-1 text-xs bg-red-900/50 hover:bg-red-900 rounded text-red-200">
                        Reset
                    </button>
                </div>
            </div>
            
            <div className="flow-content-wrapper bg-[var(--bg-primary)] rounded-lg border border-[var(--border-color)] overflow-hidden">
                
                {/* MAP VIEW */}
                {viewMode === 'map' && (
                    <>
                        <div className="flow-main">
                            <ReactFlow
                                nodes={auditedNodes}
                                edges={edges}
                                onNodesChange={onNodesChange}
                                onEdgesChange={onEdgesChange}
                                onConnect={onConnect}
                                onNodeClick={onNodeClick}
                                fitView
                            >
                                <Background color="var(--border-color)" gap={20} />
                                <Controls />
                                <MiniMap 
                                    nodeColor={(n) => {
                                        if (n.className?.includes('node-hub')) return '#2575fc';
                                        if (n.className?.includes('node-account')) return '#4a5568';
                                        if (n.className?.includes('node-bill')) return '#2e7d32';
                                        return '#ccc';
                                    }}
                                />
                            </ReactFlow>
                        </div>

                        {selectedNode && (
                            <div className="node-inspector">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-sm">Inspector</h3>
                                    <button onClick={() => setSelectedNode(null)} className="text-xs hover:text-red-500">Close</button>
                                </div>
                                <div className="mb-4">
                                    <p className="text-xs text-[var(--text-secondary)] uppercase font-bold mb-1">Target Node</p>
                                    <p className="text-sm font-medium">{selectedNode.data.label}</p>
                                    <button 
                                        onClick={() => {
                                            setNodes(nodes.filter(n => n.id !== selectedNode.id));
                                            setSelectedNode(null);
                                        }}
                                        className="mt-2 text-xs text-red-400 border border-red-900 px-2 py-1 rounded hover:bg-red-900/20"
                                    >
                                        Delete Node
                                    </button>
                                </div>
                                
                                <div className="flex-1">
                                    <p className="text-xs text-[var(--text-secondary)] uppercase font-bold mb-2">Merchant Rules</p>
                                    <div className="flex flex-wrap gap-1 mb-4">
                                        {(rules[selectedNode.id] || []).map(rule => (
                                            <span key={rule} className="rule-tag">
                                                {rule} 
                                                <span onClick={() => removeRule(selectedNode.id, rule)} className="remove-rule">×</span>
                                            </span>
                                        ))}
                                    </div>
                                    
                                    <form onSubmit={addRule} className="mb-2">
                                        <input 
                                            className="rule-input bg-[var(--input-bg)] border border-[var(--border-color)] rounded px-2 py-1 text-xs"
                                            placeholder="e.g. Netflix, Spotify"
                                            value={newRule}
                                            onChange={e => setNewRule(e.target.value)}
                                        />
                                        <button type="submit" className="hidden">Add</button>
                                    </form>
                                    <p className="text-[10px] text-[var(--text-secondary)]">
                                        Enter exact or partial merchant name. Case-insensitive.
                                    </p>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* PLAN VIEW */}
                {viewMode === 'plan' && (
                    <div className="p-8 overflow-y-auto h-full bg-[var(--bg-primary)] text-[var(--text-primary)]">
                        <h3 className="text-xl font-bold mb-6 border-b border-[var(--border-color)] pb-2">Manifest: The Strategy</h3>
                        <div className="space-y-4">
                            {planHierarchy.map(item => renderPlanItem(item))}
                        </div>
                        
                        {auditResults.length > 0 && (
                            <div className="mt-8 pt-4 border-t border-[var(--border-color)]">
                                <h4 className="text-red-400 font-bold mb-2">Attention Required (Drift)</h4>
                                <ul className="list-disc list-inside text-sm text-red-300">
                                    {auditResults.map((issue, idx) => (
                                        <li key={idx}>{issue.message}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {/* BILLS LIST VIEW */}
                {viewMode === 'bills' && (
                    <div className="p-6 overflow-y-auto h-full bg-[var(--bg-primary)] text-[var(--text-primary)]">
                        <h3 className="text-xl font-bold mb-6 border-b border-[var(--border-color)] pb-2">Master Bills List</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-[var(--border-color)] text-[var(--text-secondary)] text-sm uppercase">
                                        <th className="py-3 font-semibold w-1/4">Bill Name</th>
                                        <th className="py-3 font-semibold w-1/5">Source Account</th>
                                        <th className="py-3 font-semibold w-1/6">Total Amount</th>
                                        <th className="py-3 font-semibold w-1/6">Est. Due Date</th>
                                        <th className="py-3 font-semibold">Mapped Keywords</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {nodes
                                        .filter(n => n.className?.includes('node-bill'))
                                        .map(bill => {
                                            const stat = nodeStats[bill.id];
                                            const parentEdge = edges.find(e => e.target === bill.id);
                                            const parentNode = parentEdge ? nodes.find(n => n.id === parentEdge.source) : null;
                                            const keywords = rules[bill.id] || [];
                                            const isExpanded = expandedRows[bill.id];

                                            // Breakdown Calculation & Date Logic
                                            let allMatches = [];
                                            const breakdown = keywords.map(k => {
                                                const matches = transactions ? transactions.filter(t => 
                                                    t.type === 'debit' && t.name.toLowerCase().includes(k)
                                                ) : [];
                                                
                                                if (matches.length > 0) allMatches = [...allMatches, ...matches];

                                                if (matches.length === 0) return { name: k, cost: 0, count: 0, day: '-' };

                                                const total = matches.reduce((sum, t) => sum + t.amount, 0);
                                                // Monthly Avg Logic
                                                const dates = matches.map(t => new Date(t.date));
                                                const minDate = new Date(Math.min(...dates));
                                                const maxDate = new Date(Math.max(...dates));
                                                const daysDiff = (maxDate - minDate) / (1000 * 60 * 60 * 24);
                                                const months = Math.max(daysDiff / 30, 1);
                                                
                                                // Calc avg day for this specific keyword
                                                const days = dates.map(d => d.getDate());
                                                const avgDay = Math.round(days.reduce((a, b) => a + b, 0) / days.length);

                                                return {
                                                    name: k,
                                                    cost: total / months,
                                                    count: matches.length,
                                                    day: avgDay
                                                };
                                            }).filter(b => b.cost > 0).sort((a,b) => b.cost - a.cost);

                                            // Calculate Overall Due Date (Avg of all matches)
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
                                                    <tr 
                                                        className="border-b border-[var(--border-color)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
                                                        onClick={() => setExpandedRows(prev => ({ ...prev, [bill.id]: !prev[bill.id] }))}
                                                    >
                                                        <td className="py-3 pr-4 font-medium flex items-center gap-2">
                                                            <span className="text-[var(--text-secondary)] text-xs transform transition-transform duration-200" style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                                                                ▶
                                                            </span>
                                                            {bill.data.label}
                                                        </td>
                                                        <td className="py-3 pr-4 text-sm text-[var(--text-secondary)]">
                                                            {parentNode ? (
                                                                <span className="flex items-center gap-1">
                                                                    <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                                                                    {parentNode.data.label}
                                                                </span>
                                                            ) : (
                                                                <span className="text-red-400 italic">Unassigned</span>
                                                            )}
                                                        </td>
                                                        <td className="py-3 pr-4">
                                                            {stat ? (
                                                                <span className="text-orange-400 font-mono font-bold text-lg">{stat.label}</span>
                                                            ) : (
                                                                <span className="text-gray-500 text-sm">-</span>
                                                            )}
                                                        </td>
                                                        <td className="py-3 pr-4 font-medium text-[var(--text-primary)]">
                                                            {dueString}
                                                        </td>
                                                        <td className="py-3 text-xs text-[var(--text-secondary)]">
                                                            {keywords.length} keywords
                                                        </td>
                                                    </tr>
                                                    
                                                    {/* Expanded Breakdown Row */}
                                                    {isExpanded && (
                                                        <tr className="bg-[var(--bg-secondary)]/50">
                                                            <td colSpan="5" className="p-0">
                                                                <div className="p-3 pl-8 border-l-4 border-[var(--accent-color)]">
                                                                    <p className="text-xs font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">Breakdown</p>
                                                                    {breakdown.length > 0 ? (
                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                                            {breakdown.map((item, idx) => (
                                                                                <div key={idx} className="flex justify-between items-center text-sm bg-[var(--bg-primary)] p-2 rounded border border-[var(--border-color)]">
                                                                                    <div className="flex flex-col">
                                                                                        <span className="font-medium">{item.name}</span>
                                                                                        <span className="text-[10px] text-[var(--text-secondary)]">Due ~{item.day}th</span>
                                                                                    </div>
                                                                                    <div className="text-right">
                                                                                        <span className="text-[var(--text-primary)] font-mono block">-${Math.round(item.cost).toLocaleString()}/mo</span>
                                                                                        <span className="text-[10px] text-[var(--text-secondary)]">{item.count} txns</span>
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    ) : (
                                                                        <p className="text-sm text-gray-500 italic">No transactions found matching current keywords.</p>
                                                                    )}
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
            
            {/* Footer warning if unsaved changes? (Optional enhancement later) */}
        </div>
    );
};

export default PaymentFlow;
