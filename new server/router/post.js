import {Router} from "express"
import {getPopular} from "../controllers/getPopularPosts.js";
import {createPost} from "../controllers/postController.js";
import {getSubscriptionPosts} from "../controllers/getSubscriptionPosts.js";
import {addView, getLike, getMyPost, getPostById, getPostComments, setLike} from '../controllers/post.js'
import {createComment} from '../controllers/comments.js'

const router = new Router()

router.post('/post', createPost) // готово
router.put('/addView', addView) // готово
router.get('/getLike', getLike) // готово
router.put('/setLike', setLike) // готово
router.get('/post/id', getPostById) // готово
router.get('/getMe', getMyPost) // готово

router.get('/comments', getPostComments)

router.post('/comments', createComment) // не мое
router.get('/popular', getPopular) // не мое
router.get('/subscription', getSubscriptionPosts) // не мое
router.get('/', getPopular) //не мое


export default router