/**
 * @jest-environment node
 */

/*
  Должно быть:
  User
  по умолчанию:
  1. test - test - Москва
  2. tessi - tessi - Красноярск
  //----При необходимости добавить, но привести к первоночальному варианту----


  Города:
  1. Москва
  2. Красноярск



*/

import { app } from "../app.js";
import request from "supertest";
import mongoose from "mongoose";
import User from "../models/User"

beforeEach(async () => {
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
test("Checking the connection between users and changing settings", async () => {

  //Проверка на то, что user с test существует
  const username = "test";
  //URL
  const searchPath = "/auth/search/?name=" + username;
  //Запрос
  const resSearch = await request(app).get(searchPath);
  //запрос успешен
  expect(resSearch.statusCode).toBe(200);
  //Нужный пользователь с данным username
  //Переделать если будет другой id
  const user = { id: "641a06240f9a67fef8978340", username: username };

  //пользователь с именем test есть
  expect(resSearch.body.user).toContainEqual(user);

  const settings = {
    userId: "641a0989c55304c0d7de669c",
    username: "test",
    password: "",
    newpass: "",
    checkpass: "",
    text: "",
    city: "",
    base64: "",
  };
  const settingsPath = "/settings"
  const resSettings = await request(app).post(settingsPath).send(settings);
  //Ошибка
  expect(resSettings.statusCode).toBe(400);
  //Текст
  expect(resSettings.body.message).toBe("Логин занят. Выберите другой");
});

//19 сценарий - позитивный
//Проверка связи между пользователем и подписками на стороне сервера
test("Checking the connection between the user and subscriptions on the server side", async () => {

  //Проверка на 1 запрос подписок
  const id = "641a06240f9a67fef8978340";
  //URL
  const subPath = "/post/subscription/?id=" + id;
  //Запрос
  const resSubOne = await request(app).get(subPath);
  //Ошибка - "Нет подписок"
  expect(resSubOne.statusCode).toBe(400);
  expect(resSubOne.body.message).toBe("Нет подписок");


  const id2 = "641a0989c55304c0d7de669c";
  //URL
  const authSubPath = "/auth/subscribe";
  //Запрос
  const resAuthSubOne = await request(app).post(authSubPath).send({params: {
    userId: id,
    subscribe: id2
  }});
  //Успех - 'Изменение состояние подписки одного пользователя на другого'
  expect(resAuthSubOne.statusCode).toBe(201);
  expect(resAuthSubOne.body.message).toBe('Изменение состояние подписки одного пользователя на другого');

  //Запрос
  const resSubTwo = await request(app).get(subPath);
  //Ошибка - "Нет подписок"
  expect(resSubTwo.statusCode).toBe(400);
  expect(resSubTwo.body.message).toBe("Нет опубликованных фотографий");

  
  //Изменить?
  await User.updateOne({_id: id}, {$pull: {subscriptions: id2}})
  
});


