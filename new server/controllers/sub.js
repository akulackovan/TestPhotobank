import User from "../models/User.js";

export const getSubsribeUsers = async (req, res) => {
  try {
    //** Параметры */
    let { userId } = req.query;
    /** Поиск пользователей */
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({
        message: "Такого пользователя не существует.",
      });
    }
    let sub;
    if (user.subscriptions.length == 0) {
      return res.status(404).json({
        message: "Нет подписок",
      });
    }
    try {
      sub = await Promise.all(
        user.subscriptions.map((user) => {
          const temp = User.findById(user);
          return temp;
        })
      );
    } catch (error) {
      return res.status(404).json({
        message: "Такого пользователя не существует.",
      });
    }

    sub = await Promise.all(
      sub.map((sub) => {
        return { id: sub._id, username: sub.username };
      })
    );

    return res.status(200).json({
      sub,
      message: "Получены подписки",
    });
    
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Не удалось получить подписки" });
  }
};
