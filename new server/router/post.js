import {Router} from "express"
const router = new Router()
import {getPopular} from "../controllers/getPopularPosts.js";
import {createPost} from "../controllers/postController.js";
import {getSubscriptionPosts} from "../controllers/getSubscriptionPosts.js";
import {getPostById, getMyPost, getPostComments, getLike, addView, setLike, updateLike} from '../controllers/post.js'
import {createComment} from '../controllers/comments.js'

router.post('/post', createPost) //создание поста

router.get('/', getPopular) //получение всех постов

router.get('/getMe', getMyPost)

router.get('/comments', getPostComments)

router.post('/comments', createComment)

router.get('/getLike', getLike)

router.get('/popular', getPopular)

router.get('/subsc', getSubscriptionPosts)

router.post('/addView', addView)
router.post('/setLike', setLike)
router.get('/updateLike', updateLike)

export default router