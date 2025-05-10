import express from 'express'
import { addProduct, deleteProduct, editProduct, fetchCategory, handleAdminLogin } from '../controllers/admin.controller.js'
import { body, check } from 'express-validator'
import adminAuth from '../middlewares/adminAuth.js'
import loginAuth from '../middlewares/loginAuth.js'
import multer from 'multer'

const router = express.Router()

const storage = multer.diskStorage({
  destination: "uploads",
  filename: function (req, file, cb) {
    try {
      return cb(null, `${Date.now()}${file.originalname}`)
    } catch (err) {
      console.log(err.message)
    }
  }
})

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

router.get('/category', fetchCategory)

router.post('/delete-product/:productId', loginAuth, adminAuth('admin'), deleteProduct)
router.put('/edit-product/:productId', loginAuth, adminAuth('admin'), upload.array("images"), editProduct)

export default router