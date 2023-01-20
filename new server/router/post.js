import {Router} from "express"
const router = new Router()
import {getPostById, getMyPost, getPostComments, getLike} from '../controllers/post.js'
import {createComment} from '../controllers/comments.js'

/*router.post('/post', addPost) //создание поста*/

router.get('/', getPostById) //получение всех постов

router.get('/getMe', getMyPost)

router.get('/comments', getPostComments)

router.post('/comments', createComment)

router.get('/getLike', getLike)


export default router