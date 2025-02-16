import bcrypt from 'bcrypt'

const hashPassword = async (password) => {
  let hashedPassword = await bcrypt.hash(password, 10)
  return hashedPassword
}

const comparePassword = async (password, hashedPassword) => {
  let result = await bcrypt.compare(password, hashedPassword)
  return result
}

export { hashPassword, comparePassword }