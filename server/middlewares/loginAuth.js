import { verifyToken } from "../utils/jwt.js"

const loginAuth = (req, res, next) => {

  try {
    let token = req.headers.token
    if (!token) return res.json({ message: "Please login again", status: 401 })
    let decoded = verifyToken(token)

    if (decoded.error) {
      res.clearCookie("token")
      return res.json({ success: false, message: decoded.error })
    }
    req.user = decoded
    next()
  } catch (err) {
    return res.json({ success: false, message: "something went wrong" })
  }
}

export default loginAuth