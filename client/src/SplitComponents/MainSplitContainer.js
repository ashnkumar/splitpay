import React, { useReducer, useState, useEffect } from 'react'
import { makeid } from '../utils'
import { getCheckoutPageID, retrievePayments, retrieveExistingDetails } from '../api'
import SplitHeader from './SplitHeader'
import LoadingSplit from './LoadingSplit'
import AskNumSplit from './AskNumSplit'
import SendSplits from'./SendSplits'
import CheckoutSplit from'./CheckoutSplit'
import emailjs from '@emailjs/browser';
import { animated, useSpring } from "react-spring";
import env from "react-dotenv";

const SERVICE_ID = env.SERVICE_ID
const TEMPLATE_ID = env.TEMPLATE_ID
const PUBLIC_KEY = env.PUBLIC_KEY
const BASE_URL = env.BASE_URL

const initialState = {
  splitPayId: null,
  fullPrice: 1200,
  totalAuthed: 0,
  numSplits: 2,
  checkoutPageId: null,
  checkoutInstance: null,
  flowScreen: "splitButtonActive"
};

function reducer(state, action) {
  switch (action.type) {
    case 'askForSplit':
      return { 
          ...state, 
          flowScreen: "askSplitScreen"
        };

    case 'startFirstCheckout':
      return { 
          ...state, 
          splitPayId: action.payload.splitPayId,
          numSplits: action.payload.numSplits,
          fullPrice: action.payload.fullPrice,
          checkoutPageId: action.payload.checkoutPageId,
          totalAuthed: action.payload.totalAuthed || 0,
          checkoutInstance: action.payload.checkoutInstance,
          flowScreen: "initialCheckoutScreen"
        };

    case 'firstCheckoutComplete':
      return {
        ...state,
        totalAuthed: action.payload.totalAuthed,
        numSplits: action.payload.numSplits,
        flowScreen: "successfulPaymentScreen"
      }
    case 'finishedPayment':
      return {
        ...state,
        flowScreen: "successfulPaymentScreen"
      }   
    case 'askFriendsForSplit':
      return {
        ...state,
        flowScreen: "askFriendsForSplitScreen"
      }   
    case 'sendingEmails':
      return {
        ...state,
        flowScreen: "sendingEmailsScreen"
      }
    case 'emailsSent':
      return {
        ...state,
        flowScreen: "emailsSentScreen"
      }      
    default:
      throw new Error();
  }
}

export default function MainSplitContainer({fullPrice}) {
  
  const [state, dispatch] = useReducer(reducer, initialState)
  const [initialMount, setInitialMount] = useState(true)
  const [splitPayId, setSplitPayId] = useState(null)

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search)
    if (queryParams.get('splitPayId')) {
      setSplitPayId(queryParams.get('splitPayId'))
    }
  }, [])

  const fullMenuAnimation = useSpring({
    transform: initialMount ? `translateX(-100%)` : `translateX(0%)`,
    opacity: initialMount ? 0 : 1
  });

  useEffect(() => {
    if (splitPayId) {
      startExistingFlow(splitPayId)
    }
  }, [splitPayId])

  const startExistingFlow = async (splitPayId) => {
    const { numSplits, fullPrice, totalAuthed, checkoutPageId } 
          = await retrieveExistingDetails(splitPayId)
  
    dispatch({ 
      type: 'startFirstCheckout',
      payload: {
        fullPrice: fullPrice,
        totalAuthed: totalAuthed,
        numSplits: numSplits,
        splitPayId: splitPayId,
        checkoutPageId: checkoutPageId
      }
    })
  }

  const onSelectedSplit = async (numSplits) => {
    const _splitPayId = makeid(8)
    const amountToPay = Math.floor(state.fullPrice / numSplits)
    const metadata = {
      splitPayId: _splitPayId,
      fullPrice: state.fullPrice,
      numSplits: parseInt(numSplits)
    }
    const _checkoutId = await getCheckoutPageID(amountToPay, metadata)

    dispatch({ 
        type: 'startFirstCheckout',
        payload: {
          fullPrice: fullPrice,
          numSplits: numSplits,
          splitPayId: _splitPayId,
          checkoutPageId: _checkoutId
        }
      })
  }  

  const onPaymentSuccess = async () => {
    const { amountAuthed, numSplits } = await retrievePayments(state.splitPayId)
    dispatch({
      type: 'firstCheckoutComplete',
      payload: {
        totalAuthed: amountAuthed,
        numSplits: numSplits
      }
    })

  }  

  const onSendSplits = async (emails) => {
    const splitPayLink = `<a href="` + BASE_URL + "/?splitPayId=" + state.splitPayId + '"> Click here to authorize your split of the purchase!</a>'
    const templateParams = {
      splitpay_link: splitPayLink
    };

    // Took this out for production, adding link to the UI for testing instead.

    // emailjs.send(SERVICE_ID,TEMPLATE_ID, templateParams, PUBLIC_KEY)
    //   .then((response) => {
    //     console.log('SUCCESS!', response.status, response.text);
    //   }, (err) => {
    //     console.log('FAILED...', err);
    //   });
    
    dispatch({
      type: 'sendingEmails'
    })
    setTimeout(() => {
      
      dispatch({
        type: 'emailsSent'
      })
    }, 3000)
  }

  const goToAskSplits = () => {
    setTimeout(() => {
      dispatch({ 
        type: 'askFriendsForSplit'
      })
    }, 1000)
  }
  if (state.flowScreen === "splitButtonActive") {
    setTimeout(() => {
      dispatch({ type: 'askForSplit' })
    }, 100)
    return (
      null
    ) 
   }

  else if (state.flowScreen === "askSplitScreen") {
    setTimeout(() => {
      setInitialMount(false)
    }, 100)
    return (
      <animated.div className="maindiv" style={fullMenuAnimation}>
        <SplitHeader fullPrice={state.fullPrice} 
                    totalAuthed={state.totalAuthed}/>
        <AskNumSplit 
          fullPrice={state.fullPrice}
          onSelectedSplit={onSelectedSplit} />
      </animated.div>
    )
  }  
  
  else if (state.flowScreen === "askFriendsForSplitScreen") {
    return (
      <div className="maindiv">
        <SplitHeader fullPrice={state.fullPrice} 
                    totalAuthed={state.totalAuthed}/>
        <SendSplits 
          fullPrice={state.fullPrice}
          onSendSplits={onSendSplits} />
      </div>
    )
  }  
  
  else if (state.flowScreen === "initialCheckoutScreen") {
    return (
      <div className="maindiv">
        <SplitHeader fullPrice={state.fullPrice} 
                    totalAuthed={state.totalAuthed}/>
        <CheckoutSplit 
          checkoutId={state.checkoutPageId} 
          onPaymentSuccess={onPaymentSuccess}
          />
      </div>
    )
  }  

  else if (state.flowScreen === "successfulPaymentScreen") {
    return (
      <div className="maindiv">
        <SplitHeader fullPrice={state.fullPrice} 
                    totalAuthed={state.totalAuthed}/>
        <LoadingSplit 
          loadingText={"Success!"}
          mode={"paymentsuccess"}
          onFinish={splitPayId ? null: goToAskSplits }
          />
      </div>
    )    
  }

  else if (state.flowScreen === "sendingEmailsScreen") {
    return (
      <div className="maindiv">
        <SplitHeader fullPrice={state.fullPrice} 
                    totalAuthed={state.totalAuthed}/>
        <LoadingSplit 
          loadingText={"Sending emails ..."}
          mode={"loading"}
          />
      </div>
    )    
  } 

  else if (state.flowScreen === "emailsSentScreen") {
    return (
      <div className="maindiv">
        <SplitHeader fullPrice={state.fullPrice} 
                    totalAuthed={state.totalAuthed}/>
        <LoadingSplit 
          loadingText={"Done!"}
          mode={"paymentsuccess"}
          />
      </div>
    )    
  }   

  return (
    <p>No Screen found!</p>
  )
}