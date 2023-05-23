import React from "react";
import Die from "./Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

export default function App() {
  const [dice, setDice] = React.useState(allNewDice());
  const [tenzies, setTenzies] = React.useState(false);
  const [rolls, setRolls] = React.useState(0);
  const [seconds, setSeconds] = React.useState(0);
  const [started, setStarted] = React.useState(false);
  const [minRolls, setMinRolls] = React.useState(() => {
    const storedMinRolls = localStorage.getItem("minRolls");
    return storedMinRolls ? parseInt(storedMinRolls, 10) : Number.MAX_SAFE_INTEGER;
  });
  const [minSeconds, setMinSeconds] = React.useState(() => {
    const storedMinSeconds = localStorage.getItem("minSeconds");
    return storedMinSeconds ? parseInt(storedMinSeconds, 10) : Number.MAX_SAFE_INTEGER;
  });

  React.useEffect(() => {
    let interval;
    if (started && !tenzies) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
    if (tenzies) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [started, tenzies]);

  React.useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const sameValues = dice.every((die) => die.value === firstValue);
    if (allHeld && sameValues) {
      setTenzies(true);
      if (rolls < minRolls) {
        setMinRolls(rolls);
        localStorage.setItem("minRolls", rolls.toString());
      }
      if (seconds < minSeconds) {
        setMinSeconds(seconds);
        localStorage.setItem("minSeconds", seconds.toString());
      }
    }
  }, [dice, rolls, seconds, minRolls, minSeconds]);


  function holdDice(dieId) {
    setDice((prevDice) => {
      const index = prevDice.findIndex((die) => die.id === dieId);
      if (index !== -1) {
        const updatedDice = [...prevDice];
        updatedDice[index] = {
          ...updatedDice[index],
          isHeld: !updatedDice[index].isHeld,
        };
        return updatedDice;
      }
      return prevDice;
    });
  }

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }
  

  function allNewDice() {
    return Array.from(Array(10), () => (generateNewDie()));
  }

  function roll() {
    if (started) {
      setRolls(rolls + 1);
    }
    if (tenzies) {
      setTenzies(false);
      setDice(allNewDice());
      setRolls(0);
      setSeconds(0);
      setStarted(false)
    }
    if (!started) {
      setStarted(!started);
    }
    else setDice(prevDice => {
      return prevDice.map(die => {
        return !die.isHeld ? generateNewDie() : die
      })
    });
  }
  
  const diceElements = React.useMemo(() => {
    return dice.map((die) => (
      <Die
        started={started}
        key={die.id}
        value={die.value}
        isHeld={die.isHeld}
        holdDice={() => holdDice(die.id)}
      />
    ));
  }, [dice, started]);
  
  return (
    <main className="container">
      {tenzies && <Confetti />}
      <div className="title-box">
        <h3>Rolls Count: <span className="rolls">{rolls}</span></h3>
        <h1 className="title">Tenzies</h1>
        <h3>Time: <span className="seconds">{seconds < 10 ? `0${seconds}` : `${seconds}`}</span></h3>
      </div>
      <p className="instructions">Roll untill all dice are the same. Click each die to freeze at its current value between rolls.</p>
      <div className="dice-container">
        {diceElements}
      </div>
      <button
        className="roll-dice"
          onClick={roll}
        >
          {tenzies ? 'New Game' : started ? 'Roll' : 'Start Game'}
      </button>
      <div className="title-box stats">
        <h3>Minimum rolls: <span className="rolls">{minRolls !== Number.MAX_SAFE_INTEGER ? minRolls : '00'}</span></h3>
        <h3>Shortest time: <span className="seconds">{minSeconds !== Number.MAX_SAFE_INTEGER ? minSeconds : '00'}</span></h3>
      </div>
    </main>
  )
}