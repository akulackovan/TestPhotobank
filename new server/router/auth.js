import {Router} from "express"
import {getMe, login, register, subscibe, search} from '../controllers/auth.js'
import {checkAuth} from "../utils/checkAuth.js";

const router = new Router()

router.post('/reg', register)

router.post('/login', login)

router.get('/profile', getMe)
router.post('/subscribe', subscibe)
router.get('/search', search)
export default router