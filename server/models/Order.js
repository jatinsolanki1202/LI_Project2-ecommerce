import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "paid"),
      defaultValue: "pending",
    },
    delivery_status: {
      type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
      defaultValue: "pending"
    },
    razorpay_order_id: {
      type: DataTypes.STRING
    },

    razorpay_payment_id: {
      type: DataTypes.STRING

    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    
  },
  { timestamps: false, tableName: "orders" }
);

Order.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });

export default Order;
