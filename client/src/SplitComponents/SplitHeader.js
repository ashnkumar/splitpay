import React from 'react'
import splitLogo from './images/splitlogo.png'
import ProgressBar from '../ProgressBar/ProgressBar'

export default function SplitHeader({fullPrice, totalAuthed}) {
  const perc = (1.0 * totalAuthed) / fullPrice
  return (
    <div className="headersection">
      <div className="logodiv"><img src={splitLogo} loading="lazy" alt="" /></div>
      <div className="meterdiv">
          <ProgressBar className="meterdiv" width={350} percent={perc}/>
      </div>
      <div className="metertextdiv">
        <div className="metertext">${fullPrice - totalAuthed}<br />Left</div>
      </div>
    </div>
  )
}