// src/App.js

import React, { useState } from "react";
import Game from "./components/Game";
import Intro from "./components/Intro";
import HighScores from "./components/HighScores";
import "./App.css";

function App() {
    const [highScores, setHighScores] = useState([]);
    const [start, setStart] = useState(false);

    function addHighScore(score) {
        setHighScores([...highScores, score]);
    }

    if (start){
        return (
            <div className="App">
                <Game addHighScore={addHighScore} />
                <HighScores highScores={highScores} />
            </div>
        );
    } else {
        return (
            <div className="App">
                <Intro setStart={setStart} />
            </div>
        );
    }
}

export default App;
