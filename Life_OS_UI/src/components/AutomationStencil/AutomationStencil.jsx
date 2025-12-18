import React from 'react';
import './AutomationStencil.css';

const AutomationStencil = ({ stencil }) => {
    return (
        <div className="automation-stencil-container">
            <h5>Generated Automation Stencil</h5>
            <pre className="stencil-content">{stencil}</pre>
        </div>
    );
};

export default AutomationStencil;
