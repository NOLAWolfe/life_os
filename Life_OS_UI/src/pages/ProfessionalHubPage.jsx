import React, { useState, useEffect } from 'react';
import adoService from '../services/adoService';
import aiService from '../services/aiService';
import AiAnalysis from '../components/AiAnalysis/AiAnalysis';
import ScenarioGenerator from '../components/ScenarioGenerator/ScenarioGenerator';
import AutomationStencil from '../components/AutomationStencil/AutomationStencil';
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
    const [formData, setFormData] = useState({ title: '', state: 'New', assignedTo: '', acceptanceCriteria: '', severity: '3' });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        adoService.getMyUserStories().then(setUserStories);
        adoService.getMyBugs().then(setBugs);
    };

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
                state: formData.state,
                assignedTo: formData.assignedTo,
                acceptanceCriteria: formData.acceptanceCriteria
            });
        } else {
            await adoService.addBug({
                title: formData.title,
                state: formData.state,
                severity: formData.severity
            });
        }
        setShowForm(false);
        setFormData({ title: '', state: 'New', assignedTo: '', acceptanceCriteria: '', severity: '3' });
        loadData();
    };

    return (
        <div className="page-container">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1>Professional Hub (QA Co-Pilot)</h1>
                    <p>Your centralized workspace for QA tasks and Azure DevOps integration.</p>
                </div>
                <button 
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Cancel' : '+ New Item'}
                </button>
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
                            onChange={e => setFormData({...formData, title: e.target.value})}
                            required
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <input 
                                className="p-2 rounded bg-gray-900 border border-gray-600" 
                                placeholder="State (New, Active, Closed)"
                                value={formData.state}
                                onChange={e => setFormData({...formData, state: e.target.value})}
                            />
                            {formType === 'story' ? (
                                <input 
                                    className="p-2 rounded bg-gray-900 border border-gray-600" 
                                    placeholder="Assigned To"
                                    value={formData.assignedTo}
                                    onChange={e => setFormData({...formData, assignedTo: e.target.value})}
                                />
                            ) : (
                                <input 
                                    className="p-2 rounded bg-gray-900 border border-gray-600" 
                                    placeholder="Severity (1-4)"
                                    value={formData.severity}
                                    onChange={e => setFormData({...formData, severity: e.target.value})}
                                />
                            )}
                        </div>
                        {formType === 'story' && (
                            <textarea 
                                className="w-full p-2 rounded bg-gray-900 border border-gray-600 h-24" 
                                placeholder="Acceptance Criteria"
                                value={formData.acceptanceCriteria}
                                onChange={e => setFormData({...formData, acceptanceCriteria: e.target.value})}
                            />
                        )}
                        <button className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded font-bold w-full">Save Item</button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="work-item-section">
                    <h3>My User Stories</h3>
                    <div className="work-item-list">
                        {userStories.map(story => (
                            <div key={story.id} className="work-item-card">
                                <h4>{story.title}</h4>
                                <p><strong>State:</strong> {story.state}</p>
                                <p><strong>ID:</strong> {story.id}</p>
                                <details>
                                    <summary>Acceptance Criteria</summary>
                                    <pre>{story.acceptanceCriteria}</pre>
                                </details>
                                <button onClick={() => handleAnalysis(story)} className="analyze-btn">
                                    Analyze
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
                                {analyzingStoryId === story.id && stencil && (
                                    <AutomationStencil stencil={stencil} />
                                )}
                            </div>
                        ))}
                        {userStories.length === 0 && <p className="text-gray-500 italic">No user stories found.</p>}
                    </div>
                </div>
                <div className="work-item-section">
                    <h3>My Bugs</h3>
                    <div className="work-item-list">
                        {bugs.map(bug => (
                            <div key={bug.id} className="work-item-card">
                                <h4>{bug.title}</h4>
                                <p><strong>State:</strong> {bug.state}</p>
                                <p><strong>ID:</strong> {bug.id}</p>
                                <p><strong>Severity:</strong> {bug.severity}</p>
                            </div>
                        ))}
                        {bugs.length === 0 && <p className="text-gray-500 italic">No bugs found.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfessionalHubPage;
