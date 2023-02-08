import User from '../models/User.js';
import Post from "../models/Post.js";

/** Получение постов посписок */
export const getSubscriptionPosts = async (req, res) => {
    try {
        //** Параметр и проверка */
        const {id}= req.query;
        console.log("HERE " + id)
        const user = await User.findById({_id:id});
        if (!user) {
            return res.status(404).json({
                message: 'Такого пользователя не существует.',
            });
        }

        //** Получение подписки */
        const subscriptions = user.subscriptions;
        console.log(subscriptions)
        if (subscriptions == null || subscriptions.length==0) {
            return res.status(400).json({message: 'Нет подписок'});
        }

        /** Получение их постов */
        const returnedPosts = [];
        for (let i = 0; i < subscriptions.length; i++) {
            const posts = await Post.find({author:subscriptions[i]._id})
            if (!posts) {
                continue
            }
            if (posts._id != null) {
                returnedPosts.push()
            }
            for (let j = 0; j < posts.length; j++) {
                returnedPosts.push(posts[j])
            }
        }
        if (!returnedPosts || returnedPosts.length == 0) {
            return res.status(400).json({message: 'Нет опубликованных фотографий'});
        }
        /** Сортировка */
        if (returnedPosts.length > 1) {
            returnedPosts.sort(sortByDate);
        }
        return res.status(200).json({
            returnedPosts,
            message: 'Подписки',
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({message: 'Ошибка при получении постов.'});
    }
};

function sortByDate(first, second) {
    return second.timestamps - first.timestamps;
}
