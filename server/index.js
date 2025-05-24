import express from 'express'
import dotenv from 'dotenv'
import userRoutes from './routes/user.routes.js'
import sequelize from './config/db.js';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import adminRoutes from './routes/admin.routes.js'
import cartRoutes from './routes/cart.routes.js';
import categoriesController from './controllers/categories.controller.js'
import syncDatabase from './sync.js';
import adminAuth from './middlewares/adminAuth.js';
import loginCheckRoutes from './routes/check.routes.js'
import razorpayRoutes from './routes/razorpay.routes.js'
import orderRoutes from './routes/order.routes.js'
import loginAuth from './middlewares/loginAuth.js';
import { getAllProducts, getSingleProduct } from "./controllers/product.controller.js"

syncDatabase()

const app = express()
dotenv.config()

app.use(cors({
  origin: "*",
  credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())
// app.use('/admin/*', loginAuth, adminAuth("admin"))
app.use('/user', userRoutes)
app.use('/admin', adminRoutes)
app.use('/cart', cartRoutes)
app.use('/check', loginCheckRoutes)

app.get('/categories', categoriesController)
app.get('/products', getAllProducts)
app.get('/products/:productId', getSingleProduct)
app.use('/images', express.static('uploads'))
app.use('/orders', orderRoutes)
app.use("/razorpay", razorpayRoutes)

app.get('/', (req, res) => res.send('working'))

app.listen(process.env.PORT, () => console.log(`server running on port ${process.env.PORT}`))