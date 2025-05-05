import express from 'express'
const router = express.Router()
import {checkLoginStatus} from "../controllers/loginStatus.controller.js";

router.get('/login-status', checkLoginStatus)

export default router;