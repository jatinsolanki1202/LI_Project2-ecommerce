import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';


const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, { tableName: "cart", timestamps: false });

// Cart.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
// Cart.belongsTo(Product, { foreignKey: 'product_id', onDelete: 'CASCADE' });
export default Cart;
