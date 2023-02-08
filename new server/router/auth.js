import {Router} from "express"
import {getMe, login, register, subscibe, search, getAnother } from '../controllers/auth.js'

const router = new Router()

router.post('/reg', register) // Регистрация
router.post('/login', login) // Вход

router.get('/profile', getMe) //Получение нашего пользователя
router.post('/subscribe', subscibe) //Изменение подписки
router.get('/search', search) //Поиск
router.get('/user', getAnother) //Получение другого пользвателя

export default router