import express from 'express'
import { getAllProducts, getProduct,createProduct,updateProduct,deleteProduct,createProductReview,getTopProduct } from '../Controller/productController.js'
import singleUpload from '../middleware/multer.js'

const router = express.Router()

router.route('/getallproducts').get(getAllProducts)
router.route('/getproduct/:id').get(getProduct)
router.route('/createproduct').post(createProduct) //singleUpload
router.route('/update/:id').put(updateProduct)
router.route('/deleteproduct/:id').delete(deleteProduct)
router.route('/review/:id').post(createProductReview)
router.route('/topproducts').get(getTopProduct)

export default router