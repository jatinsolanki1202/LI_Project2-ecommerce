import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Address = sequelize.define(
  "address",
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
    email:{
      type: DataTypes.STRING,
    },
    phone:{
      type: DataTypes.STRING,
    },
    first_name:{
      type: DataTypes.STRING,
    },
    last_name:{
      type: DataTypes.STRING,
    },
    address1: {
      type: DataTypes.STRING,
    },
    address2: {
      type: DataTypes.STRING,
    },
    zip: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.STRING,
    },
    state: {
      type: DataTypes.STRING,
    },
    country: {
      type: DataTypes.STRING,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  { tableName: "address", timestamps: false }
);

export default Address;
