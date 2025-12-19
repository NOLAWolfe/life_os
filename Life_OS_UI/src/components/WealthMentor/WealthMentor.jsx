import React, { useState, useEffect } from 'react';
import './WealthMentor.css';

const WealthMentor = () => {
    const strategies = [
        {
            quote: "Success is your duty, obligation, and responsibility.",
            author: "Grant Cardone",
            action: "Identify one task today that scales your long-term goal, not just your daily to-do list."
        },
        {
            quote: "Cash is trash. Cash flow is king.",
            author: "Grant Cardone",
            action: "Look at your stagnant savings. How can you move that capital into an income-producing asset?"
        },
        {
            quote: "If you don't have a problem, you don't have a business.",
            author: "Grant Cardone",
            action: "Find a problem your clients or company has and solve it to increase your value."
        },
        {
            quote: "Go small, stay small.",
            author: "Grant Cardone",
            action: "10X your targets. If you wanted $100k, aim for $1M. The actions required are different."
        },
        {
            quote: "Show up. Be seen. Be known.",
            author: "Grant Cardone",
            action: "Post one professional update or reach out to one new connection today."
        }
    ];

    const [currentStrategy, setCurrentStrategy] = useState(strategies[0]);

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * strategies.length);
        setCurrentStrategy(strategies[randomIndex]);
    }, []);

    return (
        <div className="wealth-mentor-widget widget-card">
            <h2 className="widget-title">The Wealth Mentor</h2>
            <div className="quote-container">
                <p className="quote">"{currentStrategy.quote}"</p>
                <p className="author">— {currentStrategy.author}</p>
            </div>
            <div className="action-step">
                <span className="label">Today's 10X Action:</span>
                <p className="action">{currentStrategy.action}</p>
            </div>
        </div>
    );
};

export default WealthMentor;
