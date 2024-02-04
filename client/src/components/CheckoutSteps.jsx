import React from 'react'

const CheckoutSteps = ({step1,step2,step3,step4}) => {
  return (
    <div className='flex space-x-5 justify-center pt-3 text-base font-semibold'>
        {
          step1 ? <p>Sign In </p> : <p className='text-gray-400'>Sign In</p>
        }
        {
          step2 ? <p>Shipping</p> : <p className='text-gray-400'>Shipping</p>
        }
        {
          step3 ? <p>Payment</p> : <p className='text-gray-400'>Payment</p>
        }
        {
          step3 ? <p>Place Order</p> : <p className='text-gray-400'>Place Order</p>
        }
    </div>
  )
}

export default CheckoutSteps