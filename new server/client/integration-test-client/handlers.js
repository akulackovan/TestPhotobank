import { db } from "./mock/db";
import { rest } from 'msw'

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
          views: post.views + 1
        },
      })
    return res(
      ctx.delay(0),
      ctx.status(200, "Успешно добавлен просмотр"),
      ctx.json({ message: "Успешно добавлен просмотр" })
    );
  }),


  //получение всегда будет с другой страницы, тк при получении
  //profile - id действительный
  rest.get("/auth/user", async (req, res, ctx) => {
    //Получаем id от запроса
    const id = await req.url.searchParams.get("userId");    
    const user = await db.user.findFirst({
      where: {
        id: {
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
      ctx.json({user: user})
    );
  })
]