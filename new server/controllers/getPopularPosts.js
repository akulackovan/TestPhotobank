import User from '../models/User.js';
import Post from "../models/Post.js";

export const getPopular = async (req, res) => {
    try {
        var isToday = false
        const {id} = req.query;
        console.log("here1 " + id)
        const user = await User.findOne({_id:id});
        if (!user) {
            return res.status(404).json({
                message: 'Такого пользователя не существует.',
            });
        }
        const city = user.city;
        console.log("city" + city)
        if (!city) {
            return res.status(404).json({
                message: 'Ошибка в получении города пользователя.',
            });
        }
        const posts = await Post.find({city: city});
        if (!posts || posts.length == 0) {
            return res.status(404).json({
                message: 'Фотографий в городе нет',
            });
        }
        var nowTime = new Date()
        nowTime.setHours(0, 0, 0, 0)
        console.log(isToday)
        console.log(nowTime)
        for (let i = posts.length - 1; i >= 0; i--) {
            var createDate = posts[i].timestamps
            console.log(createDate)
            if (createDate > nowTime) {
                isToday = true
                break
            }
        }
        console.log(posts.length)
        if (posts.length > 1) {
            posts.sort(sortByDateAndViews);
        }
        return res.status(200).json({
            posts,
            isToday,
            message: 'Пост получен',
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({message: 'Ошибка при получении популярных постов.'});
    }
};

function sortByDateAndViews(first, second) {
    return -1 * (first.timestamps === second.timestamps ?
        first.views - second.views : first.timestamps - second.timestamps);
    // todo или return second.view - first.view;
}
