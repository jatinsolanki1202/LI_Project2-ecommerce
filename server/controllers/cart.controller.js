import Cart from "../models/Cart.js"
import CartItem from "../models/CartItem.js"
import Product from "../models/Product.js"
import ProductImage from "../models/ProductImage.js"

const removeItem = async (req, res) => {
  try {
    let userId = req.user.id
    let cartId = req.query.cartid


    let productId = req.params.productId
    let cartItem = await CartItem.findOne({
      where: {
        cart_id: cartId,
        product_id: productId
      }
    })

    if (cartItem) await cartItem.destroy({})
    res.json({ success: true, message: "product removed from cart", status: 200 })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
}

const fetchCartItems = async (req, res) => {

  try {
    const userId = req.user.id;

    let cart = await Cart.findOne({
      where: { user_id: userId },
      include: [{
        model: CartItem,
        include: [
          {
            model: Product,
            include: [{
              model: ProductImage
            }]
          }
        ],
      }]
    });

    if (!cart) {
      cart = await Cart.create({ user_id: userId });
    }

    return res.json({ data: cart, success: true, message: "cart found" })
  } catch (err) {
    console.log(err.message)
    res.json({ success: false, message: err.message })
  }
}

const updateCartItem = async (req, res) => {
  try {
    const { cart_id, product_id, quantity } = req.body;
    const userId = req.user.id;

    if (!cart_id || !product_id || !quantity) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    let cartItem = await CartItem.findOne({
      where: { cart_id, product_id }
    });

    if (!cartItem) {
      return res.status(404).json({ success: false, message: "Cart item not found" });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    return res.json({ success: true, message: "Cart item updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
}
export { removeItem, fetchCartItems, updateCartItem }