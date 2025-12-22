/**
 * Strategy Service
 * 
 * Centralized logic for the Financial Strategy Visualizer.
 * Handles node generation, grouping, drift detection, and cash flow calculations.
 */

export const STRATEGY_TIERS = {
    INCOME: 0,
    HUB: 150,
    LIABILITY: 300,
    BILL: 450,
    REMAINING: 650
};

const strategyService = {
    /**
     * Generates Hub and Liability nodes from account data.
     */
    generateAccountNodes: (accounts, currentNodes) => {
        const newNodes = [];
        let hasChanges = false;

        accounts.forEach(acc => {
            const type = (acc.type || '').toLowerCase();
            const group = (acc.group || '').toLowerCase();
            const className = (acc.class || '').toLowerCase();
            
            let isHub = false;
            let isLiability = false;

            if (className === 'asset' || type.includes('checking') || type.includes('savings')) {
                isHub = true;
            } else if (type.includes('credit') || group.includes('credit')) {
                isLiability = true;
            }

            if (!isHub && !isLiability) return;
            if (acc.name?.toLowerCase().includes('student') || type.includes('student')) return;

            const exists = currentNodes.some(n => 
                n.id === acc.account_id || 
                n.data.label.toLowerCase().includes(acc.name.toLowerCase()) ||
                (acc.account_id && n.id.includes(acc.account_id))
            );

            if (!exists) {
                hasChanges = true;
                const fallbackId = `node-${isHub ? 'hub' : 'liab'}-${acc.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`;
                
                newNodes.push({
                    id: acc.account_id || fallbackId,
                    data: { label: isHub ? `🏦 ${acc.name}` : `💳 ${acc.name}` },
                    position: { x: isHub ? 250 : 450, y: isHub ? STRATEGY_TIERS.HUB : STRATEGY_TIERS.LIABILITY },
                    className: isHub ? 'node-hub' : 'node-account'
                });
            }
        });

        return { hasChanges, newNodes };
    },

    /**
     * Generates Bill nodes from debt account data.
     */
    generateDebtNodes: (debtAccounts, currentNodes) => {
        const newNodes = [];
        let hasChanges = false;

        debtAccounts.forEach((debt, index) => {
            if (!debt.active || debt.currentBalance <= 0) return;

            const exists = currentNodes.find(n => 
                n.data.label.toLowerCase().includes(debt.name.toLowerCase()) ||
                (debt.originalName && n.data.label.toLowerCase().includes(debt.originalName.toLowerCase()))
            );

            if (exists) return;

            hasChanges = true;
            const isCard = debt.name.toLowerCase().includes('visa') || debt.name.toLowerCase().includes('card') || debt.name.toLowerCase().includes('amex');
            
            const type = isCard ? 'default' : 'bill';
            const className = isCard ? 'node-account' : '';
            const tierY = isCard ? STRATEGY_TIERS.LIABILITY : STRATEGY_TIERS.BILL;
            
            const nodeId = `debt-${index}-${debt.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`;
            
            newNodes.push({
                id: nodeId,
                type: type,
                data: { 
                    label: debt.name,
                    subtext: `Min: $${debt.minPayment}`,
                    minPayment: debt.minPayment,
                    payoffDate: debt.payoffMonth
                },
                position: { x: 100 + (index * 120), y: tierY },
                className: className
            });
        });

        return { hasChanges, newNodes };
    },

    /**
     * Calculates monthly averages for bills based on transaction history and rules.
     * Incorporates Debt Minimums for liability nodes.
     */
    calculateNodeStats: (nodes, accounts, transactions, rules, debtAccounts = []) => {
        const stats = {};
        let totalCommitments = 0;
        
        // 1. Account Balances
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

        // 2. Bill Costs (Transactions vs Debt Minimums)
        nodes.forEach(node => {
            // Check if node is a Debt Node (via ID or Type)
            const debtMatch = debtAccounts.find(d => 
                node.id.includes(d.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()) ||
                node.data.label === d.name
            );

            let monthlyCost = 0;
            let isDebt = false;

            if (debtMatch) {
                // Priority 1: Use the Hard Minimum from Tiller Metadata
                monthlyCost = debtMatch.minPayment || 0;
                isDebt = true;
            } else if (rules && rules[node.id] && transactions) {
                // Priority 2: Use Transaction History Average
                const keywords = rules[node.id];
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
                    monthlyCost = totalCheck / months;
                }
            }

            if (monthlyCost > 0) {
                totalCommitments += monthlyCost;
                stats[node.id] = {
                    type: isDebt ? 'debt' : 'bill',
                    value: monthlyCost,
                    label: `-$${Math.round(monthlyCost).toLocaleString()}/mo`
                };
            }
        });
        
        return { nodeStats: stats, totalMonthlyCommitments: totalCommitments };
    },

    /**
     * Identifies "Drift": Bills paid from accounts other than their mapped source.
     */
    detectDrift: (transactions, rules, nodes, edges) => {
        if (!transactions) return [];
        const issues = [];
        const nodeToParentMap = {};
        
        edges.forEach(edge => { 
            nodeToParentMap[edge.target] = edge.source;
            
            const targetNode = nodes.find(n => n.id === edge.target);
            if (targetNode?.type === 'billGroup' && targetNode.data.containedNodes) {
                targetNode.data.containedNodes.forEach(cn => {
                    nodeToParentMap[cn.id] = edge.source;
                });
            }
        });

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
    },

    /**
     * Groups selected nodes into a single "Bill Bucket".
     */
    groupNodes: (nodes, edges, nodeStats) => {
        const selectedNodes = nodes.filter(n => n.selected);
        if (selectedNodes.length < 2) return null;
        
        const invalid = selectedNodes.some(n => n.type !== 'bill' && !n.className?.includes('node-bill'));
        if (invalid) {
            alert('Only Bill nodes can be grouped currently.');
            return null;
        }

        const totalAmount = selectedNodes.reduce((sum, n) => {
            const stat = nodeStats[n.id];
            return sum + (stat ? stat.value : 0);
        }, 0);

        const avgX = selectedNodes.reduce((sum, n) => sum + n.position.x, 0) / selectedNodes.length;
        const avgY = selectedNodes.reduce((sum, n) => sum + n.position.y, 0) / selectedNodes.length;

        const groupId = `group-${Date.now()}`;
        const groupNode = {
            id: groupId,
            type: 'billGroup',
            position: { x: avgX, y: avgY },
            data: { 
                label: 'Bill Bucket', 
                billCount: selectedNodes.length, 
                totalAmount: totalAmount,
                containedNodes: selectedNodes 
            },
            selected: true
        };

        const newEdges = edges.map(e => {
            if (selectedNodes.some(n => n.id === e.target)) {
                return { ...e, target: groupId };
            }
            return e;
        }).filter(e => !selectedNodes.some(n => n.id === e.source));

        const uniqueEdges = [];
        const seenEdges = new Set();
        newEdges.forEach(e => {
            const key = `${e.source}-${e.target}`;
            if (!seenEdges.has(key)) {
                seenEdges.add(key);
                uniqueEdges.push(e);
            }
        });

        const remainingNodes = nodes.filter(n => !selectedNodes.some(s => s.id === n.id));
        return {
            nodes: [...remainingNodes, groupNode],
            edges: uniqueEdges
        };
    },

    /**
     * Explodes a group back into individual bill nodes.
     */
    ungroupNode: (groupNode, nodes, edges) => {
        const containedNodes = groupNode.data.containedNodes || [];
        if (containedNodes.length === 0) {
            return { nodes: nodes.filter(n => n.id !== groupNode.id), edges };
        }

        const parentEdge = edges.find(e => e.target === groupNode.id);
        const parentId = parentEdge ? parentEdge.source : null;

        let restoredEdges = [...edges.filter(e => e.target !== groupNode.id && e.source !== groupNode.id)];
        
        if (parentId) {
            const newLinks = containedNodes.map(n => ({
                id: `e-${parentId}-${n.id}-${Date.now()}`,
                source: parentId,
                target: n.id,
                animated: false
            }));
            restoredEdges = [...restoredEdges, ...newLinks];
        }

        return {
            nodes: [...nodes.filter(n => n.id !== groupNode.id), ...containedNodes],
            edges: restoredEdges
        };
    },

    /**
     * Builds the hierarchy for the Manifest view.
     */
    getPlanHierarchy: (nodes, edges) => {
        const hubs = nodes.filter(n => 
            (n.className?.includes('node-hub') || n.className?.includes('node-account')) && 
            !n.id.startsWith('dynamic-income')
        );
        
        return hubs.map(hub => {
            const incomingIncomes = edges
                .filter(e => e.target === hub.id && e.source.startsWith('dynamic-income'))
                .map(e => nodes.find(n => n.id === e.source));
            
            const children = edges
                .filter(e => e.source === hub.id)
                .map(e => {
                    const childNode = nodes.find(n => n.id === e.target);
                    return { edge: e, node: childNode };
                });

            return { hub, incomingIncomes, children };
        });
    }
};

export default strategyService;
