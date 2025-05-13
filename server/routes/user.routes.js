import express from 'express'
import { createUser, handleLogin, homePage, logoutUser, addToCart, listCart, handleCheckOut ,getAddresses} from '../controllers/user.controller.js'
import { body } from 'express-validator'
import loginAuth from '../middlewares/loginAuth.js'

const router = express.Router()

// GET Routes
router.get('/home', homePage)
router.get('/cart', loginAuth, listCart)
router.get('/addresses', loginAuth, getAddresses)

// POST Routes
router.post('/register', [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Invalid email"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("address").notEmpty().withMessage("Address is required")
], createUser)

router.post('/login', [
  body("email").notEmpty().withMessage("email is required"),
  body("email").isEmail().withMessage("Invalid email"),
  body("password").notEmpty().withMessage("password is required")
], handleLogin)

router.post('/cart/add', loginAuth, addToCart)

router.post('/checkout', loginAuth, handleCheckOut)

router.post('/logout', logoutUser)
export default router