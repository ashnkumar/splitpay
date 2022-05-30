import React from 'react'

/*
  Note: Took email sending out for public repository,
  requires API with email provider.
*/

export default function SendSplits({onSendSplits}) {

  const [emails, setEmails] = React.useState([])

  return (
    <div className="maincontainersection">
      <div className="howmanydiv split">
        <div className="maintext title">Send split requests</div>
      </div>
      <div className="splitrequestsdiv">
        <input name='email1' className="splitinput"></input>
        <input name='email2' className="splitinput"></input>
        <input name='email3' className="splitinput"></input>
      </div>
      <div onClick={() => onSendSplits(emails)} className="pbutton">
        <div className="buttontext">Send</div>
      </div>
    </div>
  )
}