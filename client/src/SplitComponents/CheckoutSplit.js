import React from 'react'
import { useState, useEffect, useRef } from 'react'
import BarLoader from "react-spinners/BarLoader";
import { animated, useSpring } from "react-spring";

const customCheckoutStyles = {
  dropdown: {
    title: {
      color: "white"
    },
  },
  cardFields: {
    title: {
      color: "white"
    }
  },
  pciMessage: {
    color: "white"
  },
  orderDetails: {
    title: {
      color: "white"
    },
    totalLabel: {
      color: "white"
    },
    totalValue: {
      color: "white"
    }
  },
  cart: {
    description: {
      color: "white",
      fontSize: "0.8rem"
    },
    amount: {
      color: "white",
      fontSize: "0.8rem"
    },
    "quantityTitle": {
      "color": "white"
    },
    "quantityValue": {
      "color": "white"
    },    
    image: {
      height: "20px"
    }
  },
  submit: {
      base: {
        backgroundColor: "#6b5ecd",
        width: 30,
        height: 30,
        padding: 0
      }
  }  
}

function LoadingSpinner({}) {
  return (
    <BarLoader 
      color={"#6b5ecd"} 
      loading={true} 
      width={200}
      height={10}
       />
  )
}

function CheckoutInner({isLoading}) {
  return (
    <div className="maindiv expanded">
        <div className="maincontainersection expanded">
          { isLoading  && <LoadingSpinner /> }
          <div style={{display: isLoading ? 'none' : undefined}} id="rapyd-checkout" />
        </div>
    </div>
  )
}

export default function CheckoutSplit({checkoutId, onPaymentSuccess}) {
  
  const renderCount = useRef(0)
  const [isMounting, setIsMounting] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (renderCount.current === 0) {
      let checkout = new window.RapydCheckoutToolkit({
        id: checkoutId,
        pay_button_text: "Authorize Split",
        style: customCheckoutStyles
      });
      checkout.displayCheckout()
      renderCount.current = 1
      setTimeout(() => {
        setIsLoading(false)
      }, 2000)
    }
  }, [])

  useEffect(() => {
    setIsMounting(false)
    return function cleanup() {
      setIsMounting(true)
    }
  }, [])

  useEffect(() => {
    const handler = (event) => {
      onPaymentSuccess()
    }
    window.addEventListener('onCheckoutPaymentSuccess', (event) => handler(event))

    return function cleanup() {
      window.removeEventListener('onCheckoutPaymentSuccess', handler)
    }
  }, [])    
  
  const checkoutAnimation = useSpring({
    transform: isMounting ? `translateY(-100%)` : `translateY(0)`,
    opacity: isMounting ? 0 : 1
  });

  return (
    <animated.div className="maindiv expanded" style={checkoutAnimation}>
        <div className="maincontainersection expanded">
          { isLoading  && <LoadingSpinner /> }
          <div style={{display: isLoading ? 'none' : undefined}} id="rapyd-checkout" />
        </div>
    </animated.div>
    
  )
}