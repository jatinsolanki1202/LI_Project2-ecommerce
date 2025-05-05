import {verifyToken} from "../utils/jwt.js";

export const checkLoginStatus = (req, res, next) => {
   try{
       let token = req.headers?.authorization.split(' ')[1]
        if(!token) {
            return res.status(401).json({
                success: false, message: "No token found"
            })
        }
       let decoded = verifyToken(token)
       if(!decoded) return res.status(401).json({success: false, message: "Invalid token"})

       return res.status(200).json({...decoded, success: true})
   } catch (err) {
       console.log("login error: ", err.message)
   }
}

