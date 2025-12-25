/**
 * Connectivity Engine (Service)
 * 
 * Handles Global Calendar Sync simulation and conflict/heat detection.
 * Bridges the gap between personal schedules (Gigs/Practice) and external events (Sports/Local Intel).
 */

class ConnectivityService {
    constructor() {
        this.sources = {
            personal: [],
            sports: [],
            local: []
        };
    }

    /**
     * Simulates syncing with external calendars (Google, Outlook, etc.)
     */
    async syncPersonalCalendar() {
        // Mocking an external fetch
        return [
            { id: 'p1', title: 'DJ Gig @ First Ave', start: '2025-12-25T20:00:00', end: '2025-12-26T00:00:00', type: 'gig', location: 'Minneapolis' },
            { id: 'p2', title: 'Bar Shift @ The Local', start: '2025-12-24T18:00:00', end: '2025-12-25T02:00:00', type: 'work', location: 'Minneapolis' }
        ];
    }

    /**
     * Detects "Heat" - high impact overlaps or logistics conflicts.
     * @param {Array} personalEvents 
     * @param {Array} externalEvents (Sports/Local)
     */
    detectConflicts(personalEvents, externalEvents) {
        const conflicts = [];
        
        personalEvents.forEach(pEvent => {
            const pStart = new Date(pEvent.start);
            const pEnd = new Date(pEvent.end);
            
            externalEvents.forEach(eEvent => {
                const eStart = new Date(eEvent.start || eEvent.date); // Handle different schemas
                
                // If external event is on the same day as personal event
                if (pStart.toDateString() === eStart.toDateString()) {
                    // Check for high impact
                    if (eEvent.impact === 'HIGH' || eEvent.sport === 'NBA' || eEvent.sport === 'NFL') {
                        conflicts.push({
                            type: 'logistics_warning',
                            severity: eEvent.impact === 'HIGH' ? 'CRITICAL' : 'MODERATE',
                            message: `${eEvent.teams || eEvent.name} overlaps with your ${pEvent.title}. Expect heavy traffic/crowds.`,
                            involvedEvents: [pEvent, eEvent]
                        });
                    }
                }
            });
        });
        
        return conflicts;
    }

    /**
     * Calculates the "Flywheel Impact" - how much business this date can generate.
     */
    calculateFlywheel(externalEvents) {
        let score = 0;
        externalEvents.forEach(e => {
            if (e.impact === 'HIGH') score += 50;
            if (e.impact === 'MED') score += 20;
            if (e.sport) score += 10;
        });
        return score;
    }
}

export const connectivityService = new ConnectivityService();
