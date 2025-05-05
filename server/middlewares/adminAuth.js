const adminAuth = (...role) => {
  console.log("req here");
  
  return (req, res, next) => {
    try {
      if (!role.includes(req.user.role)) {
        return res.json({ data: null, message: "Unauthorized", status: 403 })
      }
      next()
    } catch (err) {
      console.log(err.message)
    }
  }
}

export default adminAuth