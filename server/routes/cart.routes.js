import express from 'express'
import { removeItem } from '../controllers/cart.controller.js'
import loginAuth from '../middlewares/loginAuth.js'

const router = express.Router()

router.delete('/remove/:productId', loginAuth, removeItem)
export default router