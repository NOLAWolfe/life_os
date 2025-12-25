import React, { useState, useEffect } from 'react';
import './ContentFactory.css';

const COLUMNS = [
    { id: 'Idea', label: '💡 Idea Bank' },
    { id: 'Production', label: '🎬 In Production' },
    { id: 'Scheduled', label: '🗓️ Scheduled' },
    { id: 'Posted', label: '🚀 Published' }
];

const PILLARS = [
    { id: 'AI', label: 'AI News/Demos', class: 'pillar-ai' },
    { id: 'Trending', label: 'Trending Topics', class: 'pillar-trending' },
    { id: 'Software', label: 'Building Life.io', class: 'pillar-software' },
    { id: 'DJ', label: 'DJ Life / Sets', class: 'pillar-dj' },
    { id: 'Visualizer', label: 'Music Visualizers', class: 'pillar-visualizer' }
];

const FORMATS = ['Shorts', 'Reel', 'Longform', 'Audio'];

const ContentFactory = () => {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newItem, setNewItem] = useState({
        title: '',
        pillar: 'AI',
        format: 'Shorts',
        notes: ''
    });

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const res = await fetch('/api/social/content');
            const data = await res.json();
            setItems(data);
        } catch (err) {
            console.error("Failed to fetch content:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/social/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newItem)
            });
            if (res.ok) {
                const created = await res.json();
                setItems([created, ...items]);
                setShowAddModal(false);
                setNewItem({ title: '', pillar: 'AI', format: 'Shorts', notes: '' });
            }
        } catch (err) {
            console.error("Failed to create content:", err);
        }
    };

    const updateStatus = async (itemId, newStatus) => {
        try {
            const res = await fetch(`/api/social/content/${itemId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                setItems(items.map(item => 
                    item.id === itemId ? { ...item, status: newStatus } : item
                ));
            }
        } catch (err) {
            console.error("Failed to update status:", err);
        }
    };

    const deleteItem = async (id) => {
        if (!confirm('Delete this content item?')) return;
        try {
            const res = await fetch(`/api/social/content/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setItems(items.filter(item => item.id !== id));
            }
        } catch (err) {
            console.error("Failed to delete item:", err);
        }
    };

    if (isLoading) return <div className="p-10 text-center">Loading Content Factory...</div>;

    return (
        <div className="content-factory">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-black text-white uppercase tracking-tighter">🏭 Content Factory</h2>
                    <p className="text-xs text-gray-500">Volume & Consistency Engine</p>
                </div>
                <button 
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all"
                >
                    + New Idea
                </button>
            </div>

            <div className="kanban-board">
                {COLUMNS.map(col => (
                    <div key={col.id} className="kanban-column">
                        <h3>
                            {col.label}
                            <span className="column-count">{items.filter(i => i.status === col.id).length}</span>
                        </h3>
                        
                        <div className="column-content min-h-[300px]">
                            {items.filter(item => item.status === col.id).map(item => (
                                <div key={item.id} className="content-card group">
                                    <div className={`card-pillar ${PILLARS.find(p => p.id === item.pillar)?.class}`}>
                                        {item.pillar}
                                    </div>
                                    <span className="card-title">{item.title}</span>
                                    <div className="card-meta">
                                        <span className="format-tag">{item.format}</span>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => updateStatus(item.id, col.id === 'Idea' ? 'Production' : col.id === 'Production' ? 'Scheduled' : 'Posted')}
                                                className="text-blue-400 hover:text-blue-300"
                                                title="Advance Stage"
                                            >
                                                ➡️
                                            </button>
                                            <button onClick={() => deleteItem(item.id)} className="text-red-500 hover:text-red-400">🗑️</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {col.id === 'Idea' && (
                                <button onClick={() => setShowAddModal(true)} className="add-idea-btn">
                                    + Add Idea
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Simple Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-md w-full">
                        <h3 className="text-lg font-bold text-white mb-4">New Content Idea</h3>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-xs text-gray-500 uppercase font-bold mb-1">Title</label>
                                <input 
                                    className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white"
                                    placeholder="e.g. 5 AI tools for DJs"
                                    value={newItem.title}
                                    onChange={e => setNewItem({...newItem, title: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-gray-500 uppercase font-bold mb-1">Pillar</label>
                                    <select 
                                        className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white"
                                        value={newItem.pillar}
                                        onChange={e => setNewItem({...newItem, pillar: e.target.value})}
                                    >
                                        {PILLARS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 uppercase font-bold mb-1">Format</label>
                                    <select 
                                        className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white"
                                        value={newItem.format}
                                        onChange={e => setNewItem({...newItem, format: e.target.value})}
                                    >
                                        {FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 bg-gray-800 text-white py-2 rounded-lg font-bold">Cancel</button>
                                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContentFactory;
