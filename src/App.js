import React from "react";
import Die from "./Die"
import {nanoid} from "nanoid";
import Confetti from "react-confetti"

export default function App() {
  const [dice, setDice] = React.useState(allNewDice());
  const [tenzies, setTenzies] = React.useState(false);
  const [rolls, setRolls] = React.useState(0);
  const [seconds, setSeconds] = React.useState(0);
  const [started, setStarted] = React.useState(false);

  // only start the timer after the user clicks the button
  React.useEffect(() => {
    let interval
    if (started && !tenzies) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
    if (tenzies) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [started, tenzies]);
  

  React.useEffect(() => {
    const allHeld = dice.every(die => die.isHeld);
    const firstValue = dice[0].value;
    const sameValues = dice.every(die => die.value === firstValue)
    if (allHeld && sameValues) {
      setTenzies(true);
    }
  }, [dice])

  function holdDice(dieId) {
    setDice(prevDice => {
      return prevDice.map(die => {
        return die.id === dieId ? {...die, isHeld: !die.isHeld} : die
      })
    })
  }

  function generateNewDie() {
    return {
      value: Math.floor(Math.random() * 6) + 1,
      isHeld: false,
      id: nanoid()
    }
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
  const diceElements = dice.map(die => (
    <Die
      started={started}
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />));
  return (
    <main>
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
    </main>
  )
}