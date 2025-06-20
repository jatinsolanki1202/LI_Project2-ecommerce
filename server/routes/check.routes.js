import express from 'express'
const router = express.Router()
import {checkLoginStatus} from "../controllers/loginStatus.controller.js";
import loginAuth from "../middlewares/loginAuth.js";

router.get('/login-status', checkLoginStatus)
router.get('/is-admin', loginAuth, (req, res) => {
  // This route is for checking if the user is an admin
  // You can implement your logic here
  let user = req.user;  
  res.json({ isAdmin: req.user?.role === 'admin' });
});
export default router;