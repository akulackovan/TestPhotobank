import Post from '../models/Post.js'
import User from '../models/User.js'
import City from '../models/City.js'
import Comment from '../models/Comment.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const getPostById = async (req, res) => {
    try {
        const { id } = req.query
        const isPost = await Post.findOne({ _id: id[1] })
        if (!isPost) {
            return res.status(400).json({
                message: 'Поста не существует'
            })
        }

        const autor = await User.findOne({ _id: isPost.author })
        isPost.author = autor

        const city = await City.findOne({ _id: isPost.city })
        isPost.city = city

        return res.json({
            isPost,

            message: 'Пост получен',
        })
    } catch (error) {
        return res.status(400).json({
            message: 'Ошибка при получении поста'
        })
    }
}

export const getMyPost = async (req, res) => {
    try {
        const isUser = await User.findOne({ id: req.query.id })
        if (!isUser) {
            return res.status(400).json({
                message: 'Пользователя не существует'
            })
        }

        const isPost = await Post.find({ author: req.query.id })
        if (!isPost) {
            return res.status(400).json({
                message: 'Поста не существует'
            })
        }

        return res.json({
            isPost,
            message: 'Посты получены',
        })


    } catch (error) {
        console.log(error)
        return res.status(400).json({
            message: 'Ошибка при получении постов пользователя'
        })
    }
}

export const getPostComments = async (req, res) => {
    try {
        const post = await Post.findById(req.query.id)
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
            while (i >= 0)
            {
                end = [...end, {user: total[i].username, comment: out[i].comment}]
                i--
            }

            return res.status(200).json({
            total: end,
            message: 'Комментарии получены',
            }) 
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Ошибка при получении комментариев к посту' })
    }
}


export const getLike = async (req, res) => {
    try {
        const {idUser, idPost} = req.query
        let user = await User.findOne({_id: idUser, likes: idPost})
        
        if (!user) {
            var like = false
        }
        else {
            like = true
        }
        res.status(200).json({
            like,
            message: 'Лайк получен',
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Ошибка при получении статуса лайка' })
    }
}


export const addView = async (req, res) => {
    try {
        const post = await Post.findById(req.query.id)
        await Post.updateOne({_id: req.query.id}, {views: post.views + 1})  
        res.status(200).json({
            message: 'Успешно',
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Ошибка при получении статуса лайка' })
    }
}

export const setLike = async (req, res) => {
    try {
        const {idUser, idPost} = req.query
        let user = await User.findOne({_id: idUser, likes: idPost})
        var like = false
        if (!user) {
            await User.updateOne({_id: idUser},{ $push: {likes: idPost}})
            let post = await Post.findOne({_id: idPost})
            await Post.updateOne({_id: idPost},{ likes: 1 + post.likes})
            like = true
        }
        else {
            await User.updateOne({_id: idUser},{ $pull: {likes: idPost}})
            let post = await Post.findOne({_id: idPost})
            await Post.updateOne({_id: idPost},{ likes:post.likes - 1})
        }
        res.status(200).json({
            like,
            message: 'Лайк изменен',
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Ошибка при получении статуса лайка' })
    }
}

export const updateLike = async (req, res) => {
    try {
        const {idPost} = req.query
        let post = await Post.findOne({_id: idPost})
           
        res.status(200).json({
            likes: post.likes,
            message: 'Лайк изменен',
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Ошибка при получении статуса лайка' })
    }
}
