import React, { useState, useEffect, useMemo } from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useUser } from '../../../contexts/UserContext';
import './WidgetGrid.css';

// Fix for Vite/ESM import issue
// console.log('📦 RGL Import:', GridLayout); // Removing log
const Responsive = GridLayout.Responsive;
const WidthProvider = GridLayout.WidthProvider;

// Fallback if WidthProvider is missing (maybe on root?)
const ResponsiveGridLayout = WidthProvider ? WidthProvider(Responsive) : Responsive;

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

// Default Layouts if User has none
const DEFAULT_LAYOUTS = {
    lg: [
        { i: 'wealth_targets', x: 0, y: 0, w: 6, h: 2 },
        { i: 'wealth_mentor', x: 6, y: 0, w: 6, h: 2 },
        { i: 'daily_reads', x: 0, y: 2, w: 6, h: 2 },
        { i: 'calendar', x: 6, y: 2, w: 6, h: 4 },
        { i: 'small_win', x: 0, y: 4, w: 6, h: 2 },
        { i: 'balances', x: 0, y: 6, w: 6, h: 2 },
        { i: 'todo_tracker', x: 6, y: 6, w: 6, h: 2 },
        { i: 'obsidian', x: 0, y: 8, w: 12, h: 2 },
    ],
};

const WidgetGrid = () => {
    const { user, toggleTool } = useUser(); // We'll need a saveLayout function in UserContext
    const [layouts, setLayouts] = useState(DEFAULT_LAYOUTS);

    // Load layout from user preferences if available
    useEffect(() => {
        if (user?.dashboardLayout && Object.keys(user.dashboardLayout).length > 0) {
            setLayouts(user.dashboardLayout);
        }
    }, [user]);

    // Save layout on change
    const onLayoutChange = (currentLayout, allLayouts) => {
        setLayouts(allLayouts);
        // Here we would call saveLayout(allLayouts) to persist to DB
        // For now, we'll just log it until we add the function to UserContext
        console.log('Layout changed:', allLayouts);
        saveLayoutToDB(allLayouts);
    };

    const saveLayoutToDB = async (newLayouts) => {
         try {
            await fetch(`/api/system/user/${user.id}/preferences`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dashboardLayout: newLayouts }),
            });
        } catch (err) {
            console.error('Failed to save layout:', err);
        }
    };

    const renderWidget = (id) => {
        const Component = WIDGET_COMPONENTS[id];
        if (!Component) return null;

        // Check if the tool for this widget is installed
        // (Mapping widget IDs to Tool IDs for filtering)
        const widgetToToolMap = {
            wealth_targets: 'finance',
            wealth_mentor: 'finance',
            balances: 'finance',
            calendar: 'life_admin',
            daily_reads: 'life_admin',
            todo_tracker: 'life_admin',
            obsidian: 'life_admin',
            small_win: 'finance'
        };

        const toolId = widgetToToolMap[id];
        if (toolId && !user?.installedTools?.includes(toolId)) return null;

        return (
            <div key={id} className="widget-grid-item">
                <div className="widget-handle">::</div>
                <div style={{ height: '100%', overflow: 'auto', padding: '10px' }}>
                    <Component />
                </div>
            </div>
        );
    };

    const activeWidgets = DEFAULT_LAYOUTS.lg.filter(item => {
        const widgetToToolMap = {
            wealth_targets: 'finance',
            wealth_mentor: 'finance',
            balances: 'finance',
            calendar: 'life_admin',
            daily_reads: 'life_admin',
            todo_tracker: 'life_admin',
            obsidian: 'life_admin',
            small_win: 'finance'
        };
        const toolId = widgetToToolMap[item.i];
        return !toolId || user?.installedTools?.includes(toolId);
    });

    if (activeWidgets.length === 0) {
        return (
            <div style={{ 
                padding: '60px', 
                textAlign: 'center', 
                background: 'var(--bg-card)', 
                borderRadius: '16px',
                border: '1px dashed var(--border-border)',
                marginTop: '40px'
            }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🛰️</div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Command Center Offline</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
                    You haven't installed any modules yet. Visit the Vantage Store to upgrade your system.
                </p>
                <button 
                    onClick={() => window.location.href = '/app/store'}
                    className="btn-primary"
                >
                    Visit Vantage Store
                </button>
            </div>
        );
    }

    return (
        <ResponsiveGridLayout
            className="layout"
            layouts={layouts}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={150}
            draggableHandle=".widget-handle"
            onLayoutChange={onLayoutChange}
            margin={[16, 16]}
        >
            {activeWidgets.map((item) => renderWidget(item.i))}
        </ResponsiveGridLayout>
    );
};

export default WidgetGrid;
