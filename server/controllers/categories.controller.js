import categoryModel from "../models/Category.js"; // Assuming Category is your Sequelize model

// Controller to fetch categories
const categoriesController = async (req, res) => {
  console.log("req come here");
  
  try {
    const categories = await categoryModel.findAll(); // Fetch all categories
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ success: false, message: "Error fetching categories" });
  }
};

// Export the controller
export default categoriesController;
