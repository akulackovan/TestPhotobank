import {Router} from "express"
const router = new Router()
import {getPostById, getMyPost} from '../controllers/post.js'

/*router.post('/post', addPost) //создание поста*/

router.get('/', getPostById) //получение всех постов

router.get('/getMe', getMyPost)


export default router