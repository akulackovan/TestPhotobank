import Post from '../models/Post.js'
import User from '../models/User.js'
import City from '../models/City.js'
import Comment from '../models/Comment.js'

export const getPostComments = async (req, res) => {
    try {
        const post = await Post.findById(req.query.id)
        if (!post) {
            return res.status(400).json({
                message: 'Поста не существует'
            })
        }
        const list = await Promise.all(
            post.comments.map((comment) => {
                return Comment.findById(comment)
            }),
        )
        const out = list.map((r) => ({author: r.author, comment: r.comment}))
        const total = await Promise.all(
            out.map(({author, comment}) => {
                return User.findById(author)
            }))

        var end = []
        let i = total.length - 1
        while (i >= 0) {
            end = [...end, {user: total[i].username, comment: out[i].comment}]
            i--
        }

        return res.status(200).json({
            total: end,
            message: 'Комментарии получены',
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({message: 'Ошибка при получении комментариев к посту'})
    }
}

export const getMyPost = async (req, res) => {
    try {
        const isUser = await User.findOne({id: req.query.id})
        if (!isUser) {
            return res.status(400).json({
                message: 'Пользователя не существует'
            })
        }

        const isPost = await Post.find({author: req.query.id})
        if (!isPost || isPost.length == 0) {
            return res.status(400).json({
                message: 'Фото нет'
            })
        }

        return res.json({
            isPost,
            message: 'Посты пользователя получены',
        })


    } catch (error) {
        console.log(error)
        return res.status(400).json({
            message: 'Ошибка при получении постов пользователя'
        })
    }
}
export const setLike = async (req, res) => {
    try {
        const {idUser, idPost} = req.query
        const post = await Post.findById(idPost)
        if (!post) {
            return res.status(400).json({
                message: 'Поста не существует'
            })
        }
        let user = await User.findOne({_id: idUser, likes: idPost})
        var like = false
        if (!user) {
            await User.updateOne({_id: idUser}, {$push: {likes: idPost}})
            let post = await Post.findOne({_id: idPost})
            await Post.updateOne({_id: idPost}, {likes: 1 + post.likes})
            like = true
        } else {
            await User.updateOne({_id: idUser}, {$pull: {likes: idPost}})
            let post = await Post.findOne({_id: idPost})
            await Post.updateOne({_id: idPost}, {likes: post.likes - 1})
        }
        res.status(200).json({
            like,
            message: 'Лайк изменен',
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({message: 'Ошибка при получении статуса лайка'})
    }
}
export const getLike = async (req, res) => {
    try {
        const {idUser, idPost} = req.query
        let user = await User.findOne({_id: idUser, likes: idPost})

        const post = await Post.findOne({_id: idPost})
        if (!post) {
            return res.status(400).json({
                message: 'Поста не существует'
            })
        }
        if (!user) {
            var like = false
        } else {
            like = true
        }
        res.status(200).json({
            like,
            message: 'Лайк получен',
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({message: 'Ошибка при получении статуса лайка'})
    }
}
export const addView = async (req, res) => {
    try {
        const post = await Post.findById(req.query.id)
        if (!post) {
            return res.status(400).json({
                message: 'Поста не существует'
            })
        }
        await Post.updateOne({_id: req.query.id}, {views: post.views + 1})
        res.status(200).json({
            message: 'Успешно',
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({message: 'Ошибка при добавлении просмотра'})
    }
}
export const getPostById = async (req, res) => {
    try {
        const {id} = req.query
        const isPost = await Post.findOne({_id: id})
        if (!isPost) {
            return res.status(400).json({
                message: 'Поста не существует'
            })
        }

        const likes = await User.find({likes: id})
        isPost.likes = likes.length

        const autor = await User.findOne({_id: isPost.author})
        autor.password = ""
        isPost.author = autor
        console.log(isPost)
        const city = await City.findOne({_id: isPost.city})
        isPost.city = city

        return res.json({
            isPost,

            message: 'Пост получен',
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            message: 'Ошибка при получении поста'
        })
    }
}