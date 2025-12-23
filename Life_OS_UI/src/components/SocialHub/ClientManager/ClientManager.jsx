import React, { useState, useEffect } from 'react';
import { useUser } from '../../../contexts/UserContext'; // For userId injection
import './ClientManager.css';

const ClientManager = () => {
    const { user } = useUser();
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newClientName, setNewClientName] = useState('');
    const [newCompany, setNewCompany] = useState('');

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const res = await fetch('/api/social/clients');
            if (res.ok) {
                const data = await res.json();
                setClients(data);
            }
        } catch (error) {
            console.error("Error fetching clients:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddClient = async (e) => {
        e.preventDefault();
        if (!newClientName.trim()) return;

        try {
            const res = await fetch('/api/social/clients', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-User-ID': user.id 
                },
                body: JSON.stringify({
                    name: newClientName,
                    company: newCompany,
                    status: 'Active',
                    rate: 150, // Default DJ rate
                    rateType: 'hourly'
                })
            });

            if (res.ok) {
                const newClient = await res.json();
                setClients([newClient, ...clients]);
                setNewClientName('');
                setNewCompany('');
            }
        } catch (error) {
            console.error("Error adding client:", error);
        }
    };

    return (
        <div className="client-manager">
            <h2>🎧 Client Roster</h2>
            
            {loading ? (
                <div className="text-center text-gray-500 py-4">Loading roster...</div>
            ) : (
                <div className="client-list">
                    {clients.length === 0 && <p className="text-center text-gray-500 italic">No clients yet.</p>}
                    {clients.map(client => (
                        <div key={client.id} className="client-card">
                            <div className="client-info">
                                <h4>{client.name}</h4>
                                <span className="client-company">{client.company || 'Private Party'}</span>
                                <div className="client-details">
                                    {client.email || 'No email'} • ${client.rate}/{client.rateType === 'hourly' ? 'hr' : 'flat'}
                                </div>
                            </div>
                            <span className={`client-status status-${client.status.toLowerCase()}`}>
                                {client.status}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            <form className="add-client-form" onSubmit={handleAddClient}>
                <input 
                    type="text" 
                    placeholder="Client Name" 
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    required
                />
                <input 
                    type="text" 
                    placeholder="Company (Opt)" 
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                />
                <button type="submit">Add</button>
            </form>
        </div>
    );
};

export default ClientManager;
