import React from 'react';
import './AiAnalysis.css';

const AiAnalysis = ({ summary, onGenerateScenarios }) => {
    return (
        <div className="ai-analysis-container">
            <h4>AI-Generated Testing Requirements</h4>
            <pre className="summary-content">{summary}</pre>
            <button onClick={onGenerateScenarios} className="generate-scenarios-btn">
                Generate Scenarios
            </button>
        </div>
    );
};

export default AiAnalysis;
