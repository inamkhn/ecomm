import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
// import axios from "axios";
import { useSelector } from "react-redux";
// import CheckoutForm from "../components/CheckoutForm";
import "../App.css";
import axios from 'axios'



const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (elements == null) {
      return;
    }

    // Trigger form validation and wallet collection
    const {error: submitError} = await elements.submit();
    if (submitError) {
      // Show error to your customer
      setErrorMessage(submitError.message);
      return;
    }
    const amount = 100
    // Create the PaymentIntent and obtain clientSecret from your server endpoint
    const res = await axios.post('http://localhost:5000/api/v1/create-payment-intent',{amount});

    const {client_secret: clientSecret} = await res

    const {error} = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      clientSecret,
      confirmParams: {
        return_url: '/',
      },
    });

    if (error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
      setErrorMessage(error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button type="submit" className="px-2 py-1" disabled={!stripe || !elements}>
        Pay
      </button>
      {/* Show error message to your customers */}
      {errorMessage && <div>{errorMessage}</div>}
    </form>
  );
};

const stripePromise = loadStripe('pk_test_51KGg2iAmdzaBb8GIdBvvWKaj3oXMf02F054gz978e0d21Pbst0K7k05KlroUruHNU1sCbnXMRQS8DPrv7GAJt5Az0011OsF6zY');

const options = {
  mode: 'payment',
  amount: 1099,
  currency: 'usd',
  // Fully customizable with appearance API.
  appearance: {
    /*...*/
  },
};


const OrderScreen = () => {
  const { order } = useSelector((state) => state.orderState);
  const { user } = useSelector((state) => state.userState);
  return (
    <>
      <div className="mx-24">
        <div className="grid grid-cols-12">
          <div className="col-span-9 mt-3">
            <h1 className="text-2xl font-bold">Order {order._id}</h1>
            <hr className="w-96 my-3" />
            <p className="text-xl font-bold my-2">Shipping</p>
            <p>
              Name: <span>{user.name}</span>
            </p>
            <p>
              Email: <span>{user.email}</span>
            </p>
            <div
              className={`${
                order.isDelivered === false ? "bg-red-400" : "bg-green-300"
              } p-2 rounded-lg my-1 w-52 text-white`}
            >
              {order.isDelivered === false ? (
                <p>Not Delivered</p>
              ) : (
                <p>Delivered</p>
              )}
            </div>
            <hr className="w-96 my-3" />
            <p className="text-xl font-bold my-2">Payment Method</p>
            <span>Method Stripe: {order.paymentMethod}</span>

            <div
              className={`${
                order.isPaid === false ? "bg-red-400" : "bg-green-300"
              } p-2 rounded-lg my-1 w-52 text-white`}
            >
              {order.isPaid === false ? <p>Not Paid</p> : <p>Paid</p>}
            </div>
            <hr className="w-96 my-3" />
            <p className="text-xl font-bold my-2">Order Items</p>
            <div>
              {order.orderItems.map((item, index) => {
                return (
                  <div className="flex space-x-5 my-2 items-center" key={index}>
                    <img src={item.image} alt="" width={80} />
                    <span>{item.name}</span>
                    <span>
                      {item.qty} x ${item.price} = ${item.qty * item.price}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="col-span-3 ">
            <div className="w-full rounded-lg shadow-md lg:max-w-sm mt-5">
              <div className="p-4">
                <h4 className="text-xl font-semibold tracking-tight text-blue-600">
                  Order Summary
                </h4>
                <p className="mb-2 leading-normal">
                  Items: $
                  {order.orderItems.reduce((acc, item) => acc + item.price, 0)}
                </p>
                <p className="mb-2 leading-normal">
                  Shipping: ${order.shippingPrice}
                </p>
                <p className="mb-2 leading-normal">
                  Tax: ${order.taxPrice + 20}
                </p>
                <p className="mb-2 leading-normal">
                  Total: $
                  {order.orderItems.reduce(
                    (acc, item) => acc + item.price + 20,
                    0
                  )}
                </p>
                <button
                  
                  className="px-4 py-2 text-sm text-blue-100 bg-blue-500 rounded shadow"
                >
                  <Elements stripe={stripePromise} options={options}>
                    <CheckoutForm />
                  </Elements>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderScreen;
