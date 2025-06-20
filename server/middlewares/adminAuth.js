const adminAuth = (...role) => {
  return (req, res, next) => {
    try {
      if (!role.includes(req.user.role)) {
        return res.json({ success: false, data: null, message: "Unauthorized", status: 403 })
      }
      next()
    } catch (err) {
      console.log(err.message)
    }
  }
}

export default adminAuth