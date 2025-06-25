import express from 'express'
import { addProduct, deleteProduct, editProduct, fetchCategory, handleAdminLogin, createCategory, editCategory, deleteCategory, getAllProducts, getAllOrders, updateOrderStatus } from '../controllers/admin.controller.js'
import { body, check } from 'express-validator'
import adminAuth from '../middlewares/adminAuth.js'
import loginAuth from '../middlewares/loginAuth.js'
import multer from 'multer'

const router = express.Router()

const storage = multer.memoryStorage()

const upload = multer({ storage: storage })

router.post('/add-product', loginAuth, adminAuth("admin"), [
  // check("name").notEmpty().withMessage("Product name is required"),
  // check("price").notEmpty().withMessage("Product price is required"),
  // check("stock").notEmpty().withMessage("stock is required"),
  // check("category").notEmpty().withMessage("category is required"),
], upload.array("images"), addProduct)

router.post('/login', [
  body("email").notEmpty().withMessage("email is required"),
  body("email").isEmail().withMessage("Invalid email"),
  body("password").notEmpty().withMessage("password is required")
], handleAdminLogin)

router.get('/category', loginAuth, adminAuth("admin"), fetchCategory)
router.post('/category', createCategory)
router.put('/category/:categoryId', editCategory)
router.delete('/category/:categoryId', deleteCategory)


router.post('/delete-product/:productId', loginAuth, adminAuth('admin'), deleteProduct)
router.put('/edit-product/:productId', loginAuth, adminAuth('admin'), upload.array("images"), editProduct)
router.get('/products', loginAuth, adminAuth('admin'), getAllProducts)

// GET /admin/orders - list all orders with user and order items
router.get('/orders', loginAuth, adminAuth('admin'), getAllOrders);

// PUT /admin/orders/:orderId/status - update order status
router.put('/orders/:orderId/status', loginAuth, adminAuth('admin'), updateOrderStatus);

export default router