import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";
import { type } from "os";

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
      type: DataTypes.ENUM("pending", "shipped", "delivered", "cancelled","paid"),
      defaultValue: "pending",
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
  { timestamps: false }
);

Order.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });

export default Order;
