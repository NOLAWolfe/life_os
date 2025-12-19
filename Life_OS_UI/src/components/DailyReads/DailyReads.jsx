import React, { useState } from "react";

const DailyReads = () => {
  const [reads, setReads] = useState([
    {
      title: "The Power of Habit",
      author: "Charles Duhigg",
      description: "A book about how habits work and how to change them.",
      source: "Book",
      category: "Self-Help",
      link: "https://www.example.com/power-of-habit",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    source: "",
    link: "",
    category: "General"
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddRead = () => {
    if (!formData.title) return;
    setReads([...reads, formData]);
    setFormData({ title: "", author: "", description: "", source: "", link: "", category: "General" });
    setShowForm(false); // Close form after adding
  };

  return (
    <div className="daily-reads-container widget-card">
      <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
        <h2 className="text-xl font-bold m-0">Daily Reads</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="text-sm bg-transparent border border-gray-600 hover:bg-gray-800 text-gray-300 px-3 py-1 rounded"
        >
          {showForm ? 'Cancel' : '+ Add Book'}
        </button>
      </div>
      
      {showForm && (
        <div className="add-read-form mb-6 p-4 border border-gray-700 rounded bg-input-bg animate-fade-in">
            <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider text-gray-400">New Entry</h3>
            <div className="grid grid-cols-1 gap-3">
            <input
                type="text"
                name="title"
                placeholder="Book Title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full"
            />
            <input
                type="text"
                name="author"
                placeholder="Author"
                value={formData.author}
                onChange={handleInputChange}
                className="w-full"
            />
            <textarea
                name="description"
                placeholder="Short Description"
                value={formData.description}
                onChange={handleInputChange}
                className="p-2 rounded border border-gray-600 bg-input-bg w-full"
                rows="2"
            />
            <input
                type="text"
                name="link"
                placeholder="URL (optional)"
                value={formData.link}
                onChange={handleInputChange}
                className="w-full"
            />
            <div className="flex gap-2">
                <input
                type="text"
                name="source"
                placeholder="Source (e.g. Kindle)"
                value={formData.source}
                onChange={handleInputChange}
                className="flex-1"
                />
                <button 
                onClick={handleAddRead}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded"
                >
                Save
                </button>
            </div>
            </div>
        </div>
      )}

      <div className="reads-list space-y-4">
        {reads.map((read, index) => (
          <div key={index} className="read-item p-4 rounded bg-gray-800/50 border border-gray-700 hover:border-gray-500 transition-colors">
            <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-yellow-500">{read.title}</h3>
                <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">{read.category}</span>
            </div>
            <p className="text-xs text-gray-400 mb-2">
              by {read.author} • {read.source}
            </p>
            <p className="text-sm text-gray-300 leading-relaxed">{read.description}</p>
            {read.link && (
              <a href={read.link} className="text-blue-400 hover:text-blue-300 text-xs mt-2 inline-block" target="_blank" rel="noopener noreferrer">
                Read More →
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyReads;
