import React from "react";
import Die from "./Die"
import {nanoid} from "nanoid";
import Confetti from "react-confetti"

export default function App() {
  const [dice, setDice] = React.useState(allNewDice());
  const [tenzies, setTenzies] = React.useState(false);

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
    if (tenzies) {
      setTenzies(false);
      setDice(allNewDice());
    }
    else setDice(prevDice => {
      return prevDice.map(die => {
        return !die.isHeld ? generateNewDie() : die
      })
    });
  }
  const diceElements = dice.map(die => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />));
  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">Roll untill all dice are the same. Click each die to freeze at its current value between rolls.</p>
      <div className="dice-container">
        {diceElements}
      </div>
      <button
        className="roll-dice"
          onClick={roll}
        >
          {tenzies ? 'New Game' : 'Roll'}
      </button>
    </main>
  )
}