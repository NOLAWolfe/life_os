import React, { useState, useEffect } from 'react';
import tillerService from '../../services/tillerService';
import './DataDebugger.css';

const DataDebugger = () => {
    const [fileStats, setFileStats] = useState({});
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const filesToAudit = [
        { name: 'Transactions', url: '/Transactions.csv' },
        { name: 'Accounts', url: '/Accounts.csv' },
        { name: 'Debt Payoff', url: '/Debt Payoff Planner.csv' },
        { name: 'Categories', url: '/Categories.csv' },
        { name: 'Balances', url: '/Balances.csv' }
    ];

    useEffect(() => {
        const auditFiles = async () => {
            setLoading(true);
            const stats = {};
            
            await Promise.all(filesToAudit.map(async (file) => {
                try {
                    const raw = await tillerService.getRawCsvData(file.url);
                    stats[file.name] = {
                        headers: raw.meta.fields,
                        rowCount: raw.data.length,
                        sample: raw.data[0],
                        errors: raw.errors,
                        status: 'success'
                    };
                } catch (err) {
                    stats[file.name] = { status: 'error', message: err.message };
                }
            }));

            setFileStats(stats);
            setLoading(false);
        };

        auditFiles();
    }, []);

    if (loading) return <div className="p-8 text-center">🕵️ Auditing CSV structures...</div>;

    return (
        <div className="data-debugger space-y-6">
            <header className="flex justify-between items-end border-b border-[var(--border-color)] pb-4">
                <div>
                    <h2 className="text-xl font-bold text-orange-400">🕵️ Data Debugger</h2>
                    <p className="text-sm text-[var(--text-secondary)]">Raw CSV Header Audit & Connectivity Check</p>
                </div>
                <div className="text-[10px] uppercase font-bold text-gray-500">System Status: <span className="text-green-500">Operational</span></div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* File List */}
                <div className="md:col-span-1 space-y-2">
                    <p className="text-xs font-bold uppercase text-gray-500 mb-2">Detected Files</p>
                    {filesToAudit.map(file => {
                        const stat = fileStats[file.name];
                        return (
                            <div 
                                key={file.name} 
                                className={`p-3 rounded border cursor-pointer transition-all ${selectedFile === file.name ? 'border-orange-500 bg-orange-500/10' : 'border-[var(--border-color)] hover:bg-[var(--bg-secondary)]'}`}
                                onClick={() => setSelectedFile(file.name)}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-sm">{file.name}</span>
                                    {stat?.status === 'success' ? (
                                        <span className="text-[10px] bg-green-900 text-green-200 px-1.5 py-0.5 rounded">OK</span>
                                    ) : (
                                        <span className="text-[10px] bg-red-900 text-red-200 px-1.5 py-0.5 rounded">MISSING</span>
                                    )}
                                </div>
                                {stat?.rowCount !== undefined && (
                                    <p className="text-[10px] text-gray-500 mt-1">{stat.rowCount} rows detected</p>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Details Panel */}
                <div className="md:col-span-2 bg-[var(--bg-secondary)] rounded-lg p-6 border border-[var(--border-color)] min-h-[400px]">
                    {selectedFile && fileStats[selectedFile] ? (
                        <div className="animate-fade-in space-y-6">
                            <div>
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <span>📄</span> {selectedFile} Structure
                                </h3>
                                
                                <p className="text-xs font-bold uppercase text-gray-500 mb-2">Detected Headers</p>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {fileStats[selectedFile].headers?.map(header => (
                                        <span key={header} className="text-[10px] bg-[var(--bg-primary)] border border-[var(--border-color)] px-2 py-1 rounded font-mono">
                                            {header}
                                        </span>
                                    ))}
                                    {(!fileStats[selectedFile].headers || fileStats[selectedFile].headers.length === 0) && (
                                        <p className="text-sm text-red-400 italic">No headers detected. This file might be empty or malformed.</p>
                                    )}
                                </div>

                                <p className="text-xs font-bold uppercase text-gray-500 mb-2">First Row Sample</p>
                                <div className="bg-[var(--bg-primary)] p-3 rounded border border-[var(--border-color)] overflow-x-auto">
                                    <pre className="text-[10px] font-mono text-gray-300">
                                        {JSON.stringify(fileStats[selectedFile].sample, null, 2)}
                                    </pre>
                                </div>
                            </div>

                            {fileStats[selectedFile].errors?.length > 0 && (
                                <div>
                                    <p className="text-xs font-bold uppercase text-red-500 mb-2">Parser Warnings</p>
                                    <div className="space-y-1">
                                        {fileStats[selectedFile].errors.map((err, idx) => (
                                            <p key={idx} className="text-[10px] text-red-400">Line {err.row}: {err.message}</p>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500 italic">
                            <span className="text-4xl mb-2">🔍</span>
                            <p>Select a file to inspect its internal structure</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DataDebugger;
