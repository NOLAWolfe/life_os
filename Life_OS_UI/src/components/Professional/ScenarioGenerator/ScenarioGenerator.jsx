import React from 'react';
import './ScenarioGenerator.css';

const ScenarioGenerator = ({ scenarios, onGenerateStencil }) => {
    return (
        <div className="scenario-generator-container">
            <h5>Generated Playwright Scenarios</h5>
            <pre className="scenarios-content">{scenarios}</pre>
            <button onClick={onGenerateStencil} className="generate-stencil-btn">
                Generate Stencil
            </button>
        </div>
    );
};

export default ScenarioGenerator;
