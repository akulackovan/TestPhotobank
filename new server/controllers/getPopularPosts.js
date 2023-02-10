import User from "../models/User.js";
import Post from "../models/Post.js";

/** Получение популярных - изначально, как понял требования */
/*export const getPopular = async (req, res) => {
  try {
    
    var isToday = false
    // Ищем пользователя по id 
    const { id } = req.query;
    console.log("here1 " + id);
    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(404).json({
        message: "Такого пользователя не существует.",
      });
    }
    // Получаем город
    const city = user.city;
    console.log("city" + city);
    if (!city) {
      return res.status(404).json({
        message: "Ошибка в получении города пользователя.",
      });
    }
    // Получаем посты, которые находятся в этом городе и сортируем
    const posts = await Post.find({ city: city }).sort({  views: -1,  timestamps: -1 }).exec();
    if (!posts || posts.length == 0) {
      return res.status(404).json({
        message: "Фотографий в городе нет",
      });
    }


    // Получаем сегодня 
    var nowTime = new Date();
    nowTime.setHours(0, 0, 0, 0);
    console.log(isToday);
    console.log(nowTime);

    // Получаем самый новый пост 
    var createDate = posts[0].timestamps;
    createDate.setHours(0, 0, 0, 0);
    // Если он за сегодня
    if (createDate > nowTime) {
      isToday = true;
    }
    
    return res.status(200).json({
      posts,
      isToday,
      message: "Популярное",
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ message: "Ошибка при получении популярных" });
  }
};*/





/** Получение популярных - как планировалось
 * Пояснение "Фотографий за день нет" к кждому дню, где их нет
 */
export const getPopular = async (req, res) => {
  try {
    // Ищем пользователя по id
    const { id } = req.query;
    console.log("here1 " + id);
    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(404).json({
        message: "Такого пользователя не существует.",
      });
    }
    console.log(user)
    // Получаем посты, которые находятся в этом городе
    const posts = await Post.find({city: user.city}).sort({ timestamps:-1 })

    /*const posts = await Post.find({ city: user.city }).sort({  views: -1,  timestamps: -1 }).exec();
    if (!posts || posts.length == 0) {
      return res.status(404).json({
        message: "Фотографий в городе нет",
      });
    }*/
    if (!posts || posts.length == 0 ){
      return res.status(400).json({
        message: "Фотографий в городе нет",
      });
    }
    
    
    // Получаем "сейчас" 
    let date = new Date()
    date.setHours(0, 0, 0, 0)
    // Получаем дату самого старого поста 
    const startDate = new Date(posts[posts.length - 1].timestamps)
    startDate.setHours(0, 0, 0, 0)
    // Возвращаемый массив
    const popular = []

    let i = 0
    
    let datePost = new Date(posts[i].timestamps)
    datePost.setHours(0, 0, 0, 0)

    //Просматриваем каждую дату
    while (date >= startDate) {
        const postByDate = []
        console.log(i)
        //Если посты для даты есть, то добавляем в список
        while (i < posts.length && +datePost === +date)
        {
            postByDate.push(posts[i])
            i++
            if (i != posts.length)
            {
                datePost = new Date(posts[i].timestamps)
                datePost.setHours(0, 0, 0, 0)
            }
        }
        if (postByDate.length == 0) {
            popular.push({date: `${(date.getDate()) < 10 ? 0 : ''}${date.getDate()}.${date.getMonth()+ 1 < 10 ? 0 : ''}${date.getMonth()+1}.${date.getFullYear()}`, posts: "Фотографий за день нет"})
        }
        else {
            postByDate.sort(compare)
            popular.push({date: `${(date.getDate()) < 10 ? 0 : ''}${date.getDate()}.${date.getMonth()+ 1 < 10 ? 0 : ''}${date.getMonth()+ 1}.${date.getFullYear()}`, posts: postByDate})
        }
        date.setDate(date.getDate() - 1)
    }

    return res.status(200).json({
        popular,
        message: "Популярное",
      });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ message: "Ошибка при получении популярных" });
  }
};


function compare( a, b ) {
  if ( a.views < b.views ){
    return 1;
  }
  if ( a.views > b.views ){
    return -1;
  }
  return 0;
}