import sequelize from '../config/db.js';
import User from './User.js';
import Cart from './Cart.js';
import CartItem from './CartItem.js';
import Product from './Product.js';
import Category from './Category.js';
import ProductImage from './ProductImage.js';
import Order from './Order.js';
import OrderItem from './OrderItem.js';
import Address from './Address.js';



User.hasOne(Cart, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Cart.belongsTo(User, { foreignKey: 'user_id' });

Cart.hasMany(CartItem, { foreignKey: 'cart_id', onDelete: 'CASCADE' });
CartItem.belongsTo(Cart, { foreignKey: 'cart_id' });

Product.hasMany(CartItem, { foreignKey: 'product_id', onDelete: 'CASCADE' });
CartItem.belongsTo(Product, { foreignKey: 'product_id' });

Category.hasMany(Product, { foreignKey: 'category_id', onDelete: 'SET NULL' });
Product.belongsTo(Category, { foreignKey: 'category_id' });

Product.hasMany(ProductImage, { foreignKey: 'product_id', onDelete: 'CASCADE' });
ProductImage.belongsTo(Product, { foreignKey: 'product_id', onDelete: 'CASCADE' });

Order.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });
User.hasMany(Order, { foreignKey: "user_id", onDelete: "CASCADE" });


OrderItem.belongsTo(Order, { foreignKey: "order_id", onDelete: "CASCADE" });
Order.hasMany(OrderItem, { foreignKey: "order_id", onDelete: "CASCADE" });

OrderItem.belongsTo(Product, { foreignKey: "product_id" });

User.hasMany(Address, { foreignKey: "user_id", onDelete: "CASCADE" });
Address.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });
export {
    sequelize,
    User,
    Cart,
    CartItem,
    Product,
    Category,
    ProductImage,
    Order,
    OrderItem,
  };