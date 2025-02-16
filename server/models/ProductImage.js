import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Product from './Product.js';
import categoryModel from './Category.js';
import Cart from './Cart.js';

const ProductImage = sequelize.define('Product_Images', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  image_path: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, { timestamps: false });


Product.hasMany(ProductImage, { foreignKey: 'product_id', onDelete: 'CASCADE' })
categoryModel.hasMany(ProductImage, { foreignKey: 'product_id', onDelete: 'CASCADE' })
ProductImage.belongsTo(Product, { foreignKey: 'product_id', onDelete: 'CASCADE' });

export default ProductImage;