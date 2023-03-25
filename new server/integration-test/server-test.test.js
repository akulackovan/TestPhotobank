/**
 * @jest-environment node
 */

/*
  Должно быть:
  User
  по умолчанию:
  1. test - test - Москва - 1 пост из Москвы
  2. tessi - tessi - Красноярск
  //----При необходимости добавить, но привести к первоночальному варианту----

  Города:
  1. Москва
  2. Красноярск
*/

//Импортируем настройки app
import { app } from "../app.js";
import request from "supertest";
import mongoose from "mongoose";
import User from "../models/User";
import Comment from "../models/Comment";
import Post from "../models/Post";
import { city1, user1, city2, post } from "./database.js";
import { user2 } from "./database.js";

beforeEach(async () => {
  //Подключаемся к тетовой базе данных mongoDB, DB Photobank - тестовая
  await mongoose.connect(
    `mongodb+srv://admin:admin@test.qidx0uu.mongodb.net/photobank`,
    { dbName: "photobank" }
  );
});

/* Closing database connection after each test. */
afterEach(async () => {
  await mongoose.connection.close();
});

//Проверка связи между пользователем и изменением настроек
test("Checking the connection between users and changing settings", async () => {
  //Проверка на то, что user с test существует
  const username = user1.username;
  //URL
  const searchPath = "/auth/search/?name=" + username;
  //Запрос
  const resSearch = await request(app).get(searchPath);
  //Запрос успешен
  expect(resSearch.statusCode).toBe(200);
  //Нужный пользователь с данным username
  const user = { username: username };
  //Пользователь с именем test есть
  expect(resSearch.body.user).toEqual(
    expect.arrayContaining([expect.objectContaining(user)])
  );

  //То, что посылаем с post
  const settings = {
    userId: user2.id,
    username: username,
    password: "",
    newpass: "",
    checkpass: "",
    text: "",
    city: "",
    base64: "",
  };
  //Путь
  const settingsPath = "/settings";
  //Запрос
  const resSettings = await request(app).post(settingsPath).send(settings);
  //Ошибка
  expect(resSettings.statusCode).toBe(400);
  //Текст ошибки
  //ТК данные не поменялись, то ничего и не убираем после
  expect(resSettings.body.message).toBe("Логин занят. Выберите другой");
});

//Проверка связи между пользователем и комментариями на стороне сервера
test("Checking the connection between the user and comments", async () => {
  //Проверка на комментарии 1
  const postId = post.id;
  //URL
  const postCommentsPath = "/post/comments?id=" + postId;

  await Comment.deleteMany({});
  await Post.updateOne({ _id: post.id }, { $set: { comments: [] } });
  const postComments = await request(app).get(postCommentsPath);
  //Нет комментариев
  expect(postComments.statusCode).toBe(200);
  expect(postComments.body.total.length).toBe(0);

  const userId2 = user2.id;
  const commentText2 = "Test 2";
  const addComment2 = await request(app).post("/post/comments").query({
    postId: postId,
    userId: userId2,
    comment: commentText2,
  });

  expect(addComment2.statusCode).toBe(201);
  expect(addComment2.body.message).toBe("Успешно созданный комментарий");

  const userId1 = user1.id;
  const commentText1 = "Test 1";
  const addComment1 = await request(app).post("/post/comments").query({
    postId: postId,
    userId: userId1,
    comment: commentText1,
  });

  expect(addComment1.statusCode).toBe(201);
  expect(addComment1.body.message).toBe("Успешно созданный комментарий");

  const finalPostComments = await request(app).get(postCommentsPath);
  expect(finalPostComments.statusCode).toBe(200);
  expect(finalPostComments.body.total.length).toBe(2);
  expect(finalPostComments.body.total[0].user).toBe(user1.username);
  expect(finalPostComments.body.total[0].comment).toBe(commentText1);
  expect(finalPostComments.body.total[1].user).toBe(user2.username);
  expect(finalPostComments.body.total[1].comment).toBe(commentText2);
  await Comment.deleteMany({});
  await Post.updateOne({ _id: post.id }, { $set: { comments: [] } });
});

//Проверка связи между пользователем и подписками на стороне сервера
test("Checking the connection between user and subscriptions", async () => {
  //Проверка на 1 запрос подписок
  const id = user1.id;
  //URL
  const subPath = "/post/subscription/?id=" + id;
  //Запрос
  const resSubOne = await request(app).get(subPath);
  //Ошибка - "Нет подписок"
  expect(resSubOne.statusCode).toBe(400);
  expect(resSubOne.body.message).toBe("Нет подписок");

  const id2 = user2.id;
  //URL
  const authSubPath = "/auth/subscribe";
  //Запрос
  const resAuthSubOne = await request(app)
    .post(authSubPath)
    .send({
      params: {
        userId: id,
        subscribe: id2,
      },
    });
  //Успех - 'Изменение состояние подписки одного пользователя на другого'
  expect(resAuthSubOne.statusCode).toBe(201);
  expect(resAuthSubOne.body.message).toBe(
    "Изменение состояние подписки одного пользователя на другого"
  );

  //Запрос
  const resSubTwo = await request(app).get(subPath);
  //Ошибка - "Нет подписок"
  expect(resSubTwo.statusCode).toBe(400);
  expect(resSubTwo.body.message).toBe("Нет опубликованных фотографий");

  //После отработки теста, возвращаем данные обратно, тк они поменялись
  await User.updateOne({ _id: id }, { $pull: { subscriptions: id2 } });
});

//Проверка связи между пользователем и подписками на стороне сервера
test("Checking the connection between user and popular page on the server side", async () => {
  //Популярное 1
  const user = user2.id;
  //URL
  const popularPath = "/post/popular?id=" + user;
  const postPopular1 = await request(app).get(popularPath);
  //Нет постов
  expect(postPopular1.statusCode).toBe(400);
  expect(postPopular1.body.message).toBe("Фотографий в городе нет");

  //Меняем настройки
  const settings = {
    userId: user,
    username: "",
    password: "",
    newpass: "",
    checkpass: "",
    text: "",
    city: post.city,
    base64: "",
  };
  const settingsPath = "/settings";
  const resSettings = await request(app).post(settingsPath).send(settings);
  expect(resSettings.statusCode).toBe(201);
  expect(resSettings.body.message).toBe("Настройки изменены");

  //3 запрос
  const postPopular2 = await request(app).get(popularPath);
  expect(postPopular2.statusCode).toBe(200);
  expect(postPopular2.body.popular.length).toBeGreaterThanOrEqual(1);

  //Обратно
  await User.updateOne({ _id: user }, { $set: { city: user2.city } });
});
