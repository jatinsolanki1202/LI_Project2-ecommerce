import express from 'express'
import { createUser, handleLogin, homePage, logoutUser, addToCart, listCart, handleCheckOut, getAddresses } from '../controllers/user.controller.js'
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
  body("address1").notEmpty().withMessage("Address is required"),
  body("phone").notEmpty().withMessage("Phone number is required"),
  body("zip")
    .notEmpty().withMessage("ZIP Code is required")
    .isLength({ min: 6, max: 6 }).withMessage("ZIP must be exactly 6 digits")
    .isNumeric().withMessage("ZIP must contain only digits"),
  body("country").notEmpty().withMessage("Country is required"),
  body("state").notEmpty().withMessage("State is required"),
  body("city").notEmpty().withMessage("City is required")
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