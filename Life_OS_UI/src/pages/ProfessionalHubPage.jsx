import React, { useState, useEffect } from 'react';
import adoService from '../services/adoService';
import aiService from '../services/aiService';
import AiAnalysis from '../components/Professional/AiAnalysis/AiAnalysis';
import ScenarioGenerator from '../components/Professional/ScenarioGenerator/ScenarioGenerator';
import AutomationStencil from '../components/Professional/AutomationStencil/AutomationStencil';
import '../pages/Page.css';
import './ProfessionalHubPage.css';

const ProfessionalHubPage = () => {
    const [userStories, setUserStories] = useState([]);
    const [bugs, setBugs] = useState([]);
    const [analysis, setAnalysis] = useState(null);
    const [scenarios, setScenarios] = useState(null);
    const [stencil, setStencil] = useState(null);
    const [analyzingStoryId, setAnalyzingStoryId] = useState(null);

    // Form State
    const [showForm, setShowForm] = useState(false);
    const [formType, setFormType] = useState('story'); // 'story' or 'bug'
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        state: 'New',
        assignedTo: '',
        acceptanceCriteria: '',
        severity: '3',
    });
    const [viewMode, setViewMode] = useState('board'); // 'list' or 'board'

    const loadData = () => {
        adoService.getMyUserStories().then(setUserStories);
        adoService.getMyBugs().then(setBugs);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleAnalysis = async (story) => {
        setAnalyzingStoryId(story.id);
        setAnalysis(null);
        setScenarios(null);
        setStencil(null);
        const summary = await aiService.summarizeUserStory(story);
        setAnalysis(summary);
    };

    const handleGenerateScenarios = async (story) => {
        const generatedScenarios = await aiService.generateScenarios(story);
        setScenarios(generatedScenarios);
    };

    const handleGenerateStencil = async (story) => {
        const generatedStencil = await aiService.generateStencil(story);
        setStencil(generatedStencil);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (formType === 'story') {
            await adoService.addUserStory({
                title: formData.title,
                description: formData.description,
                state: formData.state,
                assignedTo: formData.assignedTo,
                acceptanceCriteria: formData.acceptanceCriteria,
            });
        } else {
            await adoService.addBug({
                title: formData.title,
                state: formData.state,
                severity: formData.severity,
            });
        }
        setShowForm(false);
        setFormData({
            title: '',
            description: '',
            state: 'New',
            assignedTo: '',
            acceptanceCriteria: '',
            severity: '3',
        });
        loadData();
    };

    // --- Render Helpers ---
    const renderStoryCard = (story) => (
        <div key={story.id} className="work-item-card">
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-blue-400">{story.title}</h4>
                <span
                    className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${story.state === 'New' ? 'bg-blue-900 text-blue-200' : story.state === 'Active' ? 'bg-green-900 text-green-200' : 'bg-gray-700'}`}
                >
                    {story.state}
                </span>
            </div>

            {story.description && (
                <div className="mb-3 text-sm text-gray-300">
                    <p>{story.description}</p>
                </div>
            )}

            <div className="text-xs text-gray-500 mb-3 flex gap-4">
                <span>🆔 {story.id}</span>
                <span>👤 {story.assignedTo || 'Unassigned'}</span>
            </div>

            <details className="mb-3">
                <summary className="text-xs font-bold cursor-pointer hover:text-white text-gray-400">
                    Acceptance Criteria
                </summary>
                <pre className="text-xs mt-2 bg-black/30 p-2 rounded whitespace-pre-wrap text-gray-300">
                    {story.acceptanceCriteria || 'None provided.'}
                </pre>
            </details>

            <button onClick={() => handleAnalysis(story)} className="analyze-btn w-full mt-2">
                ✨ AI Analyze
            </button>

            {analyzingStoryId === story.id && analysis && (
                <AiAnalysis
                    summary={analysis}
                    onGenerateScenarios={() => handleGenerateScenarios(story)}
                />
            )}
            {analyzingStoryId === story.id && scenarios && (
                <ScenarioGenerator
                    scenarios={scenarios}
                    onGenerateStencil={() => handleGenerateStencil(story)}
                />
            )}
            {analyzingStoryId === story.id && stencil && <AutomationStencil stencil={stencil} />}
        </div>
    );

    return (
        <div className="page-container">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1>Professional Hub (QA Co-Pilot)</h1>
                    <p>Your centralized workspace for QA tasks and Azure DevOps integration.</p>
                </div>
                <div className="flex gap-3">
                    <div className="flex bg-gray-800 rounded p-1 border border-gray-700">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-3 py-1 text-xs rounded ${viewMode === 'list' ? 'bg-gray-600 text-white' : 'text-gray-400'}`}
                        >
                            List
                        </button>
                        <button
                            onClick={() => setViewMode('board')}
                            className={`px-3 py-1 text-xs rounded ${viewMode === 'board' ? 'bg-blue-700 text-white' : 'text-gray-400'}`}
                        >
                            Board
                        </button>
                    </div>
                    <button
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded text-sm font-bold"
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? 'Cancel' : '+ New Item'}
                    </button>
                </div>
            </header>

            {showForm && (
                <div className="mb-8 p-6 bg-gray-800 rounded border border-gray-700 animate-fade-in">
                    <div className="flex gap-4 mb-4">
                        <button
                            className={`px-4 py-1 rounded-full text-sm ${formType === 'story' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'}`}
                            onClick={() => setFormType('story')}
                        >
                            User Story
                        </button>
                        <button
                            className={`px-4 py-1 rounded-full text-sm ${formType === 'bug' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-400'}`}
                            onClick={() => setFormType('bug')}
                        >
                            Bug
                        </button>
                    </div>

                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <input
                            className="w-full p-2 rounded bg-gray-900 border border-gray-600"
                            placeholder="Title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                        {formType === 'story' && (
                            <textarea
                                className="w-full p-2 rounded bg-gray-900 border border-gray-600 h-20"
                                placeholder="Description (Context, Business Value...)"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                            />
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <select
                                className="p-2 rounded bg-gray-900 border border-gray-600"
                                value={formData.state}
                                onChange={(e) =>
                                    setFormData({ ...formData, state: e.target.value })
                                }
                            >
                                <option value="New">New</option>
                                <option value="Active">Active</option>
                                <option value="Closed">Closed</option>
                            </select>
                            {formType === 'story' ? (
                                <input
                                    className="p-2 rounded bg-gray-900 border border-gray-600"
                                    placeholder="Assigned To"
                                    value={formData.assignedTo}
                                    onChange={(e) =>
                                        setFormData({ ...formData, assignedTo: e.target.value })
                                    }
                                />
                            ) : (
                                <input
                                    className="p-2 rounded bg-gray-900 border border-gray-600"
                                    placeholder="Severity (1-4)"
                                    value={formData.severity}
                                    onChange={(e) =>
                                        setFormData({ ...formData, severity: e.target.value })
                                    }
                                />
                            )}
                        </div>
                        {formType === 'story' && (
                            <textarea
                                className="w-full p-2 rounded bg-gray-900 border border-gray-600 h-24"
                                placeholder="Acceptance Criteria"
                                value={formData.acceptanceCriteria}
                                onChange={(e) =>
                                    setFormData({ ...formData, acceptanceCriteria: e.target.value })
                                }
                            />
                        )}
                        <button className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded font-bold w-full">
                            Save Item
                        </button>
                    </form>
                </div>
            )}

            {viewMode === 'list' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="work-item-section">
                        <h3>My User Stories</h3>
                        <div className="work-item-list">
                            {userStories.map((story) => renderStoryCard(story))}
                            {userStories.length === 0 && (
                                <p className="text-gray-500 italic">No user stories found.</p>
                            )}
                        </div>
                    </div>
                    <div className="work-item-section">
                        <h3>My Bugs</h3>
                        <div className="work-item-list">
                            {bugs.map((bug) => (
                                <div
                                    key={bug.id}
                                    className="work-item-card border-l-4 border-red-500"
                                >
                                    <div className="flex justify-between">
                                        <h4 className="text-red-300">{bug.title}</h4>
                                        <span className="text-xs bg-red-900/50 text-red-200 px-2 py-1 rounded">
                                            Sev {bug.severity}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">State: {bug.state}</p>
                                </div>
                            ))}
                            {bugs.length === 0 && (
                                <p className="text-gray-500 italic">No bugs found.</p>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="board-view grid grid-cols-1 md:grid-cols-3 gap-4 h-full min-h-[600px]">
                    {['New', 'Active', 'Closed'].map((status) => (
                        <div
                            key={status}
                            className="board-column bg-gray-900/50 rounded-lg p-4 border border-gray-800"
                        >
                            <h3 className="text-sm uppercase font-bold text-gray-400 mb-4 pb-2 border-b border-gray-700 flex justify-between">
                                {status}
                                <span className="bg-gray-800 px-2 rounded-full text-xs">
                                    {userStories.filter((s) => s.state === status).length +
                                        bugs.filter((b) => b.state === status).length}
                                </span>
                            </h3>
                            <div className="space-y-3">
                                {userStories
                                    .filter((s) => s.state === status)
                                    .map((story) => renderStoryCard(story))}
                                {bugs
                                    .filter((b) => b.state === status)
                                    .map((bug) => (
                                        <div
                                            key={bug.id}
                                            className="work-item-card border-l-4 border-red-500 opacity-90 hover:opacity-100"
                                        >
                                            <div className="flex justify-between items-start">
                                                <span className="text-xs font-bold text-red-400 uppercase">
                                                    Bug
                                                </span>
                                                <span className="text-[10px] bg-gray-800 px-1 rounded text-gray-400">
                                                    #{bug.id}
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium mt-1">{bug.title}</p>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProfessionalHubPage;
