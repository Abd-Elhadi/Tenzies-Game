// import React from 'react'
// import useWindowSize from 'react-use/lib/useWindowSize'
// import Confetti from 'react-confetti'

export default function Confetti(){
  const width = window.innerWidth, height = window.innerHeight;
  return (
    <Confetti
      width={width}
      height={height}
    />
  )
}