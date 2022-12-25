import {Router} from "express"
import {settings} from '../controllers/settings.js'

const router = new Router()

router.post('/', settings)

export default router