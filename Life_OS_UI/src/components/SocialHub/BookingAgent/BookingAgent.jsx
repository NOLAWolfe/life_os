import React, { useState, useEffect } from 'react';
import { connectivityService } from '../../../services/connectivityService';
import './BookingAgent.css';

const MOCK_EXTERNAL = [
    { id: 'e1', name: 'Taylor Swift Concert', date: '2025-12-24', impact: 'HIGH', location: 'Minneapolis' },
    { id: 'e2', teams: 'Vikings vs Packers', date: '2025-12-25', sport: 'NFL', location: 'Minneapolis' }
];

const BookingAgent = () => {
    const [personalEvents, setPersonalEvents] = useState([]);
    const [conflicts, setConflicts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const personal = await connectivityService.syncPersonalCalendar();
            setPersonalEvents(personal);
            
            const detected = connectivityService.detectConflicts(personal, MOCK_EXTERNAL);
            setConflicts(detected);
            setLoading(false);
        };
        loadData();
    }, []);

    if (loading) return <div>Syncing Calendars...</div>;

    return (
        <div className="booking-agent-container widget-card bg-card border border-border">
            <h2 className="widget-title text-primary">🚀 Booking Agent Spike</h2>
            
            <div className="flex flex-col gap-4">
                <section>
                    <h3 className="text-sm font-bold text-secondary uppercase mb-2">Synced Schedule</h3>
                    <div className="space-y-2">
                        {personalEvents.map(event => (
                            <div key={event.id} className="p-3 bg-gray-800/50 rounded border border-border flex justify-between">
                                <div>
                                    <div className="font-bold text-primary">{event.title}</div>
                                    <div className="text-xs text-secondary">{new Date(event.start).toLocaleString()}</div>
                                </div>
                                <div className="text-xs bg-accent/20 text-accent px-2 py-1 rounded self-center">
                                    {event.type.toUpperCase()}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h3 className="text-sm font-bold text-secondary uppercase mb-2">Conflict Engine (Heat Map)</h3>
                    {conflicts.length > 0 ? (
                        <div className="space-y-2">
                            {conflicts.map((conflict, i) => (
                                <div key={i} className={`p-3 rounded border ${conflict.severity === 'CRITICAL' ? 'bg-error/10 border-error text-error' : 'bg-warning/10 border-warning text-warning'}`}>
                                    <div className="font-bold flex items-center gap-2">
                                        {conflict.severity === 'CRITICAL' ? '⚠️' : '🔔'} {conflict.severity} ALERT
                                    </div>
                                    <div className="text-sm">{conflict.message}</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-sm text-secondary italic">No critical logistics conflicts detected. Clear skies!</div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default BookingAgent;
