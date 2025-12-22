import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.css';

const localizer = momentLocalizer(moment);

// Mock data for initial events
const mockEvents = [
    {
        id: 0,
        title: 'DJ Practice Session',
        start: new Date(2025, 11, 18, 18, 0, 0),
        end: new Date(2025, 11, 18, 20, 0, 0),
        resourceId: 1,
    },
    {
        id: 1,
        title: 'Analyze new music',
        start: new Date(2025, 11, 20, 15, 0, 0),
        end: new Date(2025, 11, 20, 16, 0, 0),
        resourceId: 2,
    },
];

const CalendarComponent = () => {
    const [events, setEvents] = useState(mockEvents);

    return (
        <div className="calendar-container">
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 600 }}
            />
        </div>
    );
};

export default CalendarComponent;
