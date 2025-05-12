import express from "express";
import crypto from "crypto";
import Order from "../models/Order.js";

const router = express.Router();

router.post("/get-razorpay-res", async (req, res) => {

  console.log(req.body);
const {razorpay_order_id, razorpay_payment_id,razorpay_signature} = req.body
const order = await Order.findOne({
    where: {
      razorpay_order_id,
    },
  });

  if (!order) {
    return res.status(404).json({ message: "Order not found or unauthorized" });
  }

  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET) // Secret key only here
    .update(order.razorpay_order_id + "|" + razorpay_payment_id) // Concatenated message
    .digest("hex"); 

  if (generated_signature === razorpay_signature) {
    console.log("verified");
    
    order.status = "paid";
    order.razorpay_payment_id = razorpay_payment_id;
    await order.save();

    return res.json({ success: true, message: "Payment verified" });
  } else {
    return res.status(400).json({ success: false, message: "Invalid signature" });
  }
});

export default router;
