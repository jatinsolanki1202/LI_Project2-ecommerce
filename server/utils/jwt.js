import jwt from 'jsonwebtoken'

const createToken = (id, role) => {
  const token = jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '10h' });
  return token
}

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return decoded
  } catch (err) {
    return { error: "session timed out. Please login again" }
  }
}
export { createToken, verifyToken }