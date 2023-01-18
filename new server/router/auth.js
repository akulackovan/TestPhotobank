import {Router} from "express"
import {getMe, login, register, subscibe} from '../controllers/auth.js'
import {checkAuth} from "../utils/checkAuth.js";

const router = new Router()

router.post('/reg', register)

router.post('/login', login)

router.get('/profile', getMe)
router.post('/subscribe', subscibe)

export default router