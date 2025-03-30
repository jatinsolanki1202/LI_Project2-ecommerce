import Cart from "../models/Cart.js"

const removeItem = async (req, res) => {
  try {
    let userId = req.user.id

    let productId = req.params.productId
    let cartItem = await Cart.findOne({
      where: {
        user_id: req.user.id,
        product_id: productId
      }
    })

    if (cartItem) await cartItem.destroy({})
    res.json({ success: true, message: "product removed from cart", status: 200 })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
}

const fetchCartItems = async(req, res) => {
try {
  const userId = req.user.id;
  const cart = await Cart.findAll({where: {user_id: userId}})

  if (!cart) return res.json({success: false, message: 'Cart is empty'})

  return res.json({success: true, message: "cart found", data: cart})
} catch (err) {
  console.log(err.message)
  res.json({success: false, message: err.message})
}
}
export { removeItem , fetchCartItems}