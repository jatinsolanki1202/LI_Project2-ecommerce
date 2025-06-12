import mysql from 'mysql2/promise'
import fs from 'fs';
import Sequelize from 'sequelize';
import dotenv from "dotenv";
dotenv.config();

// const sequelize = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
//   ssl: {
//     rejectUnauthorized: true, // Ensures secure connection
//     ca: fs.readFileSync(process.env.CA), // Read SSL certificate file
//   },
// })


let secret = `-----BEGIN CERTIFICATE-----\n`
secret += process.env.SQL_SECRET_KEY.toString()
secret += `\n-----END CERTIFICATE-----`

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
    port: process.env.DB_PORT,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: true,
        ca: secret
      }
    }
  }
)

export default sequelize;