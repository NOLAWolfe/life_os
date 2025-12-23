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

    useEffect(() => {
        fetchInvoices();
        fetchClients();
    }, []);

    const fetchInvoices = async () => {
        const res = await fetch('/api/social/invoices');
        if (res.ok) setInvoices(await res.json());
    };

    const fetchClients = async () => {
        const res = await fetch('/api/social/clients');
        if (res.ok) setClients(await res.json());
    };

    const handleNewInvoice = () => {
        setActiveInvoice('new');
        setFormClient('');
        setFormItems([{ desc: 'DJ Services', qty: 4, rate: 150 }]);
    };

    const handleSave = async () => {
        if (!formClient) return alert('Select a client');

        const total = formItems.reduce((sum, item) => sum + (item.qty * item.rate), 0);
        
        const payload = {
            clientId: formClient,
            date: new Date(formDate),
            totalAmount: total,
            items: formItems,
            status: 'Draft'
        };

        const res = await fetch('/api/social/invoices', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-User-ID': user.id },
            body: JSON.stringify(payload)
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
        return formItems.reduce((sum, item) => sum + (item.qty * item.rate), 0).toFixed(2);
    };

    return (
        <div className="invoice-manager">
            <div className="flex justify-between items-center mb-4">
                <h2>🧾 Invoice Command Center</h2>
                <button className="btn-primary text-sm" onClick={handleNewInvoice}>+ New Invoice</button>
            </div>

            <div className="invoice-dashboard">
                {/* List Pane */}
                <div className="invoice-list-pane">
                    {invoices.map(inv => (
                        <div key={inv.id} className="invoice-card" onClick={() => setActiveInvoice(inv)}>
                            <div className="invoice-header">
                                <span className="invoice-number">{inv.number}</span>
                                <span className={`invoice-status status-${inv.status.toLowerCase()}`}>{inv.status}</span>
                            </div>
                            <span className="invoice-client">{inv.client?.name || 'Unknown Client'}</span>
                            <span className="invoice-amount">${inv.totalAmount.toLocaleString()}</span>
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
                                    <select value={formClient} onChange={e => setFormClient(e.target.value)}>
                                        <option value="">-- Select Client --</option>
                                        {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Date</label>
                                    <input type="date" value={formDate} onChange={e => setFormDate(e.target.value)} />
                                </div>
                            </div>

                            <table className="items-table">
                                <thead>
                                    <tr>
                                        <th>Description</th>
                                        <th style={{width: '60px'}}>Qty</th>
                                        <th style={{width: '80px'}}>Rate</th>
                                        <th style={{width: '80px', textAlign: 'right'}}>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {formItems.map((item, idx) => (
                                        <tr key={idx}>
                                            <td><input value={item.desc} onChange={e => updateItem(idx, 'desc', e.target.value)} placeholder="Service..." /></td>
                                            <td><input type="number" value={item.qty} onChange={e => updateItem(idx, 'qty', parseFloat(e.target.value))} /></td>
                                            <td><input type="number" value={item.rate} onChange={e => updateItem(idx, 'rate', parseFloat(e.target.value))} /></td>
                                            <td style={{textAlign: 'right'}}>${(item.qty * item.rate).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <button className="btn-add-item" onClick={addItem}>+ Add Line Item</button>

                            <div className="text-right mt-4">
                                <h3 className="text-xl">Total: ${calculateTotal()}</h3>
                                <button className="btn-primary mt-2" onClick={handleSave}>Save Draft</button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            {activeInvoice ? 'Viewing Invoice (Read Only Mode)' : 'Select an invoice or create new.'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InvoiceManager;
