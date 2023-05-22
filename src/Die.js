
export default function Die(props) {
    return (
        <div
            className={`die-face  ${props.isHeld && 'held'} ${props.started ? 'started' : ''}`}
            onClick={props.holdDice}
        >
            <h2 className="die-num">{props.value}</h2>
        </div>
    )
}