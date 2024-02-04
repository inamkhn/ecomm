import React, { useEffect, useState } from "react";
import CheckoutSteps from "../components/CheckoutSteps";
import { Button, Col, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { savePaymentMethod } from "../slices/cartSlice";



const PaymentPage = () => {

  const [paymentMethod,setPaymentMethod] = useState("paypal")

   const dispatch = useDispatch()
   const cart = useSelector(state=>state.cartState)
   const {shippingAddress} = cart
   const navigate = useNavigate()

   useEffect(()=>{
      if(shippingAddress == null){
        navigate('/shipping')
      }
   },[paymentMethod,navigate])

   const onSubmit=(e)=>{
    e.preventDefault()
    dispatch(savePaymentMethod(paymentMethod))
    navigate('/placeorder')
   }

   
  return (
    <div>
      <CheckoutSteps step1 step2 step3 />
      <div className="flex justify-center p-4">
        
        <Form onSubmit={onSubmit}>
          <p className="mb-3 text-2xl font-semibold">Payment Method</p>
          <Form.Group>
          <Form.Label as='legend'>Select Method</Form.Label>
           <Col>
             <Form.Check 
              type="radio"
              className="my-2"
              label="Paypal or Credit Card"
              id="paypal"
              name='paymentMethod'
              value='paypal'
              checked
              onChange={(e)=>setPaymentMethod(e.target.value)}
             />  
           </Col>
          </Form.Group>
          <Button type="submit" className="bg-blue-500">
            Continue
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default PaymentPage;
