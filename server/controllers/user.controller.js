import { validationResult } from "express-validator";
import { hashPassword, comparePassword } from '../utils/bcrypt.js'
import { createToken } from "../utils/jwt.js";
import User from '../models/User.js'
import Product from '../models/Product.js'
import Category from '../models/Category.js'
import ProductImage from "../models/ProductImage.js";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import OrderItem from "../models/OrderItem.js";
import CartItem from "../models/CartItem.js";
import { where } from "sequelize";

const createUser = async (req, res) => {
  try {
    //validation check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ message: errors.array()[0].msg });
    }
    let { name, email, password, cnfPassword, address } = req.body

    let existingUser = await User.findOne({
      where: { email }
    })
    if (existingUser) return res.json({ data: null, message: "email already registered", status: 400 })
    if (password != cnfPassword) return res.json({ data: null, message: "password and confirm password did not match", status: 400 })

    // password hashing
    let hashedPassword = await hashPassword(password)

    // user creation
    const user = await User.create({
      name, email, password: hashedPassword, address
    })
    if (!user) return res.json({ message: "error registering user", status: 500 })

    // token creation
    const token = createToken(user.id, user.role)
    return res.json({ data: user, message: "user registered successfully", status: 301, token })
  } catch (err) {
    return res.json({ message: err.message, status: 500 })
  }
}

const handleLogin = async (req, res) => {
  try {
    //validation check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ success: false, message: errors.array()[0].msg });
    }
    let { email, password } = req.body

    let user = await User.findOne({
      where: { email }
    })

    if (!user) return res.json({ success: false, data: null, message: "Incorrect email or password", status: 400 })

    let isValidPassword = await comparePassword(password, user.password)
    if (!isValidPassword) return res.json({ success: false, data: null, message: "Incorrect email or password", status: 400 })

    // token creation
    const token = createToken(user.id, user.role)
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // Use true in production (only allows HTTPS)
      sameSite: "Strict",
    });
    return res.json({ success: true, data: user, message: "Logged in successfully", status: 200, token })
  } catch (err) {
    console.log(err)
    res.json({ success: false, message: err.message, status: 500 })
  }
}

const homePage = async (req, res) => {
  try {
    // let token = req.cookies.token
    // console.log(token, "asdfds");

    let products = await Product.findAll({
      include: [{ model: ProductImage }]
    });

    res.json({
      message: "fetched all products",
      // role: localStorage.getItem("token"), // Include user details
      data: products,
      status: 200
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error });
  }
};


const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict"
  });


  return res.status(200).json({ success: true, message: "Logged out successfully", status: 200 });
};

const addToCart = async (req, res) => {
  try {
    let userId = req.user.id;
    if (!userId) return res.json({ success: false, message: "login to add product to cart" })
    let { product_id, quantity, cart_id } = req.body;


    let product = await Product.findOne({
      where: { id: product_id }
    })

    if (product.stock < 1) return res.json({ success: false, message: "Not enough stock to add", status: 400 })

    let existingCartItem = await CartItem.findOne({
      where: { cart_id: cart_id, product_id: product_id }
    });

    if (existingCartItem) {
      existingCartItem.quantity += Number(quantity) || 1;
      await existingCartItem.save();

      return res.status(200).json({
        success: true,
        message: "Cart updated successfully",
        data: existingCartItem
      });
    } else {
      let newCartItem = await CartItem.create({
        // user_id: userId,
        cart_id: cart_id,
        product_id: product_id,
        quantity: quantity || 1
      });

      return res.status(201).json({
        success: true,
        message: "Product added to cart",
        data: newCartItem
      });
    }
  } catch (error) {
    console.error("Error adding product to cart:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

const listCart = async (req, res) => {
  let userId = req.user.id

  // let cart = await Cart.findOne({
  //   where: { user_id: userId },
  //   include: [
  //     {
  //       model: Product,
  //       include: [
  //         {
  //           model: ProductImage, // Assuming Product has images
  //         }
  //       ]
  //     }
  //   ],
  // })

  const cart = await Cart.findOne({
    where: { user_id: userId },
    include: [
      {
        model: CartItem,
        include: [
          {
            model: Product,
            include: [ProductImage],
          }
        ]
      }
    ]
  });

  if (cart) return res.json({ cart, success: true, message: "fetched cart details" })
}

const handleCheckOut = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({
      where: { user_id: userId },
      include: [{
        model: CartItem,
        include: [{ model: Product }]
      }],
    });

    console.log(JSON.stringify(cart, null, 2), " checkoutApi");

    if (cart.CartItems.length < 1) {
      return res.json({ success: false, message: "Cart is empty", status: 400 });
    }

    let totalAmount = 0;

    // total amount calculation
    cart?.CartItems.forEach((item) => {
      totalAmount += item.quantity * item.Product.price;
    });

    const order = await Order.create({
      user_id: userId,
      total_amount: totalAmount,
      status: "Pending",
    });

    const orderItems = cart.CartItems.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.Product.name,
      quantity: item.quantity,
      price: item.Product.price
    }));

    await OrderItem.bulkCreate(orderItems);

    // delete cart
    await Cart.destroy({ where: { user_id: userId } });

    // Decrement stock for all purchased products
    await Promise.all(
      orderItems.map(async (item) => {
        await Product.decrement("stock", { by: item.quantity, where: { id: item.product_id } });
      })
    );

    return res.json({ success: true, message: "Order placed successfully", order_id: order.id });

  } catch (error) {
    console.error("Checkout error:", error);
    res.json({ success: false, message: "Checkout failed", status: 500 });
  }
};



export { createUser, handleLogin, homePage, logoutUser, addToCart, listCart, handleCheckOut }