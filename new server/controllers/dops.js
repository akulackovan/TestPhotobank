import Post from "../models/Post.js";

export const rePost = async (req, res) => {
    try {
        const {postId, text} = req.body;
        const post = await Post.findOne({postId});
        if (!post) {
            return res.status(404).json({
                message: 'Такого поста не существует',
            });
        }
        await Post.updateOne({text: text});
        return res.status(200).json({message: "Успешное редактирование"    });
    } catch {
        res.status(400).json({message: "Ошибка при редактировании поста"});
    }
};

export const getAllPost = async (req, res) => {
    try {
        const post = await Post.find();
        if (!post){
            return res.status(404).json({message: "Постов нет", posts: post})
        }
        return res.status(200).json({message: "Успешно полученные посты", posts: post});
    } catch {
        res.status(400).json({message: "Ошибка при получении всех постов"});
    }
};