import React from 'react';
import { useUser } from '../../../contexts/UserContext';
import './WidgetGrid.css';

// Widget Imports
import Calendar from '../../LifeAdmin/Calendar/Calendar';
import BalancesWidget from '../../Finance/BalancesWidget/BalancesWidget';
import ObsidianConnector from '../../System/ObsidianConnector/ObsidianConnector';
import SmallWinWidget from '../../Finance/SmallWinWidget/SmallWinWidget';
import WealthTargets from '../../Finance/WealthTargets/WealthTargets';
import WealthMentor from '../../Finance/WealthMentor/WealthMentor';
import DailyReads from '../../LifeAdmin/DailyReads/DailyReads';
import ToDoTracker from '../../LifeAdmin/TodoTracker/TodoTracker';

const WIDGET_COMPONENTS = {
    wealth_targets: WealthTargets,
    wealth_mentor: WealthMentor,
    daily_reads: DailyReads,
    calendar: Calendar,
    small_win: SmallWinWidget,
    balances: BalancesWidget,
    obsidian: ObsidianConnector,
    todo_tracker: ToDoTracker,
};

const DEFAULT_WIDGETS = Object.keys(WIDGET_COMPONENTS);

const WidgetGrid = () => {
    const { user } = useUser();

    // Use user's layout, or default to all widgets in order
    const layout = user?.dashboardLayout?.widgets || DEFAULT_WIDGETS;

    const visibleWidgets = layout.filter(item => {
        const widgetId = typeof item === 'string' ? item : item.id;
        const widgetToToolMap = {
            wealth_targets: 'finance',
            wealth_mentor: 'finance',
            balances: 'finance',
            calendar: 'life_admin',
            daily_reads: 'life_admin',
            todo_tracker: 'life_admin',
            obsidian: 'life_admin',
            small_win: 'finance',
        };
        const toolId = widgetToToolMap[widgetId];
        return !toolId || user?.installedTools?.includes(toolId);
    });

    if (visibleWidgets.length === 0) {
        // If they have no tools installed at all
        if (user?.installedTools?.length === 0) {
            return (
                <div style={{ padding: '60px', textAlign: 'center', background: 'var(--bg-card)', borderRadius: '16px', border: '1px dashed var(--border-color)' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🛰️</div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Command Center Offline</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
                        You haven't installed any modules. Visit the Vantage Store to upgrade your system.
                    </p>
                    <button onClick={() => window.location.href = '/app/store'} className="btn-primary">
                        Visit Vantage Store
                    </button>
                </div>
            );
        }
        // If they have tools, but no widgets are visible for them
        return (
             <div style={{ padding: '60px', textAlign: 'center', background: 'var(--bg-card)', borderRadius: '16px', border: '1px dashed var(--border-color)' }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>✨</div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>A Blank Canvas</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
                    Your dashboard is ready. Visit the Tool Store to configure your widgets.
                </p>
                <button onClick={() => window.location.href = '/app/store'} className="btn-primary">
                    Configure Widgets
                </button>
            </div>
        )
    }

    return (
        <div className="widget-grid-container">
            {visibleWidgets.map((item, index) => {
                const widgetId = typeof item === 'string' ? item : item.id;
                const Component = WIDGET_COMPONENTS[widgetId];
                if (!Component) return null;
                return (
                    <div key={widgetId} className="widget-flex-item" style={{ order: index }}>
                        <Component />
                    </div>
                );
            })}
        </div>
    );
};

export default WidgetGrid;
