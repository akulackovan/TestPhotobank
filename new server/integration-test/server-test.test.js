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
import {app} from "../app.js";
import request from "supertest";
import mongoose from "mongoose";
import User from "../models/User";
import Comment from "../models/Comment";
import Post from "../models/Post";

const user1 = {
  id: "641de3cb94ae5238b2ce1b12",
  username: "test",
  city: "641a05b85f099a95d1e261a0",
};
const user2 = {
  id: "641de507eb5f99ce0e215de5",
  username: "tessi",
  city: "641a09655f099a95d1e261a3",
};
const post = {
  id: "641c9a9ae23b02867f76d766",
  author: "641a06240f9a67fef8978340",
  city: "641a05b85f099a95d1e261a0",
};

const city1 = {
  id: "641a05b85f099a95d1e261a0",
  city: "Москва",
};

const city2 = {
  id: "641a09655f099a95d1e261a3",
  city: "Красноярск",
};

beforeEach(async () => {
  //Подключаемся к тетовой базе данных mongoDB, DB Photobank - тестовая
  await mongoose.connect(
    `mongodb+srv://admin:admin@test.qidx0uu.mongodb.net/photobank`,
    {dbName: "photobank"}
  );
});

/* Closing database connection after each test. */
afterEach(async () => {
  await mongoose.connection.close();
});

//17 сценарий - негативный
//Проверка связи между пользователем и изменением настроек
test("17: Checking the connection between users and changing settings", async () => {
  //Проверка на то, что user с test существует
  const username = user1.username;
  //URL
  const searchPath = "/auth/search/?name=" + username;
  //Запрос
  const resSearch = await request(app).get(searchPath);
  //Запрос успешен
  expect(resSearch.statusCode).toBe(200);
  //Нужный пользователь с данным username
  const user = {username: username};
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

//19 сценарий - позитивный
//Проверка связи между пользователем и подписками на стороне сервера
test("19: Checking the connection between adding comments and post", async () => {
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
  await User.updateOne({_id: id}, {$pull: {subscriptions: id2}});
});

//21 сценарий - позитивный
//Проверка связи между добавлением поста и популярным
test("21: Checking the connection between adding post and popular on the server side", async () => {
  //Популярное 1
  const user = user2.id;
  //URL
  const popularPath = "/post/popular?id=" + user2.id
  const postPopular1 = await request(app).get(popularPath);
  //Нет постов
  expect(postPopular1.statusCode).toBe(400);
  expect(postPopular1.body.message).toBe("Фотографий в городе нет");

  //Добавляем пост
  const addPostPath = "/post/post"
  const addPostPopular1 = await request(app)
    .post(addPostPath)
    .send({
      city: user2.city,
      photo: "asfs",
      userId: user2.id,
    });
  expect(addPostPopular1.statusCode).toBe(201)
  expect(addPostPopular1.body.message).toBe("Успешно созданный пост")
  console.log(addPostPopular1.body)
  const postId = addPostPopular1.body.newPost._id

  //3 запрос
  const postPopular2 = await request(app).get(popularPath);
  expect(postPopular2.statusCode).toBe(200);
  expect(postPopular2.body.popular.length).toBe(1);

  //Обратно
  await Post.deleteOne({_id:postId})
});

