import { validationResult } from "express-validator"
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import ProductImageModel from "../models/ProductImage.js";
import fs from 'fs'
import axiosInstance from "../../client/src/utils/axiosInstance.js";
import userModel from "../models/User.js";
import dbConnection from '../config/db.js'
import { comparePassword } from "../utils/bcrypt.js";
import { createToken } from "../utils/jwt.js";
import categoryModel from "../models/Category.js";
import ProductImage from "../models/ProductImage.js";

const handleAdminLogin = async (req, res) => {
  try {
    //validation check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ success: false, message: errors.array()[0].msg });
    }
    let { email, password } = req.body

    let user = await userModel.findOne({
      where: { email, role: 'admin' }
    })

    if (!user) return res.json({ success: false, data: null, message: "Not an admin email", status: 400 })

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
    console.log(err.message);

  }
}
const addProduct = async (req, res) => {

  try {
    let { name, price, description, stock, category } = req.body;

    let images = req.files
    // Validation check
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const categoryRecord = await Category.findOne({ where: { name: category } });

    if (!categoryRecord) {
      return res.status(404).json({ message: "Category not found!" });
    }

    const categoryId = categoryRecord.id;

    let product = await Product.create({
      name,
      price,
      description,
      stock,
      category_id: categoryId
    });

    let productImages = []
    images.map((image) => productImages.push({ image_path: image.filename, product_id: product.id }))
    await ProductImageModel.bulkCreate(productImages)
    return res.status(201).json({ success: true, message: "Product added successfully!", product });

  } catch (err) {
    return res.status(500).json({ success: false, message: "Server Error", err });
  }
};


const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId

    await Product.update(
      { is_active: '0' },
      { where: { id: productId } }
    )

    res.json({ success: true, message: "product deleted successfully", status: 200 })
  } catch (err) {
    res.json({ success: false, message: "something went wrong", status: 500 })
  }
}

const editProduct = async (req, res) => {
  try {
    let productId = req.params.productId;

    let { name, price, description, stock, category } = req.body;

    let images = req.files || [];

    // Validation check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ success: false, message: errors.array()[0].msg });
    }

    // Check if category is provided
    if (!category) {
      return res.json({ success: false, message: "Category is required!" });
    }

    const categoryRecord = await Category.findOne({ where: { name: category } });
    if (!categoryRecord) {
      return res.status(404).json({ success: false, message: "Category not found!" });
    }

    const categoryId = categoryRecord.id;

    // Update the product details
    const [updated] = await Product.update(
      { name, price, description, stock, category_id: categoryId },
      { where: { id: productId } }
    );

    if (updated == 0 || updated == '0') {
      return res.json({ success: true, message: "No changes detected, product saved", status: 200 });
    }

    // If images are provided, delete old images and insert new ones
    if (images.length > 0) {

      // Delete old images
      await ProductImageModel.destroy({ where: { product_id: productId } });

      // Add new images
      let productImages = images.map((image) => ({
        image_path: image.filename,
        product_id: productId,
      }));
      await ProductImageModel.bulkCreate(productImages);
    }

    return res.status(200).json({ success: true, message: "Product updated successfully!" });
  } catch (err) {
    console.error("Edit Product Error:", err);
    return res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};

const fetchCategory = async (req, res) => {
  try {
    let categories = await Category.findAll({
      include: [
        {
          model: Product,
          where: { is_active: '1' }
        }
      ]
    })
    res.json({ success: true, data: categories, message: "categories fetched", status: 200 })

  } catch (error) {
    console.log("error fetching categories: ", error.message)
  }
}

const createCategory = async (req, res) => {
  try {
    let { name, description } = req.body

    // Validation check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    let category = await Category.create({
      name,
      description
    })

    return res.json({ success: true, message: "Category created successfully", status: 200, data: category })

  } catch (error) {
    console.log("error creating category: ", error.message)
  }
}

const editCategory = async (req, res) => {
  try {
    let { name, description } = req.body
    let categoryId = req.params.categoryId

    // Validation check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    let category = await Category.update({
      name,
      description
    }, {
      where: { id: categoryId }
    })

    return res.json({ success: true, message: "Category updated successfully", status: 200 })

  } catch (error) {
    console.log("error updating category: ", error.message)
  }
}

const deleteCategory = async (req, res) => {
  try {
    let categoryId = req.params.categoryId

    await Category.destroy({
      where: { id: categoryId }
    })

    return res.json({ success: true, message: "Category deleted successfully", status: 200 })

  } catch (error) {
    console.log("error deleting category: ", error.message)
  }
}

const getAllProducts = async (req, res) => {
  try {

    const products = await Product.findAll({
      where: { is_active: '1' },
      include: [
        {
          model: ProductImage
        },
        {
          model: categoryModel,
          attributes: ["id", "name"]
        }
      ]
    });

    return res.json({ success: true, data: products, status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, message: "Error fetching products" });
  }
};

export {
  addProduct,
  deleteProduct,
  editProduct,
  fetchCategory,
  handleAdminLogin,
  createCategory,
  editCategory,
  deleteCategory,
  getAllProducts
}