import Comment from '../models/Comment.js'
import Post from '../models/Post.js'
import User from '../models/User.js'

/** Создание комментария */
export const createComment = async (req, res) => {
    try {
        /** Получение параметров и их проверка*/
        const { postId, userId, comment } = req.query
        
        const isUser = await User.findOne({ _id: userId })
        if (!isUser) {
            return res.status(418).json({ message: 'Неверный пользователь' })
        }

        const isPost = await Post.findOne({ _id: postId })
        if (!isPost) {
            return res.status(418).json({ message: 'Пост не найден' })
        }

        /** Дополнительная проверка на пустой комментарий */
        if (!comment)
            return res.status(418).json({ message: 'Комментарий не может быть пустым' })

        /** Создание нового комментария */
        const newComment = new Comment({ author: isUser, comment })
        await newComment.save()

        /** Добавление комментария к посту */
        await Post.findByIdAndUpdate(postId, {
            $push: { comments: newComment._id },
        })
        
        return res.status(201).json({
            newComment: {user: isUser.username, comment: comment},
            message: 'Успешно созданный комментарий',
        })
    } catch (error) {
        res.status(400).json({ message: 'Ошибка при добавлении комментария' })
    }
}