import React, { useEffect } from 'react'
import checkImg from './images/cherk.png'
import ClipLoader from "react-spinners/ClipLoader";

const override = {
  display: "block",
  margin: "0 auto",
};

export default function LoadingSplit({loadingText, onFinish, mode="loading"}) {

  useEffect(() => {
    setTimeout(() => {
      onFinish()
    }, 3000)
  }, [])

  if (mode === "paymentsuccess") {
    return (
      <div className="maincontainersection">
        <div className="loadingdiv"><img src={checkImg} loading="lazy" alt="" /></div>
        <div className="centertextdiv">
          <div className="centertexttest">{loadingText}</div>
        </div>
      </div>
    )
  }

  else {
    return (
      <div className="maincontainersection">
        <div className="loadingdiv">
        <ClipLoader 
          color={"#6b5ecd"} 
          loading={true} 
          css={override} size={80}
          />
        </div>
      </div>
    )    
  }

}