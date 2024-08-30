import React from "react";
import "./Game.css"; // Import your CSS file

function ProgressBar({ timeLeft, maxTime }) {
    // Calculate the percentage of time left
    const percentage = 100 - (timeLeft / maxTime) * 100;

    return (
        <div className="progress-container">
            <div className="progress-background"></div>
            <div
                className="progress-bar"
                style={{ width: `${percentage}%` }}
            ></div>
        </div>
    );
}

export default ProgressBar;
