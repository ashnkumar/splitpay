require('dotenv').config()

const express = require("express");
var bodyParser = require('body-parser')
const makeRequest = require('./utilities').makeRequest;

const PORT = process.env.PORT || 3001;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const CURRENCY = "EUR"
const COUNTRY = "BE"

const basePaymentObj = {
    "amount": null,
    "currency": "USD",
    "description": "Payment by card token",
    "payment_method": null,
    "metadata": {
    }
}

const makePayment = async (personId, paymentAmount, fullPrice, itemId, capture) => {
  let paymentObj = { ...basePaymentObj }
  paymentObj.amount = paymentAmount
  paymentObj.metadata.itemId = itemId
  paymentObj.metadata.fullPrice = fullPrice
  paymentObj.payment_method = personPaymentMethodMap[personId]
  paymentObj.capture = capture

  try {
      const body = {
        ...paymentObj
      };
      const result = await makeRequest('POST', '/v1/payments', body);
      return result
  } catch (error) {
      return error
  }

}

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

const getAllPayments = async () => {
  const result = await makeRequest('GET', '/v1/payments');
  return result.body.data
}

const findRelevantPayments = (allPayments, splitPayId) => {
  var newArr = []
  allPayments.forEach((payment) => {
    if (payment.metadata.splitPayId === splitPayId) {
      if (payment.status !== 'CLO' && (!payment.group_payment)) {
        newArr.push(payment)
      }
    }
  })
  return newArr
}

const calculateAmountPaid = (payments) => {
  var totalAuthed = 0
  payments.forEach((payment) => {
    totalAuthed += payment.original_amount
  })
  return totalAuthed
}

const buildPaymentsArr = (relevantPayments) => {
  var paymentsArr = []
  relevantPayments.forEach((paymentObj) => {
    paymentsArr.push({
      amount: paymentObj.original_amount,
      currency: paymentObj.currency_code,
      payment_method: paymentObj.payment_method,
      capture: true,
      metadata: paymentObj.metadata
    })
  })
  return paymentsArr
}

const processGroupPayment = async (relevantPayments, itemId) => {
  const paymentsArr = buildPaymentsArr(relevantPayments)
  try {
    const body = {
      payments: paymentsArr,
      metadata: { itemId: itemId }
    };
    const result = await makeRequest('POST', '/v1/payments/group_payments', body);
    return result
  } catch (error) {
      return error
  } 
}

app.get("/get-all-details", async (req, res) => {
  const splitPayId = req.query.splitPayId
  const allPayments = await getAllPayments()
  const relevantPayments = await findRelevantPayments(allPayments, splitPayId)
  const amountPaid = calculateAmountPaid(relevantPayments)
  var numSplits = null
  var fullPrice = null
  if (relevantPayments.length >= 1) {
    numSplits = relevantPayments[0].metadata.numSplits
    fullPrice = relevantPayments[0].metadata.fullPrice
  } else {
    numSplits = 2
    fullPrice = 1200
  }

  const amount = Math.floor(fullPrice / numSplits)
  const metadata = {
    fullPrice: fullPrice,
    numSplits: numSplits,
    splitPayId: splitPayId
  }

  const bodyForCheckout = {
    country: COUNTRY,
    currency: CURRENCY,
    payment_method_type_categories: ["card"],
    amount: amount,
    capture: false,
    metadata: metadata
  }

  const result = await makeRequest('POST', '/v1/checkout', bodyForCheckout);
  
  return res.json({
    numSplits: numSplits,
    fullPrice: fullPrice,
    totalAuthed: amountPaid,
    checkoutPageId: result.body.data.id
  })

})

app.get("/get-payment-auths", async (req, res) => {
  
  const splitPayId = req.query.splitPayId
  const allPayments = await getAllPayments()
  const relevantPayments = await findRelevantPayments(allPayments, splitPayId)
  const amountPaid = calculateAmountPaid(relevantPayments)
  var numSplits = null

  if (relevantPayments.length >= 1) {
    numSplits = relevantPayments[0].metadata.numSplits
  } else {
    numSplits = 2
  }
  return res.json({amountAuthed: amountPaid, numSplits: numSplits})
})

app.post("/create_checkout_page", async (req, res) => {
  const amount = req.body.amountToPay
  const metadata = req.body.metadata

  const bodyForCheckout = {
    country: COUNTRY,
    currency: CURRENCY,
    payment_method_type_categories: ["card"],
    amount: amount,
    capture: false,
    metadata: metadata
  }

  const result = await makeRequest('POST', '/v1/checkout', bodyForCheckout);
  return res.json({checkoutID: result.body.data.id})

})

app.post("/made-payment", async (req, res) => {
  const fullPrice = parseInt(req.body.data.metadata.fullPrice)
  const splitPayId = req.body.data.metadata.splitPayId
  const allPayments = await getAllPayments()
  const relevantPayments = await findRelevantPayments(allPayments, splitPayId)
  const fullAmountPaid = calculateAmountPaid(relevantPayments)
  if (fullAmountPaid >= fullPrice) {
    const groupPayment = await processGroupPayment(relevantPayments, splitPayId)
    console.log("Made group payment with ID: ", groupPayment.body.data.id)
  }  
  return res.sendStatus(200)
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});