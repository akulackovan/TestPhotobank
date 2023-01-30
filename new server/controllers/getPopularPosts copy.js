import User from "../models/User.js";
import Post from "../models/Post.js";

export const getPopular = async (req, res) => {
  try {
    //var isToday = false
    /** Ищем пользователя по id */
    const { id } = req.query;
    console.log("here1 " + id);
    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(404).json({
        message: "Такого пользователя не существует.",
      });
    }
    /** Получаем город */
    const city = user.city;
    console.log("city" + city);
    if (!city) {
      return res.status(404).json({
        message: "Ошибка в получении города пользователя.",
      });
    }
    /** Получаем посты, которые находятся в этом городе */
    const posts = await Post.find({ city: city });
    if (!posts || posts.length == 0) {
      return res.status(404).json({
        message: "Фотографий в городе нет",
      });
    }

    /** Сортируем по дате и просмотрам */
    if (posts.length > 1) {
        posts.sort(sortByDateAndViews);
    }


/*
    /** Получаем "сейчас" 
    let date = new Date()
    
    date.setHours(0, 0, 0, 0)
    /** Получаем дату последнего поста 
    const startDate = new Date(posts[posts.length - 1].timestamps)
    startDate.setHours(0, 0, 0, 0)
    const popular = []

    let i = 0
    
    let datePost = new Date(posts[i].timestamps)
    datePost.setHours(0, 0, 0, 0)

    while (date >= startDate) {
        const postByDate = []
        console.log(i)
        while (i < posts.length - 1 && +datePost === +date)
        {
            postByDate.push(posts[i])
            i++
                datePost = new Date(posts[i].timestamps)
                datePost.setHours(0, 0, 0, 0)
        }
        if (postByDate.length == 0) {
            popular.push({date: `${date.getDate()}\\${date.getMonth()+1}\\${date.getFullYear()}`, posts: "Фотографий за день нет"})
        }
        else {
            popular.push({date: `${date.getDate()}\\${date.getMonth()+ 1}\\${date.getFullYear()}`, posts: postByDate})
        }
        date.setDate(date.getDate() - 1)
    }

    return res.status(200).json({
        popular,
        message: "Пост получен",
      });
*/



    var nowTime = new Date();
    nowTime.setHours(0, 0, 0, 0);
    console.log(isToday);
    console.log(nowTime);
    for (let i = posts.length - 1; i >= 0; i--) {
      var createDate = posts[i].timestamps;
      console.log(createDate);
      if (createDate > nowTime) {
        isToday = true;
        break;
      }
    }
    console.log(posts.length);
    if (posts.length > 1) {
      posts.sort(sortByDateAndViews);
    }
    return res.status(200).json({
      posts,
      isToday,
      message: "Пост получен",
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ message: "Ошибка при получении популярных постов." });
  }
};

function sortByDateAndViews(first, second) {
  return (
    -1 *
    (first.timestamps === second.timestamps
      ? first.views - second.views
      : first.timestamps - second.timestamps)
  );
  // todo или return second.view - first.view;
}
