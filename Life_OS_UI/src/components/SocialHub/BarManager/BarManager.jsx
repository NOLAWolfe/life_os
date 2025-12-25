import React, { useState } from 'react';
import './BarManager.css';

// MOCK DATA: For the Proof of Concept
const TODAY = new Date().toISOString().split('T')[0];

const MOCK_SPORTS_SCHEDULE = [
    {
        id: 1,
        date: TODAY,
        location: 'Minneapolis',
        sport: 'NBA',
        teams: 'Timberwolves vs Lakers',
        time: '7:00 PM',
        network: 'ESPN',
        channel: 'Ch 206',
    },
    {
        id: 2,
        date: TODAY,
        location: 'Minneapolis',
        sport: 'UFC',
        teams: 'UFC 300 Prelims',
        time: '5:00 PM',
        network: 'ESPN+',
        channel: 'Streaming',
    },
    {
        id: 3,
        date: '2025-12-25',
        location: 'St. Paul',
        sport: 'NFL',
        teams: 'Vikings vs Packers',
        time: '12:00 PM (Sun)',
        network: 'FOX',
        channel: 'Ch 9',
    },
    {
        id: 4,
        date: '2025-12-24',
        location: 'Minneapolis',
        sport: 'NHL',
        teams: 'Wild vs Stars',
        time: '8:30 PM',
        network: 'TNT',
        channel: 'Ch 245',
    },
    {
        id: 5,
        date: TODAY,
        location: 'Rochester',
        sport: 'NBA',
        teams: 'Timberwolves vs Lakers',
        time: '7:00 PM',
        network: 'ESPN',
        channel: 'Ch 30',
    },
];

const MOCK_LOCAL_EVENTS = [
    {
        id: 1,
        date: TODAY,
        location: 'Minneapolis',
        name: 'Medical Tech Convention',
        venue: 'Minneapolis Convention Center',
        attendees: '5,000',
        impact: 'MED',
    },
    {
        id: 2,
        date: '2025-12-24',
        location: 'Minneapolis',
        name: 'Taylor Swift Concert',
        venue: 'U.S. Bank Stadium',
        attendees: '60,000+',
        impact: 'HIGH',
    },
    {
        id: 3,
        date: '2025-12-25',
        location: 'St. Paul',
        name: 'Twins Game',
        venue: 'Target Field',
        attendees: '25,000',
        impact: 'MED',
    },
    {
        id: 4,
        date: TODAY,
        location: 'Rochester',
        name: 'Mayo Clinic Symposium',
        venue: 'Mayo Civic Center',
        attendees: '2,000',
        impact: 'LOW',
    },
];

const LOCATIONS = ['Minneapolis', 'St. Paul', 'Rochester'];

const BarManager = () => {
    const [activeTab, setActiveTab] = useState('sports');
    const [selectedDate, setSelectedDate] = useState(TODAY);
    const [selectedLocation, setSelectedLocation] = useState('Minneapolis');

    // Filter Data by Date AND Location
    const filteredSports = MOCK_SPORTS_SCHEDULE.filter(
        (s) => s.date === selectedDate && s.location === selectedLocation
    );
    const filteredEvents = MOCK_LOCAL_EVENTS.filter(
        (e) => e.date === selectedDate && e.location === selectedLocation
    );

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="bar-manager-container widget-card p-4 print:border-none print:shadow-none print:p-0">
            {/* Header: Hidden in Print Mode */}
            <div className="flex justify-between items-center mb-4 print:hidden">
                <h2 className="widget-title text-xl font-bold flex items-center gap-2 m-0">
                    🍸 Bar Manager's Aid{' '}
                    <span className="text-xs bg-blue-600 px-2 py-0.5 rounded text-white">BETA</span>
                </h2>
                <div className="flex gap-2">
                    <select
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="bg-gray-800 text-white text-xs border border-gray-600 rounded px-2 py-1"
                    >
                        {LOCATIONS.map((loc) => (
                            <option key={loc} value={loc}>
                                {loc}
                            </option>
                        ))}
                    </select>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-gray-800 text-white text-xs border border-gray-600 rounded px-2 py-1"
                    />
                    <button
                        onClick={handlePrint}
                        className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs"
                    >
                        🖨️
                    </button>
                </div>
            </div>

            {/* Print Only Header */}
            <div className="hidden print:block mb-6 text-center text-black">
                <h1 className="text-2xl font-bold uppercase">{selectedLocation} Forecast</h1>
                <p className="text-sm text-gray-600">
                    {new Date(selectedDate).toLocaleDateString(undefined, {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })}
                </p>
            </div>

            <div className="flex gap-2 mb-4 print:hidden">
                <button
                    className={`px-4 py-2 rounded text-sm font-bold ${activeTab === 'sports' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                    onClick={() => setActiveTab('sports')}
                >
                    🏈 Sports ({filteredSports.length})
                </button>
                <button
                    className={`px-4 py-2 rounded text-sm font-bold ${activeTab === 'events' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                    onClick={() => setActiveTab('events')}
                >
                    radar Local Intel ({filteredEvents.length})
                </button>
            </div>

            {/* Content Section - Always Visible */}
            <div className="space-y-6">
                {/* Sports Section */}
                <div
                    className={`sports-grid space-y-3 ${activeTab !== 'sports' ? 'hidden print:block' : ''}`}
                >
                    <h3 className="text-sm font-bold text-gray-400 mb-2 uppercase print:text-black border-b print:border-black pb-1">
                        Broadcast Schedule
                    </h3>
                    {filteredSports.length > 0 ? (
                        filteredSports.map((game) => (
                            <div
                                key={game.id}
                                className="game-card bg-gray-800 p-3 rounded-lg border border-gray-700 flex justify-between items-center print:bg-white print:border-b print:border-gray-300 print:rounded-none"
                            >
                                <div>
                                    <div className="text-xs font-bold text-blue-400 print:text-black">
                                        {game.sport}
                                    </div>
                                    <div className="font-bold text-white print:text-black">
                                        {game.teams}
                                    </div>
                                    <div className="text-sm text-gray-400 print:text-gray-600">
                                        {game.time}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-bold text-yellow-500 print:text-black">
                                        {game.network}
                                    </div>
                                    <div className="text-xs text-gray-500 print:text-black">
                                        {game.channel}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500 italic border border-dashed border-gray-700 rounded print:border-gray-300">
                            No high-impact games forecasted for this date.
                        </div>
                    )}
                </div>

                {/* Events Section */}
                <div
                    className={`events-grid space-y-3 ${activeTab !== 'events' ? 'hidden print:block' : ''}`}
                >
                    <h3 className="text-sm font-bold text-gray-400 mb-2 uppercase print:text-black border-b print:border-black pb-1 mt-6">
                        Crowd Intel
                    </h3>
                    {filteredEvents.length > 0 ? (
                        filteredEvents.map((event) => (
                            <div
                                key={event.id}
                                className="event-card bg-gray-800 p-3 rounded-lg border border-gray-700 flex justify-between items-center print:bg-white print:border-b print:border-gray-300 print:rounded-none"
                            >
                                <div>
                                    <div className="font-bold text-white print:text-black">
                                        {event.name}
                                    </div>
                                    <div className="text-sm text-gray-400 print:text-gray-600">
                                        {event.venue}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div
                                        className={`text-xs font-bold px-2 py-1 rounded ${event.impact === 'HIGH' ? 'bg-red-900 text-red-200 print:text-black print:bg-transparent print:border print:border-black' : 'bg-yellow-900 text-yellow-200 print:text-black print:bg-transparent'}`}
                                    >
                                        {event.impact} IMPACT
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1 print:text-black">
                                        {event.attendees} Ppl
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500 italic border border-dashed border-gray-700 rounded print:border-gray-300">
                            No crowd surges detected.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BarManager;
