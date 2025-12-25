import React, { useState, useEffect } from 'react';
import { useUser } from '../../../contexts/UserContext';
import './InvoiceManager.css';

const InvoiceManager = () => {
    const { user } = useUser();
    const [invoices, setInvoices] = useState([]);
    const [clients, setClients] = useState([]);
    const [activeInvoice, setActiveInvoice] = useState(null); // 'new' or invoice object

    // Form State
    const [formClient, setFormClient] = useState('');
    const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
    const [formItems, setFormItems] = useState([{ desc: 'DJ Services', qty: 4, rate: 150 }]);

    const [view, setView] = useState('all'); // 'all', 'review'

    const fetchInvoices = async () => {
        const res = await fetch('/api/social/invoices');
        if (res.ok) {
            const data = await res.json();
            setInvoices(data);
        }
    };

    const fetchClients = async () => {
        const res = await fetch('/api/social/clients');
        if (res.ok) {
            const data = await res.json();
            setClients(data);
        }
    };

    useEffect(() => {
        fetchInvoices();
        fetchClients();
    }, []);

    const handleNewInvoice = () => {
        setActiveInvoice('new');
        setFormClient('');
        setFormItems([{ desc: 'DJ Services', qty: 4, rate: 150 }]);
    };

    const handleSave = async () => {
        if (!formClient) return alert('Select a client');

        const total = formItems.reduce((sum, item) => sum + item.qty * item.rate, 0);

        const payload = {
            clientId: formClient,
            date: new Date(formDate),
            totalAmount: total,
            items: formItems,
            status: 'Draft',
        };

        const res = await fetch('/api/social/invoices', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-User-ID': user.id },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            fetchInvoices();
            setActiveInvoice(null);
        }
    };

    const updateItem = (index, field, value) => {
        const newItems = [...formItems];
        newItems[index][field] = value;
        setFormItems(newItems);
    };

    const addItem = () => {
        setFormItems([...formItems, { desc: '', qty: 1, rate: 0 }]);
    };

    const calculateTotal = () => {
        return formItems.reduce((sum, item) => sum + item.qty * item.rate, 0).toFixed(2);
    };

    const filteredInvoices = invoices.filter((inv) => {
        if (view === 'review') return inv.status === 'Review' || inv.source !== 'Manual';
        return true;
    });

    const handleFlag = async (invoiceId) => {
        const res = await fetch(`/api/social/invoices/${invoiceId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'X-User-ID': user.id },
            body: JSON.stringify({ status: 'Review', notes: 'Flagged for review/updates.' }),
        });
        if (res.ok) fetchInvoices();
    };

    return (
        <div className="invoice-manager">
            <div className="flex justify-between items-center mb-4">
                <h2>🧾 Invoice Command Center</h2>
                <div className="flex gap-2">
                    <button
                        className={`text-xs px-3 py-1 rounded ${view === 'all' ? 'bg-gray-600' : 'bg-gray-800'}`}
                        onClick={() => setView('all')}
                    >
                        All Invoices
                    </button>
                    <button
                        className={`text-xs px-3 py-1 rounded ${view === 'review' ? 'bg-purple-600' : 'bg-gray-800'}`}
                        onClick={() => setView('review')}
                    >
                        Needs Review (
                        {
                            invoices.filter((i) => i.status === 'Review' || i.source !== 'Manual')
                                .length
                        }
                        )
                    </button>
                    <button className="btn-primary text-sm ml-2" onClick={handleNewInvoice}>
                        + New Invoice
                    </button>
                </div>
            </div>

            <div className="invoice-dashboard">
                {/* List Pane */}
                <div className="invoice-list-pane">
                    {filteredInvoices.map((inv) => (
                        <div
                            key={inv.id}
                            className={`invoice-card ${inv.status === 'Review' ? 'border-l-4 border-purple-500' : ''}`}
                            onClick={() => setActiveInvoice(inv)}
                        >
                            <div className="invoice-header">
                                <span className="invoice-number">{inv.number}</span>
                                <span
                                    className={`invoice-status status-${inv.status.toLowerCase()}`}
                                >
                                    {inv.status}
                                </span>
                            </div>
                            <span className="invoice-client">
                                {inv.client?.name || 'Unknown Client'}
                            </span>
                            <div className="flex justify-between items-center mt-1">
                                <span className="invoice-amount font-mono">
                                    ${inv.totalAmount.toLocaleString()}
                                </span>
                                <span className="text-[10px] text-gray-500 uppercase">
                                    {inv.source}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Editor Pane */}
                <div className="invoice-editor-pane">
                    {activeInvoice === 'new' ? (
                        <div className="editor-form">
                            <h3>New Invoice</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Client</label>
                                    <select
                                        value={formClient}
                                        onChange={(e) => setFormClient(e.target.value)}
                                    >
                                        <option value="">-- Select Client --</option>
                                        {clients.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Date</label>
                                    <input
                                        type="date"
                                        value={formDate}
                                        onChange={(e) => setFormDate(e.target.value)}
                                    />
                                </div>
                            </div>

                            <table className="items-table">
                                <thead>
                                    <tr>
                                        <th>Description</th>
                                        <th style={{ width: '60px' }}>Qty</th>
                                        <th style={{ width: '80px' }}>Rate</th>
                                        <th style={{ width: '80px', textAlign: 'right' }}>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {formItems.map((item, idx) => (
                                        <tr key={idx}>
                                            <td>
                                                <input
                                                    value={item.desc}
                                                    onChange={(e) =>
                                                        updateItem(idx, 'desc', e.target.value)
                                                    }
                                                    placeholder="Service..."
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    value={item.qty}
                                                    onChange={(e) =>
                                                        updateItem(
                                                            idx,
                                                            'qty',
                                                            parseFloat(e.target.value)
                                                        )
                                                    }
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    value={item.rate}
                                                    onChange={(e) =>
                                                        updateItem(
                                                            idx,
                                                            'rate',
                                                            parseFloat(e.target.value)
                                                        )
                                                    }
                                                />
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                ${(item.qty * item.rate).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <button className="btn-add-item" onClick={addItem}>
                                + Add Line Item
                            </button>

                            <div className="text-right mt-4">
                                <h3 className="text-xl">Total: ${calculateTotal()}</h3>
                                <button className="btn-primary mt-2" onClick={handleSave}>
                                    Save Draft
                                </button>
                            </div>
                        </div>
                    ) : activeInvoice ? (
                        <div className="viewer-pane p-4">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-2xl font-bold">{activeInvoice.number}</h3>
                                    <p className="text-gray-400">
                                        {activeInvoice.client?.name} •{' '}
                                        {new Date(activeInvoice.date).toLocaleDateString()}
                                    </p>
                                    <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-500 mt-2 inline-block">
                                        Source: {activeInvoice.source}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        className="bg-purple-900 text-purple-200 px-4 py-2 rounded text-sm font-bold border border-purple-700 hover:bg-purple-800"
                                        onClick={() => handleFlag(activeInvoice.id)}
                                    >
                                        🚩 Flag for Update
                                    </button>
                                    <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-bold">
                                        🚀 Submit to Corporate
                                    </button>
                                </div>
                            </div>

                            {/* Simple Item Display */}
                            <div className="bg-gray-900/50 p-4 rounded border border-gray-800">
                                <h4 className="text-xs font-bold text-gray-500 uppercase mb-4">
                                    Line Items
                                </h4>
                                <div className="space-y-2">
                                    {activeInvoice.items &&
                                        JSON.parse(activeInvoice.items).map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="flex justify-between text-sm border-b border-gray-800 pb-2"
                                            >
                                                <span>
                                                    {item.desc} (x{item.qty})
                                                </span>
                                                <span className="font-mono">
                                                    ${(item.qty * item.rate).toLocaleString()}
                                                </span>
                                            </div>
                                        ))}
                                </div>
                                <div className="text-right mt-4 pt-4 border-t border-gray-700">
                                    <span className="text-xl font-bold">
                                        ${activeInvoice.totalAmount.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {activeInvoice.notes && (
                                <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-900/50 rounded text-sm text-yellow-200">
                                    <strong>Notes:</strong> {activeInvoice.notes}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            Select an invoice or create new.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InvoiceManager;
