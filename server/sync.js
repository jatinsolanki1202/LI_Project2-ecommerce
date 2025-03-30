import sequelize from './config/db.js';
import User from './models/User.js';
import Category from './models/Category.js';
import Product from './models/Product.js';
import ProductImage from './models/ProductImage.js';
import Cart from './models/Cart.js';
import Order from './models/Order.js';

const UserModel = new User(sequelize);
const CategoryModel = new Category(sequelize);
const ProductModel = new Product(sequelize);
const ProductImageModel = new ProductImage(sequelize);
const CartModel = new Cart(sequelize);
const OrderModel = new Order(sequelize);

const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: false, alter: true }); // `force: true` drops all tables and creates new ones
    await sequelize.authenticate();
    console.log('Database connected successfully');

    // await sequelize.sync({ alter: true }); // `alter: true` updates tables safely
    console.log('All tables synced successfully');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
};

// syncDatabase();
export default syncDatabase