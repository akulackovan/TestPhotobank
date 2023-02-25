import User from '../models/User.js'

export const getSubsribeUsers = async (req, res) => {
    try {
        //** Параметры */
        let {userId} = req.query
        /** Поиск пользователей */
        const user = await User.findOne({_id: userId})
        if (!user) {
            return res.status(404).json({
                message: 'Такого пользователя не существует.',
            })
        }

        if (user.subscriptions.length == 0) {
            return res.status(404).json({
                message: 'Нет подписок',
            })
        }

        //Не работает - выводит пустоту
        const sub = await Promise.all(
            user.subscriptions.map((user) => {
                console.log(user)
                const temp = User.findOne({_id: user})
              return {id: temp.id, username: temp.username};
            })
          );

        res.json({
            sub,
            message: 'Получены подписки',
        })
    } catch (error) {
        console.log(error)
        res.status(401).json({message: 'Не удалось получить подписки'})
    }
}