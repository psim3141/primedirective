// src/components/HighScores.js

import React from "react";

function HighScores({ highScores }) {
    return (
        <div>
            <h2>High Scores</h2>
            <ul>
                {highScores
                    .sort((a, b) => b.roundsPassed - a.roundsPassed)
                    .slice(0, 10)
                    .map((score, index) => (
                        <li key={index} className={"nodot"}>
                            Rounds: {score.roundsPassed} Factors: {score.X} Max:{" "}
                            {score.highestPrime}
                        </li>
                    ))}
            </ul>
        </div>
    );
}

export default HighScores;
