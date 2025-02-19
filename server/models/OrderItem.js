import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Order from "./Order.js";
import Product from "./Product.js";

const OrderItem = sequelize.define(
  "OrderItem",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "Orders", key: "id" },
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "Products", key: "id" },
    },
    product_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  { timestamps: false }
);

// Define relationships
OrderItem.belongsTo(Order, { foreignKey: "order_id", onDelete: "CASCADE" });
OrderItem.belongsTo(Product, { foreignKey: "product_id" });

export default OrderItem;
