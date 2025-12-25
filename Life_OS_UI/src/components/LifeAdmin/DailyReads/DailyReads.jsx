import React, { useState, useEffect } from 'react';

const DailyReads = () => {
    const [reads, setReads] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        author: '',
        description: '',
        source: '', // For "Source" like "Kindle" or "Coursera"
        type: 'book', // "book", "certification", "article", "quote"
        link: '',
        category: 'General', // Will map to tags
    });

    useEffect(() => {
        fetchReads();
    }, []);

    const fetchReads = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/daily-reads');
            if (res.ok) {
                const data = await res.json();
                setReads(data);
            }
        } catch (error) {
            console.error('Failed to fetch daily reads', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddRead = async () => {
        if (!formData.title && formData.type !== 'quote') return;
        if (formData.type === 'quote' && !formData.description) return; // For quotes, description is content

        const newRead = {
            title: formData.title,
            author: formData.author,
            description: formData.description, // Store description/notes
            source: formData.source,
            type: formData.type,
            link: formData.link,
            tags: [formData.category], // Simple tag mapping
            status: 'in progress',
        };

        if (formData.type === 'quote') {
            newRead.content = formData.description; // Map description to content for quotes
            delete newRead.description;
            if (!newRead.title) newRead.title = 'Quote';
        }

        try {
            const res = await fetch('/api/daily-reads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newRead),
            });

            if (res.ok) {
                const savedRead = await res.json();
                // Refresh list or append locally
                fetchReads();
                setFormData({
                    title: '',
                    author: '',
                    description: '',
                    source: '',
                    type: 'book',
                    link: '',
                    category: 'General',
                });
                setShowForm(false);
            }
        } catch (error) {
            console.error('Failed to save read', error);
        }
    };

    return (
        <div className="daily-reads-container widget-card">
            <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
                <h2 className="text-xl font-bold m-0">Daily Reads</h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="text-sm bg-transparent border border-gray-600 hover:bg-gray-800 text-gray-300 px-3 py-1 rounded"
                >
                    {showForm ? 'Cancel' : '+ Add Item'}
                </button>
            </div>

            {showForm && (
                <div className="add-read-form mb-6 p-4 border border-gray-700 rounded bg-input-bg animate-fade-in">
                    <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider text-gray-400">
                        New Entry
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                        <div className="flex gap-2">
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                className="p-2 rounded border border-gray-600 bg-input-bg text-sm"
                            >
                                <option value="book">Book</option>
                                <option value="certification">Certification</option>
                                <option value="article">Article</option>
                                <option value="quote">Quote</option>
                            </select>
                            <input
                                type="text"
                                name="category"
                                placeholder="Category / Tag"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="flex-1"
                            />
                        </div>

                        {formData.type !== 'quote' && (
                            <input
                                type="text"
                                name="title"
                                placeholder="Title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full"
                            />
                        )}

                        <input
                            type="text"
                            name="author"
                            placeholder={
                                formData.type === 'quote'
                                    ? 'Author / Speaker'
                                    : 'Author / Instructor'
                            }
                            value={formData.author}
                            onChange={handleInputChange}
                            className="w-full"
                        />

                        <textarea
                            name="description"
                            placeholder={
                                formData.type === 'quote'
                                    ? 'Quote Content...'
                                    : 'Short Description / Notes'
                            }
                            value={formData.description}
                            onChange={handleInputChange}
                            className="p-2 rounded border border-gray-600 bg-input-bg w-full"
                            rows="2"
                        />

                        {formData.type !== 'quote' && (
                            <input
                                type="text"
                                name="link"
                                placeholder="URL (optional)"
                                value={formData.link}
                                onChange={handleInputChange}
                                className="w-full"
                            />
                        )}

                        <div className="flex gap-2">
                            {formData.type !== 'quote' && (
                                <input
                                    type="text"
                                    name="source"
                                    placeholder="Source (e.g. Kindle, Coursera)"
                                    value={formData.source}
                                    onChange={handleInputChange}
                                    className="flex-1"
                                />
                            )}
                            <button
                                onClick={handleAddRead}
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded ml-auto"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {loading ? (
                <p className="text-gray-500 text-center text-sm py-4">Loading library...</p>
            ) : (
                <div className="reads-list space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {reads.map((read, index) => (
                        <div
                            key={index}
                            className="read-item p-4 rounded bg-gray-800/50 border border-gray-700 hover:border-gray-500 transition-colors"
                        >
                            <div className="flex justify-between items-start">
                                <h3 className="text-lg font-bold text-yellow-500">
                                    {read.type === 'quote'
                                        ? `"${read.content || read.description}"`
                                        : read.title}
                                </h3>
                                <span className="text-[10px] uppercase bg-gray-700 px-2 py-1 rounded text-gray-300 ml-2 whitespace-nowrap">
                                    {read.type}
                                </span>
                            </div>

                            <div className="flex justify-between items-center mt-1">
                                <p className="text-xs text-gray-400">
                                    {read.author ? `by ${read.author}` : ''}
                                    {read.source ? ` • ${read.source}` : ''}
                                </p>
                                {read.tags && read.tags.length > 0 && (
                                    <span className="text-xs text-blue-400">
                                        {read.tags.join(', ')}
                                    </span>
                                )}
                            </div>

                            {read.type !== 'quote' && read.description && (
                                <p className="text-sm text-gray-300 leading-relaxed mt-2">
                                    {read.description}
                                </p>
                            )}

                            {read.link && (
                                <a
                                    href={read.link}
                                    className="text-blue-400 hover:text-blue-300 text-xs mt-2 inline-block"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Read More →
                                </a>
                            )}
                        </div>
                    ))}
                    {reads.length === 0 && (
                        <p className="text-center text-gray-500 py-4">
                            No active reads. Start something new!
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default DailyReads;
