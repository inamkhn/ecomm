import express from 'express'
import { getAllProducts, getProduct,createProduct,getCategory,updateProduct,deleteProduct,createProductReview,getTopProduct } from '../Controller/productController.js'
import singleUpload from '../middleware/multer.js'

const router = express.Router()

router.route('/getallproducts').get(getAllProducts)
router.route('/getproduct/:id').get(getProduct)
router.route('/createproduct').post(singleUpload,createProduct) //singleUpload
router.route('/update/:id').put(updateProduct)
router.route('/deleteproduct/:id').delete(deleteProduct)
router.route('/review/:id').post(createProductReview)
router.route('/topproducts').get(getTopProduct)
router.route('/getproducts').get(getCategory)

export default router