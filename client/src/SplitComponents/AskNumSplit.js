import React from 'react'
import { useReducer, useState, useEffect, useRef } from 'react'
import { Spring, Transition, animated, useSpring } from "react-spring";

export default function AskNumSplit({fullPrice, onSelectedSplit}) {
  
  const [numberOfSplits, setNumberOfSplits] = useState(2)

  return (
    <div className="maincontainersection">
      <div className="howmanydiv">
        <div className="maintext title">How many parties to split with?</div>
      </div>
      <input className="partiesinput" 
              type="number" 
              value={numberOfSplits} 
              onChange={e => setNumberOfSplits(e.target.value)} />
      
      <div className="howmucheachdiv">
        <div className="maintext">${Math.floor(fullPrice / numberOfSplits)} / each</div>
      </div>
      <div onClick={() => onSelectedSplit(numberOfSplits)} className="pbutton">
        <div className="buttontext">Next</div>
      </div>
    </div>
  )
}