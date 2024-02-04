import Order from "../models/order.js";
import ErrorHandler from "../utils/errorHandler.js";
import Product from "../models/productModel.js";
import Stripe from 'stripe';
const stripe = new Stripe("sk_test_51KGg2iAmdzaBb8GIX68xTx4O7CNr08IfTylIe8vznXwEYvLyBZpcbEUQJREl4aegyfALHlKgZIBqOXymcIlrEFIV00bpWaLuO2");

// creating the order
// route POST /api/order/addorder
export const addOrderItems = async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod ,userId } = req.body;
  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  } else {
    // get the ordered items from our database
    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((x) => x._id) },
    });
    // map over the order items and use the price from our items from database
    const dbOrderItems = orderItems.map((itemFromClient) => {
      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
      );
      return {
        ...itemFromClient,
        product: itemFromClient._id,
        price: matchingItemFromDB.price,
        _id: undefined,
      };
    });

    // calculate prices
    const { itemsPrice, taxPrice, shippingPrice, totalPrice } = dbOrderItems;

    const order = new Order({
      orderItems: dbOrderItems,
      user: userId,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
};


export const orderPayment = async(req,res)=>{
  const { items } = req.body;
  
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "usd",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
}

 export const payment =  async (req, res) => {
    
  const { amount } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "usd",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
}



// get user orders
// route POST /api/order/getmyorders
export const getMyOrders = async (req, res, next) => {
  const id = req.params.id
  try {
    const allorders = await Order.find({ user:id });
    res.status(200).json(allorders);
  } catch (error) {
    console.log(error)
  }
};

// route POST /api/order/orders/:id
export const getOrderById = async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (order) {
    res.status(200).json(order);
  } else {
    return next(new ErrorHandler("No order find", 400));
  }
};

// route GET /api/orders/:id/pay
export const updateOrderToPay = async (req, res, next) => {
  res.send("order is added");
};

// route GET /api/orders/:id/deliver
export const updateOrderToDelivered = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
  if(order){
    order.isDelivered=true
    order.deliveredAt=new Date()
  }
  const saveOrder = await order.save()
  res.status(200).json(saveOrder);
  } catch (error) {
    res.status(500).json("Error occurred");
    console.log(error)
  }
  
};

// route GET /api/orders
export const getOrders = async (req, res, next) => {
  try {
    const allorders = await Order.find();
    res.status(200).json(allorders);
  } catch (error) {
    console.log(error)
  }
};
