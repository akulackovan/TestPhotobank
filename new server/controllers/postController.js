import Post from "../models/Post.js";

export const createPost = async (req, res) => {
    try {
        const {city, photo, description, userId} = req.body;
        if (!city || !photo) {
            return res.status(400).json({
                message: 'Ошибка при создании поста',
            });
        }
        console.log("HERE" + city +" "+ photo.length +" " + description)
        const newPost = new Post({
            author: userId,
            city: city,
            image: photo,
            typeImage: null,
            text: description,
            view: 0,
            likes: 0,
            timestamps: new Date()
        });
        console.log("HERE1 " + newPost)
        await newPost.save();
        res.status(201).json({
            newPost,
            message: 'Успешно созданный пост',
        });
    } catch (error){
        console.log(error)
        res.status(400).json({message: 'Ошибка при создании поста'});
    }
};

export const deletePost = async (req, res) => {
    try {
        const {postId} = req.body;
        const post = await Post.findOne({postId});
        if (!post) {
            return res.status(404).json({
                message: 'Такого поста не существует',
            });
        }
        await Post.deleteOne(postId);
        res.status(204).json({message: 'Пост был удален'});
    } catch {
        res.status(400).json({message: 'Ошибка при удалении поста'});
    }
};