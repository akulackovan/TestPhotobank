import {Router} from "express"
const router = new Router()
import {getPopular} from "../controllers/getPopularPosts.js";
import {createPost} from "../controllers/postController.js";
import {getSubscriptionPosts} from "../controllers/getSubscriptionPosts.js";
import {getPostById, getMyPost, getPostComments, getLike, addView, setLike } from '../controllers/post.js'
import {createComment} from '../controllers/comments.js'

router.post('/post', createPost) //создание поста

router.get('/', getPopular) //получение популярных

router.get('/getMe', getMyPost)

router.get('/post/id', getPostById)

router.get('/comments', getPostComments)

router.post('/comments', createComment)

router.get('/getLike', getLike)

router.get('/popular', getPopular)

router.get('/subscription', getSubscriptionPosts)

router.put('/addView', addView)
router.put('/setLike', setLike)

export default router