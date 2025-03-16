import mysql from 'mysql2/promise'
import Sequelize from 'sequelize';
import dotenv from "dotenv";
dotenv.config();

// const connection = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
//   // ssl: {
//   //   rejectUnauthorized: true, // Ensures secure connection
//   //   ca: fs.readFileSync(process.env.CA), // Read SSL certificate file
//   // },
// })

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false
  }
)

export default sequelize;