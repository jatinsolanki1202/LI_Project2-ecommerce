import express from "express";
import crypto from "crypto";
import Order from "../models/Order.js";
import CartItem from "../models/CartItem.js";
import Product from "../models/Product.js";
import OrderItem from "../models/OrderItem.js";

const router = express.Router();

router.post("/get-razorpay-res", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, cartId } = req.body
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

      const orderItems = await OrderItem.findAll({
        where: { order_id: order.id }
      })

      await orderItems?.map(async (orderItem) => {
        const product = await Product.findByPk(orderItem.product_id);
        if (product) {
          await Product.update({
            stock: product.stock - orderItem.quantity
          }, {
            where: { id: orderItem.product_id }
          });
        }
      });
      await CartItem.destroy({
        where: { cart_id: cartId }
      })

      return res.json({ success: true, message: "Payment verified" });
    }
    return res.json({ success: false, message: "Invalid signature" });
  } catch (error) {
    console.log("error verifying payment: ", error.message)
  }
});

export default router;
