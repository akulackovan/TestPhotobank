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
        let list = await Promise.all(
            post.comments.map((comment) => {
                comment = Comment.findById(comment)
                return comment
            }),
        )
    
        res.status(200).json({
            list,
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
        const user = User.find({ likes: idPost })
        if (user) {
            var like = true
        }
        else {
            like = false
        }
        res.status(200).json({
            user,
            message: 'Лайк получен',
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Ошибка при получении статуса лайка' })
    }
}