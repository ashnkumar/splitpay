export const getCheckoutPageID = async (amountToPay, metadata) => {
  const result = 
    await fetch('/create_checkout_page', {
                method: 'POST',
                headers: {
                  'Accept': 'application/json, text/plain, */*',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                  {
                    amountToPay: parseInt(amountToPay),
                    metadata: metadata
                  }
                )
              })
  const resultJSON = await result.json()
  const checkoutID = resultJSON.checkoutID
  return checkoutID
}

export const retrievePayments = async (splitPayId) => {
  const paymentRes = await fetch(`/get-payment-auths?splitPayId=${splitPayId}`)
  return paymentRes.json()
}

export const retrieveExistingDetails = async (splitPayId) => {
  const paymentRes = await fetch(`/get-all-details?splitPayId=${splitPayId}`)
  return paymentRes.json()
}