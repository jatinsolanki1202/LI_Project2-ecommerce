import Cart from "../models/Cart.js"

const removeItem = async (req, res) => {
  try {
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

export { removeItem }