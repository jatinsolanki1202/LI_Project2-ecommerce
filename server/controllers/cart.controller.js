import Cart from "../models/Cart.js"
import CartItem from "../models/CartItem.js"

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
        // as: 'cartItems' // optional alias, only if you defined one in association
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
export { removeItem, fetchCartItems }