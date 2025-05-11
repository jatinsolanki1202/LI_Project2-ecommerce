import categoryModel from "../models/Category.js";
import Product from "../models/Product.js";
import ProductImage from "../models/ProductImage.js";

const getAllProducts = async (req, res) => {
  try {
    const { category_id } = req.query; // Get category_id from query params

    let whereCondition = { is_active: '1' }; // Default condition to fetch active products
    if (category_id) {
      whereCondition.category_id = parseInt(category_id); // Apply filter if category_id is provided
    }

    const products = await Product.findAll({
      where: whereCondition,
      include: [{
        model: ProductImage
      },
      { model: categoryModel, attributes: ["id", "name"] }
      ]
    });

    res.json({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, message: "Error fetching products" });
  }
};

const getSingleProduct = async (req, res) => {
  try {
    const productId = req.params.productId;

    const product = await Product.findOne({
      where: { id: productId, is_active: '1' },
      include: [{
        model: ProductImage
      }]
    })

    if (!product) return res.status(404).json({ success: false, data: null, message: "No product found" })

    return res.status(200).json({ success: true, data: product, message: "Product fetched" })
  } catch (error) {
    console.log("error getting product details: ", error.message)
  }
}

export { getAllProducts, getSingleProduct }
