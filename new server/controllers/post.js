import Post from '../models/Post.js'
import User from '../models/User.js'
import City from '../models/City.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const getPostById = async (req, res) => {
    try {
        const {id} = req.query
        const isPost = await Post.findOne({_id: id[1]})
        if (!isPost) {
            return res.status(400).json({
                message: 'Поста не существует'
            })
        }

        const autor = await User.findOne({_id: isPost.author})

        const city = await City.findOne({_id: isPost.city})
        

        return res.json({
            isPost,
            autor,
            city,

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
        const isUser = await User.findOne({id: req.query.id})
        if (!isUser) {
            return res.status(400).json({
                message: 'Пользователя не существует'
            })
        }

        const isPost = await Post.find({author: req.query.id})
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