import { db } from "./mock/db";
import { rest } from "msw";

export const handlers = [
  rest.put("/post/addView", async (req, res, ctx) => {
    //Получаем id от запроса
    const id = await req.url.searchParams.get("id");
    const post = await db.post.findFirst({
      where: {
        id: {
          equals: id,
        },
      },
    });
    if (!post) {
      return res(
        ctx.delay(0),
        ctx.status(404, "Поста не существует"),
        ctx.json({ message: "Поста не существует" })
      );
    }

    db.post.update({
      // Query for the entity to modify.
      where: {
        id: {
          equals: id,
        },
      },
      // Provide partial next data to be
      // merged with the existing properties.
      data: {
        views: post.views + 1,
      },
    });
    return res(
      ctx.delay(0),
      ctx.status(200, "Успешно добавлен просмотр"),
      ctx.json({ message: "Успешно добавлен просмотр" })
    );
  }),

  rest.get("/post/post/id", async (req, res, ctx) => {
    //Получаем id от запроса

    const id = await req.url.searchParams.get("id");
    let post = await db.post.findFirst({
      where: {
        id: {
          equals: id,
        },
      },
    });

    return res(
      ctx.delay(0),
      ctx.status(200, "Получен пост"),
      ctx.json({ isPost: post })
    );
  }),

  rest.get("/post/getLike", async (req, res, ctx) => {
    return res(
      ctx.delay(0),
      ctx.status(200, "Получен лайк"),
      ctx.json({ like: false })
    );
  }),

  rest.get("/post/comments", async (req, res, ctx) => {
    const id = await req.url.searchParams.get("id");
    const comments = db.comments.findMany({});
    return res(
      ctx.delay(0),
      ctx.status(200, "Получены комментарии"),
      ctx.json({ total: comments })
    );
  }),

  //получение всегда будет с другой страницы, тк при получении
  //profile - id действительный
  rest.get("/auth/user", async (req, res, ctx) => {
    //Получаем id от запроса
    const id = await req.url.searchParams.get("userId");
    const user = await db.user.findFirst({
      where: {
        _id: {
          equals: id,
        },
      },
    });
    if (!user) {
      return res(
        ctx.delay(0),
        ctx.status(404, "Пользователя не существует"),
        ctx.json({ message: "Пользователя не существует" })
      );
    }

    return res(
      ctx.delay(0),
      ctx.status(200, "Получен пользователь"),
      ctx.json({ user: user, isSubscribe: false, subscibe: [] })
    );
  }),

  rest.get("/auth/profile", async (req, res, ctx) => {
    //Получаем id от запроса
    const id = await req.url.searchParams.get("userId");
    const user = await db.user.findFirst({
      where: {
        _id: {
          equals: id,
        },
      },
    });
    if (!user) {
      return res(
        ctx.delay(0),
        ctx.status(404, "Пользователя не существует"),
        ctx.json({ message: "Пользователя не существует" })
      );
    }

    return res(
      ctx.delay(0),
      ctx.status(200, "Получен пользователь"),
      ctx.json({ user: user, subscibe: [] })
    );
  }),

  rest.post("/settings", async (req, res, ctx) => {
    //Получаем id от запроса
    const { username, userId } = await req.body;

    const user = await db.user.findFirst({
      where: {
        username: {
          equals: username,
        },
      },
    });
    if (user) {
      return res(
        ctx.delay(0),
        ctx.status(404, "Имя пользователя занято"),
        ctx.json({ message: "Имя пользователя занято" })
      );
    }

    db.user.update({
      where: {
        _id: {
          equals: userId,
        },
      },
      // Provide partial next data to be
      // merged with the existing properties.
      data: {
        username: username,
      },
    });
    return res(
      ctx.delay(0),
      ctx.status(200, "Настройки изменены"),
      ctx.json({ message: "Настройки изменены" })
    );
  }),

  rest.post("/auth/reg", async (req, res, ctx) => {
    const { username, password, city } = await req.body;
    const user = await db.user.findFirst({
      where: {
        username: {
          equals: username,
        },
      },
    });
    if (user) {
      return res(
        ctx.delay(0),
        ctx.status(404, "Имя пользователя занято"),
        ctx.json({ message: "Имя пользователя занято" })
      );
    }
    const cityDB = await db.user.findFirst({
      where: {
        id: {
          equals: city,
        },
      },
    });
    const userDB = db.user.create({
      username: username,
      password: password,
      city: cityDB,
    });
    return res(
      ctx.delay(0),
      ctx.status(200, "Регистрация успешна"),
      ctx.json({ user: userDB })
    );
  }),
  rest.get("/auth/search", async (req, res, ctx) => {
    const name = await req.url.searchParams.get("name");
    const user = db.user.findMany({
      where: {
        username: {
          equals: name,
        },
      },
    });

    const search = await Promise.all(
      user.map((us) => {
        return { id: us._id, username: us.username };
      })
    );
    return res(
      ctx.delay(0),
      ctx.status(200, "Успешный поиск"),
      ctx.json({ user: search })
    );
  }),
  rest.get("/city/getallcity", async (req, res, ctx) => {
    const city = db.city.findMany({});
    console.log(city);
    return res(
      ctx.delay(0),
      ctx.status(200, "Города получены"),
      ctx.json({ city: city })
    );
  }),
  rest.post("/auth/login", async (req, res, ctx) => {
    const { username, password } = await req.body;
    const user = await db.user.findFirst({
      where: {
        username: {
          equals: username,
        },
      },
    });
    if (!user) {
      return res(
        ctx.delay(0),
        ctx.status(404, "Такого пользователя нет"),
        ctx.json({ message: "Такого пользователя нет" })
      );
    }
    if (user.password != password) {
      return res(
        ctx.delay(0),
        ctx.status(404, "Неверный пароль"),
        ctx.json({ message: "Неверный пароль" })
      );
    }
    return res(
      ctx.delay(0),
      ctx.status(200, "Вход успешен"),
      ctx.json({ id: user.id, token: "Token" })
    );
  }),
];
