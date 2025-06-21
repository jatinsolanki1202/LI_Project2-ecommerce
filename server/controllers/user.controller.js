import { validationResult } from "express-validator";
import { hashPassword, comparePassword } from "../utils/bcrypt.js";
import { createToken } from "../utils/jwt.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import ProductImage from "../models/ProductImage.js";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import OrderItem from "../models/OrderItem.js";
import CartItem from "../models/CartItem.js";
import { where } from "sequelize";
import Razorpay from "razorpay";
import Address from "../models/Address.js";
import sequelize from "../config/db.js";

const createUser = async (req, res) => {
  try {
    // 1. validation check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ message: errors.array()[0].msg, status: 400 });
    }

    const {
      name, email, password, cnfPassword,
      phone, address1, address2, zip,
      country, state, city
    } = req.body;

    // 2. Check for existing user
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.json({
        data: null,
        message: "Email already registered",
        status: 400,
      });
    }

    if (password !== cnfPassword) {
      return res.json({
        data: null,
        message: "Password and confirm password do not match",
        status: 400,
      });
    }

    const hashedPassword = await hashPassword(password);

    // 3. Create user and address within transaction
    let newUser;

    await sequelize.transaction(async (t) => {
      // Create user first
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
      }, { transaction: t });

      if (!user) throw new Error("User creation failed");

      // Then create address
      const address = await Address.create({
        user_id: user.id,
        address1,
        address2,
        zip,
        phone,
        email,
        full_name: name,
        country,
        state,
        city,
      }, { transaction: t });

      if (!address) throw new Error("Address creation failed");

      // Assign to outer variable for token generation
      newUser = user;
    });

    // 4. Create token outside the transaction
    const token = createToken(newUser.id, newUser.role);

    // 5. Final response
    return res.json({
      data: newUser,
      message: "User registered successfully",
      status: 201,
      token,
    });

  } catch (err) {
    return res.json({ message: err.message, status: 500 });
  }
};


const handleLogin = async (req, res) => {
  try {
    //validation check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ success: false, message: errors.array()[0].msg });
    }
    let { email, password } = req.body;

    let user = await User.findOne({
      where: { email },
    });

    if (!user)
      return res.json({
        success: false,
        data: null,
        message: "Incorrect email or password",
        status: 400,
      });

    let isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword)
      return res.json({
        success: false,
        data: null,
        message: "Incorrect email or password",
        status: 400,
      });

    // token creation
    const token = createToken(user.id, user.role);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // Use true in production (only allows HTTPS)
      sameSite: "Strict",
    });
    return res.json({
      success: true,
      data: user,
      message: "Logged in successfully",
      status: 200,
      token,
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message, status: 500 });
  }
};

const homePage = async (req, res) => {
  try {
    // let token = req.cookies.token
    // console.log(token, "asdfds");

    let products = await Product.findAll({
      where: { is_active: "1" },
      include: [{ model: ProductImage }],
    });

    res.json({
      message: "fetched all products",
      // role: localStorage.getItem("token"), // Include user details
      data: products,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });

  return res
    .status(200)
    .json({ success: true, message: "Logged out successfully", status: 200 });
};

const addToCart = async (req, res) => {
  try {
    let userId = req.user.id;
    if (!userId)
      return res.json({
        success: false,
        message: "login to add product to cart",
      });
    let { product_id, quantity, cart_id } = req.body;

    let product = await Product.findOne({
      where: { id: product_id },
    });

    if (product.stock < 1)
      return res.json({
        success: false,
        message: "Not enough stock to add",
        status: 400,
      });

    let existingCartItem = await CartItem.findOne({
      where: { cart_id: cart_id, product_id: product_id },
    });

    if (existingCartItem) {
      existingCartItem.quantity += Number(quantity) || 1;
      await existingCartItem.save();

      return res.status(200).json({
        success: true,
        message: "Cart updated successfully",
        data: existingCartItem,
      });
    } else {
      let newCartItem = await CartItem.create({
        // user_id: userId,
        cart_id: cart_id,
        product_id: product_id,
        quantity: quantity || 1,
      });

      return res.status(201).json({
        success: true,
        message: "Product added to cart",
        data: newCartItem,
      });
    }
  } catch (error) {
    console.error("Error adding product to cart:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const listCart = async (req, res) => {
  let userId = req.user.id;

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
          },
        ],
      },
    ],
  });

  if (cart)
    return res.json({ cart, success: true, message: "fetched cart details" });
};

const handleCheckOut = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({
      where: { user_id: userId },
      include: [
        {
          model: CartItem,
          include: [{ model: Product }],
        },
      ],
    });

    console.log(JSON.stringify(cart, null, 2), " checkoutApi");

    if (cart.CartItems.length < 1) {
      return res.json({
        success: false,
        message: "Cart is empty",
        status: 400,
      });
    }

    let totalAmount = 0;

    // total amount calculation    
    cart?.CartItems.forEach((item) => {
      totalAmount += item.quantity * Number(item.Product.price);      
    });



    var RazorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_API_KEY,
      key_secret: process.env.RAZORPAY_API_SECRET,
    });

    const razorpayRes = await RazorpayInstance.orders.create({
      amount:  Math.round(Number(totalAmount) * 100),
      currency: "INR",
      notes: {
        key1: "try k 1",
        key2: "try k 2",
      },
    });

    // console.log(razorpayRes,"hell yeah");
    if (razorpayRes.hasOwnProperty("error")) {
      return res.json({
        success: false,
        message: "Error while creating order",
        data: razorpayRes
      })
    }

    const order = await Order.create({
      user_id: userId,
      total_amount: totalAmount,
      status: "pending",
      razorpay_order_id: razorpayRes?.id || null
    });

    const orderItems = cart.CartItems.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.Product.name,
      quantity: item.quantity,
      price: item.Product.price,
    }));

    await OrderItem.bulkCreate(orderItems);


    // delete cart
    //   await Cart.destroy({ where: { user_id: userId } });

    //   // Decrement stock for all purchased products
    //   await Promise.all(
    //     orderItems.map(async (item) => {
    //       await Product.decrement("stock", {
    //         by: item.quantity,
    //         where: { id: item.product_id },
    //       });
    //     })
    //   );

    return res.json({
      success: true,
      message: "Order created successfully",
      data: razorpayRes,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    res.json({ success: false, message: "Checkout failed", status: 500 });
  }
};

const getAddresses = async (req, res) => {
  try {
    const userId = req.user.id;

    const addresses = await Address.findAll({
      where: { user_id: userId },
    });

    if (addresses.length === 0) {
      return res.json({ success: false, message: "No addresses found", data: [] });
    }

    res.status(200).json({ success: true, data: addresses });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

const handleCodOrderPlacing = async(req, res) => {
   try {
    const userId = req.user.id;

    const cart = await Cart.findOne({
      where: { user_id: userId },
      include: [
        {
          model: CartItem,
          include: [{ model: Product }],
        },
      ],
    });

    if (cart.CartItems.length < 1) {
      return res.json({
        success: false,
        message: "Cart is empty",
        status: 400,
      });
    }

    let totalAmount = 0;

    // total amount calculation
    cart?.CartItems.forEach((item) => {
      totalAmount += item.quantity * item.Product.price;
    });


    const order = await Order.create({
      user_id: userId,
      total_amount: totalAmount,
      status: "pending",
    });

    const orderItems = cart.CartItems.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.Product.name,
      quantity: item.quantity,
      price: item.Product.price,
    }));

    await OrderItem.bulkCreate(orderItems);


    // delete cart
      await Cart.destroy({ where: { user_id: userId } });

      // Decrement stock for all purchased products
      await Promise.all(
        orderItems.map(async (item) => {
          await Product.decrement("stock", {
            by: item.quantity,
            where: { id: item.product_id },
          });
        })
      );

    return res.json({
      success: true,
      message: "Order created successfully",
    });
  } catch (error) {
    console.error("Checkout error:", error);
    res.json({ success: false, message: "Checkout failed", status: 500 });
  }
}

const handleAddAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { full_name, address1, address2, zip, phone, country, state, city } = req.body;
 console.log(req.body, " bodyy");
 
    // Validate required fields
    if (!full_name || !address1 || !zip || !phone || !country || !state || !city) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Create new address
    const newAddress = await Address.create({
      user_id: userId,
      full_name,
      address1,
      address2,
      zip,
      phone,
      country,
      state,
      city,
    });

    res.status(201).json({ success: true, data: newAddress, message: "Address added successfully" });
  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

const getAllOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.findAll({
      where: { user_id: userId },
      include: [
        {
          model: OrderItem,
          include: [{ model: Product, include: [{model:ProductImage}] }],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    if (orders.length === 0) {
      return res.json({ success: false, message: "No orders found", data: [] });
    }

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

const getUserProfile = async (req, res) => {
  try {
    console.log("reqq here");
    
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("Error getting profile:", error.message);
    res.json({ success: false, message: "Failed to fetch user profile" });
  }
};

export {
  createUser,
  handleLogin,
  homePage,
  logoutUser,
  addToCart,
  listCart,
  handleCheckOut,
  getAddresses,
  handleCodOrderPlacing,
  handleAddAddress,
  getAllOrders,
  getUserProfile
};
