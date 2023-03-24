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
import { user1 } from "./database.js"
import { user2 } from "./database.js"


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
  await User.updateOne({ _id: id }, { $pull: { subscriptions: id2 } });
});

