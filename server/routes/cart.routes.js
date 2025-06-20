import express from 'express'
import {fetchCartItems, removeItem, updateCartItem} from '../controllers/cart.controller.js'
import loginAuth from '../middlewares/loginAuth.js'

const router = express.Router()

router.get('/',loginAuth, fetchCartItems)
router.delete('/remove/:productId', loginAuth, removeItem)
router.put('/update', loginAuth, updateCartItem)

export default router