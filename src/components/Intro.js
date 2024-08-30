// src/components/Game.js

import React from "react";
import "./Game.css";

function Intro({ setStart }) {
    return (
        <div className="game-container">
            <h1>The Prime Directive</h1>
            <div>
                <div className="instructions">
                    In this game, your goal is to divide numbers into their{" "}
                    <b>prime factors</b> under time pressure, with increasing
                    difficulty from round to round.
                </div>
                <br />
                <div className="instructions">
                    Example: The number <b>66</b> can be divided into{" "}
                    <b>2 x 3 x 11</b>
                </div>
                <br />
                <div className="instructions">
                    At the beginning you will only have to find 2 factors, but
                    but every fifth round the number of prime factors goes up.
                </div>
                <br />
                <div className="instructions">
                    Every third round, you will receive a random joker to help
                    you out. The <b>+10s</b> joker will give you 10 extra
                    seconds to think in your current round. The <b>Simplify</b>{" "}
                    joker will divide the current prime by its largest factor.
                    And the <b>Solve</b> joker will even tell you the full
                    solution to the round.
                </div>
                <br />
                <div className="instructions">
                    Do you have what it takes to fullfill...
                </div>
                <br />
                <div className="primedirective">THE PRIME DIRECTIVE</div>
                <br />
                <button onClick={() => setStart(true)}>Start</button>
            </div>
        </div>
    );
}

export default Intro;
