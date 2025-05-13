import express from 'express';
import loginAuth from '../middlewares/loginAuth.js';
import adminAuth from '../middlewares/adminAuth.js';
import Order from '../models/Order.js';
const router = express.Router();

router.get("/", loginAuth, adminAuth('admin'), async (req, res) => {
  const orders = await Order.findAll({})

  if (orders) {
    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: orders
    })
  }

  return res.json({
    success: false,
    message: "No orders found",
  })
})

export default router