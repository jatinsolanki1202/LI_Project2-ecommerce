import categoryModel from "../models/Category.js";
import Product from "../models/Product.js";
import ProductImage from "../models/ProductImage.js";

const productController = async (req, res) => {
  try {
    const { category_id } = req.query; // Get category_id from query params

    let whereCondition = {};
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

export default productController;
