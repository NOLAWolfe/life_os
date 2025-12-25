import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-page">
            <header className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Life.io <span className="version-badge">v2.2</span>
                    </h1>
                    <p className="hero-subtitle">
                        The Operating System for High-Performance Living.
                    </p>
                    <div className="cta-group">
                        <button className="btn-primary" onClick={() => navigate('/app')}>
                            Launch Dashboard
                        </button>
                        <button
                            className="btn-secondary"
                            onClick={() =>
                                window.open('https://github.com/NOLAWolfe/life_os', '_blank')
                            }
                        >
                            View Source
                        </button>
                    </div>
                </div>
            </header>

            <section className="features-grid">
                <div className="feature-card">
                    <h3>🏦 Wealth Creation</h3>
                    <p>Automated surplus tracking and drift detection.</p>
                </div>
                <div className="feature-card">
                    <h3>🚀 Professional Hub</h3>
                    <p>Agile board and AI-driven career planning.</p>
                </div>
                <div className="feature-card">
                    <h3>🧠 Knowledge Graph</h3>
                    <p>Obsidian-integrated memory and decision tools.</p>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
