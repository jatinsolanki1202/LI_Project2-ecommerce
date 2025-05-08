import express from 'express'
import dotenv from 'dotenv'
import userRoutes from './routes/user.routes.js'
import sequelize from './config/db.js';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import adminRoutes from './routes/admin.routes.js'
import cartRoutes from './routes/cart.routes.js';
import categoriesController from './controllers/categories.controller.js'
import productController from './controllers/product.controller.js';
import syncDatabase from './sync.js';
import adminAuth from './middlewares/adminAuth.js';
import loginCheckRoutes from './routes/check.routes.js'
import loginAuth from './middlewares/loginAuth.js';
syncDatabase()
// import syncDatabase from './sync.js'

const app = express()
dotenv.config()
// DB Connection
// dbConnection.query("SELECT 1")
//   .then(() => console.log("DB Connected"))
//   .catch((err) => console.log("DB connection error: ", err))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// sequelize.authenticate()
//   .then(() => console.log('DB Connected'))
//   .catch((err) => console.log('DB Connection error: ', err))



app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}))
app.use(cookieParser())
app.use('/user', userRoutes)
app.use('/admin', adminRoutes)
app.use('/cart', cartRoutes)
app.use('/check', loginCheckRoutes)

app.get('/categories', categoriesController)
app.get('/products', productController)
app.use('/images', express.static('uploads'))

app.get('/', (req, res) => res.send('working'))

app.listen(process.env.PORT, () => console.log(`server running on port ${process.env.PORT}`))