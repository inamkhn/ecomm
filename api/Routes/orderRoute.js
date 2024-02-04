import express from 'express'
import { authorizeAdmin, isAuthenticated } from '../middleware/auth.js'
import { addOrderItems,getOrders,getMyOrders,getOrderById,updateOrderToDelivered,payment } from '../Controller/orderController.js'
const router = express.Router()

router.route('/order').post(addOrderItems).get(getOrders) //isAuthenticated,authorizeAdmin,
router.route('/mine/:id').get(getMyOrders)
router.route('/order/:id').get(getOrderById)
// router.route('/:id/pay').put(isAuthenticated,authorizeAdmin,updateOrderToPay)
router.route('/:id/deliver').put(updateOrderToDelivered) //isAuthenticated,authorizeAdmin,
router.route("/create-payment-intent").post(payment)

export default router

