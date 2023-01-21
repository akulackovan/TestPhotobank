import User from '../models/User.js';

export const getSubscriptionPosts = async (req, res) => {
    try {
        const {userId} = req.body;
        const user = await User.findOne({userId});
        if (!user) {
            return res.status(404).json({
                message: 'Такого пользователя не существует.',
            });
        }
        const subscriptions = user.subscriptions;
        if (subscriptions == null) {
            return res.status(400).json({message: 'Нет подписок'});
        }
        const returnedPosts = [];
        subscriptions.forEach(current => {
            returnedPosts.push(current.post);
        });
        if (returnedPosts.length > 1) {
            returnedPosts.sort(sortByDate());
        }
        return res.status(200).json({
            returnedPosts,
            message: 'Подписки',
        })
    } catch (error) {
        return res.status(400).json({message: 'Ошибка при получении постов.'});
    }
};

function sortByDate(first, second) {
    return first.timestamps - second.timestamps;
    // todo или return second.view - first.view;
}
