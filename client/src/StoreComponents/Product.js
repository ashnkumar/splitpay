import React from 'react'
import './Product.css'
import ProgressBar from '../ProgressBar/ProgressBar'

function Product({id,title, price, image, rating, openSplitPay }) {

  return (
    <div className='product'>
        <div className='product__info'>
            <p>{title}</p>
            <p className='product__price'>
                <small>$</small>
                <strong>{price}</strong>
            </p>
            <div className='product__rating'>
                {Array(rating)
                   .fill()
                   .map((_, i) => (
                    <p key={i}>⭐</p>
                   ))
                }

            </div>
        </div>

        <img src={image}
        alt='' />
        
      
        <button>Add to Basket</button>
        <button style={{backgroundColor: "#6B5ECD", color: "white"}} 
        onClick={() => openSplitPay()}
        className="splitpaybutton">Split with Rapyd</button>
        

    </div>
  )
}

export default Product