// src/components/Game.js

import React, { useState, useEffect } from "react";
import { generatePrimes } from "../utils/primeUtils";
import ProgressBar from "./ProgressBar"; // Import the ProgressBar component
import "./Game.css";

const INITIAL_L = 120;
const INITIAL_X = 2;
const INITIAL_Y = 2;
const INITIAL_T = 8;
const JOKER_RATIO = 3;
const INITIAL_JOKERS = {
    skip: 0,
    freeze: 0,
    simplify: 0,
    remainder: 0,
};

function Game({ addHighScore }) {
    const [L, setL] = useState(INITIAL_L);
    const [X, setX] = useState(INITIAL_X);
    const [Y, setY] = useState(INITIAL_Y);
    const [T, setT] = useState(INITIAL_T);
    const [G, setG] = useState(null);
    const [choices, setChoices] = useState([]);
    const [selectedPrimes, setSelectedPrimes] = useState([]);
    const [timeLeft, setTimeLeft] = useState(T);
    const [roundsPassed, setRoundsPassed] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [newRound, setNewRound] = useState(false);
    const [lastCorrectG, setLastCorrectG] = useState(null);
    const [lastCorrectFactors, setLastCorrectFactors] = useState([]);
    const [previousPrimes, setPreviousPrimes] = useState([]);
    const [jokers, setJokers] = useState(INITIAL_JOKERS);
    const [usedFreezes, setUsedFreezes] = useState(0);
    const [usedSimplifies, setUsedSimplifies] = useState(0);
    const [highestPrime, setHighestPrime] = useState(0);

    useEffect(() => {
        startNewRound();
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, []);

    useEffect(() => {
        console.log("in new round effect");
        if (newRound === true) {
            startNewRound();
        }
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [newRound]);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            console.log("timeout");
            if (!gameOver) {
                endGame();
            }
        }
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [timeLeft]);

    function startNewRound() {
        console.log(X, Y, T, L);
        setUsedFreezes(0);
        setUsedSimplifies(0);
        setNewRound(false);
        const floor = Math.floor(L / 2 ** (X - 1));
        const primes = generatePrimes(floor > 100 ? 100 : floor); // Use updated L and X
        let chosenPrimes = [];
        let G = 1;

        // Loop until a prime is found that has not been used in a previous round
        while (true) {
            // Continue adding primes until their product does not exceed L
            while (chosenPrimes.length < X) {
                console.log(chosenPrimes);
                const prime = primes[Math.floor(Math.random() * primes.length)];
                if (G * prime > L / 2 ** (X - chosenPrimes.length - 1)) {
                    G = 1;
                    chosenPrimes = [];
                    continue;
                }
                chosenPrimes.push(prime);
                G *= prime;
            }

            if (!previousPrimes.includes(G)) {
                // eslint-disable-next-line no-loop-func
                setPreviousPrimes((primes) => [...primes, G]);
                break;
            }
            G = 1;
            chosenPrimes = [];
        }

        setG(G);
        setLastCorrectG(G);
        setLastCorrectFactors(chosenPrimes);

        const wrongChoices = [];
        console.log(chosenPrimes);
        console.log(primes);
        console.log(G);
        console.log(X);
        console.log(G / 2 ** X);
        while (wrongChoices.length < Y) {
            const prime = primes[Math.floor(Math.random() * primes.length)];
            //if (!chosenPrimes.includes(prime) || wrongChoices.filter(x => x === prime).length < 2) {
            if (prime <= (1.5 * G) / 2 ** (X - 1)) {
                wrongChoices.push(prime);
            }
        }

        setChoices(
            [...chosenPrimes, ...wrongChoices].sort(() => Math.random() - 0.5),
        );
        setSelectedPrimes([]);
        setTimeLeft(T); // Ensure the time left is reset to T
    }

    function resetGame() {
        setL(INITIAL_L); // Reset L to the initial value
        setX(INITIAL_X); // Reset X to the initial value
        setY(INITIAL_Y); // Reset Y to the initial value
        setT(INITIAL_T); // Reset T to the initial value
        setJokers(INITIAL_JOKERS);

        setRoundsPassed(0); // Optionally reset rounds passed
        setGameOver(false); // Ensure gameOver is reset
        setUsedFreezes(0);
        setUsedSimplifies(0);

        setSelectedPrimes([]);
        setPreviousPrimes([]);
        setHighestPrime(0);

        //startNewRound(); // Start the new game round
        setNewRound(true);
    }

    function handlePrimeSelection(prime) {
        if (selectedPrimes.includes(prime)) {
            setSelectedPrimes(selectedPrimes.filter((p) => p !== prime));
        } else if (selectedPrimes.length < X - usedSimplifies) {
            setSelectedPrimes([...selectedPrimes, prime]);
        }
    }

    function handleSubmit() {
        console.log(selectedPrimes);
        const product = selectedPrimes.reduce(
            (acc, prime) => acc * parseInt(prime.split("_")[0]),
            1,
        );
        if (product === G) {
            setRoundsPassed(roundsPassed + 1);
            if (G > highestPrime) {
                setHighestPrime(G);
            }
            advanceDifficulty(); // Adjust difficulty settings
            //startNewRound();
        } else {
            console.log("wrong choice");
            endGame();
        }
    }

    function advanceDifficulty() {
        // Determine whether to increase L or Y
        console.log(roundsPassed);
        if ((roundsPassed + 1) % 5 === 0 && roundsPassed !== 0) {
            // Increase X every 10 rounds and reset Y
            setY(X + 1);
            setX((prevX) => prevX + 1);
            setL((prevL) => prevL * 4);
            setT((prevT) => prevT + 3);
        } else {
            // Choose whether to increase L or Y
            if (Math.random() < 0.5) {
                // Increase L by 10%
                setL((prevL) => Math.floor(prevL * 1.1));
            } else {
                // Increase Y by 1, but ensure it remains a reasonable value
                setY((prevY) => prevY + 1);
            }
        }

        if ((roundsPassed + 1) % JOKER_RATIO === 0 && roundsPassed !== 0) {
            const rand = Math.random();
            if (rand < 0.33) {
                setJokers((j) => ({ ...j, skip: j["skip"] + 1 }));
            } else if (rand < 0.66) {
                setJokers((j) => ({ ...j, freeze: j["freeze"] + 1 }));
            } else {
                setJokers((j) => ({ ...j, simplify: j["simplify"] + 1 }));
            }
        }

        setNewRound(true);
    }

    function endGame() {
        setGameOver(true);
        addHighScore({ roundsPassed, L, X, Y, T, highestPrime });
    }

    function formatCorrectAnswer() {
        if (lastCorrectFactors.length === 0) return "";
        return `${lastCorrectG} = ${lastCorrectFactors.join(" * ")}`;
    }

    function handleSkip() {
        setJokers((j) => ({ ...j, skip: j["skip"] - 1 }));

        setSelectedPrimes(
            lastCorrectFactors.map((f) => f + "_" + choices.indexOf(f)),
        );
    }

    function handleFreeze() {
        setJokers((j) => ({ ...j, freeze: j["freeze"] - 1 }));

        setTimeLeft((t) => t + 10);
        setUsedFreezes((u) => u + 1);
    }

    function handleSimplify() {
        setJokers((j) => ({ ...j, simplify: j["simplify"] - 1 }));

        const maxFactor = [...lastCorrectFactors].sort(
            (x, y) => parseInt(y) - parseInt(x),
        )[0];
        setG((g) => g / maxFactor);
        setLastCorrectG((g) => g / maxFactor);
        setLastCorrectFactors((f) =>
            f.filter((e, i) => i !== f.indexOf(maxFactor)),
        );
        const choiceIndex = choices.indexOf(maxFactor);
        setChoices((c) => c.filter((e, i) => i !== choiceIndex));
        setSelectedPrimes((s) =>
            s
                .filter((e) => e !== maxFactor + "_" + choiceIndex)
                .slice(0, X - usedSimplifies - 1),
        );
        setUsedSimplifies((u) => u + 1);
    }

    function handleRemainder() {
        setJokers((j) => ({ ...j, remainder: j["remainder"] - 1 }));
    }

    function showJokers() {
        return (
            <div>
                {jokers["skip"] > 0 && (
                    <button key="skip" onClick={handleSkip}>
                        Solve x {jokers["skip"]}
                    </button>
                )}
                {jokers["freeze"] > 0 && (
                    <button key="freeze" onClick={handleFreeze}>
                        + 10s x {jokers["freeze"]}
                    </button>
                )}
                {jokers["simplify"] > 0 && (
                    <button
                        key="simplify"
                        onClick={handleSimplify}
                        disabled={X - usedSimplifies === 1}
                    >
                        Simplify x {jokers["simplify"]}
                    </button>
                )}
                {jokers["remainder"] > 0 && (
                    <button key="remainder" onClick={handleRemainder}>
                        Remainder x {jokers["remainder"]}
                    </button>
                )}
            </div>
        );
    }

    const isSubmitDisabled = selectedPrimes.length !== X - usedSimplifies;
    const newStage = roundsPassed % 5 === 0;

    return (
        <div className="game-container">
            <h1>The Prime Directive</h1>
            {!gameOver ? (
                <div>
                    <div className="centered">
                        <div className="target-number">Target: {G}</div>
                    </div>
                    <div className="instructions">
                        Round {roundsPassed + 1}: Select{" "}
                        <span
                            className={newStage ? "round-bold" : "round-normal"}
                        >
                            {X - usedSimplifies}
                        </span>{" "}
                        prime factor{X - usedSimplifies > 1 ? "s" : ""} to
                        multiply and get the target number.
                    </div>
                    <p>Time Left: {timeLeft}s</p>
                    <div className="centered">
                        <ProgressBar
                            timeLeft={timeLeft}
                            maxTime={T + usedFreezes * 10}
                        />
                    </div>
                    <div className="choices">
                        {choices.map((prime, i) => (
                            <button
                                key={`${prime}_${i}`}
                                onClick={() =>
                                    handlePrimeSelection(`${prime}_${i}`)
                                }
                                className={
                                    selectedPrimes.includes(`${prime}_${i}`)
                                        ? "selected"
                                        : ""
                                }
                            >
                                {prime}
                            </button>
                        ))}
                    </div>
                    <div>
                        Your selected product:{" "}
                        {selectedPrimes
                            .map((p) => p.split("_")[0])
                            .concat(Array(X).fill("?"))
                            .slice(0, X - usedSimplifies)
                            .join(" x ")}{" "}
                        ={" "}
                        {selectedPrimes.reduce(
                            (acc, prime) => acc * parseInt(prime.split("_")[0]),
                            1,
                        )}
                    </div>
                    <button onClick={handleSubmit} disabled={isSubmitDisabled}>
                        Submit
                    </button>
                    {showJokers()}
                </div>
            ) : (
                <div>
                    <h2>Game Over!</h2>
                    <p>Rounds Passed: {roundsPassed}</p>
                    {/*<p>
                        Final Values: L = {L.toFixed(2)}, X = {X}, Y = {Y}, T ={" "}
                        {T.toFixed(2)}
                    </p>*/}
                    <p>
                        The correct answer for the last round would have been{" "}
                        {formatCorrectAnswer()}
                    </p>
                    <button onClick={resetGame}>Start New Game</button>
                </div>
            )}
        </div>
    );
}

export default Game;
