import Post from '../../../../../project/youtube-src-main/server/models/Post.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const getPostByUserId = async (req, res) => {
    try {
        const { idUser } = req.body
        const { options } = {
            projection: {_id: 0, username: 0, password: 0, city: 0, image: 0, posts: 1, subscriptions: 0}
        }
        const isUser = await User.findById({ idUser }, { options })

        if (!isUser) {
            return res.json({ message: 'Пользователя не существует.' })
        }

        return isUser       
 
    }
    catch (error) {
        res.json({ message: 'Ошибка при получении постов пользователя.' })
    }
}