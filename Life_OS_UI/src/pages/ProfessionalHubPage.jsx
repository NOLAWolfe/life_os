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

    useEffect(() => {
        adoService.getMyUserStories().then(stories => {
            setUserStories(stories);
        });
        adoService.getMyBugs().then(bugs => {
            setBugs(bugs);
        });
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

    return (
        <div className="page-container">
            <header className="mb-8">
                <h1>Professional Hub (QA Co-Pilot)</h1>
                <p>Your centralized workspace for QA tasks and Azure DevOps integration.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="work-item-section">
                    <h3>My User Stories (Mock)</h3>
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
                    </div>
                </div>
                <div className="work-item-section">
                    <h3>My Bugs (Mock)</h3>
                    <div className="work-item-list">
                        {bugs.map(bug => (
                            <div key={bug.id} className="work-item-card">
                                <h4>{bug.title}</h4>
                                <p><strong>State:</strong> {bug.state}</p>
                                <p><strong>ID:</strong> {bug.id}</p>
                                <p><strong>Severity:</strong> {bug.severity}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfessionalHubPage;
