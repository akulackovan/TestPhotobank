/**
 * @jest-environment node
 */

/*Проверка связи между пользователем и изменением состояния лайка у поста*/

//Импортируем настройки app
import { app } from "../app.js";
import request from "supertest";
import mongoose from "mongoose";
import User from "../models/User";
import Post from "../models/Post.js";
import { city1 } from "./database";

beforeEach(async () => {
  //Подключаемся к тестовой базе данных mongoDB, DB Photobank - тестовая
  await mongoose.connect(
    `mongodb+srv://admin:admin@test.qidx0uu.mongodb.net/photobank`,
    { dbName: "photobank" }
  );
});

/* Closing database connection after each test. */
afterEach(async () => {
  await mongoose.connection.close();
});

test("Checking the connection between registration and search", async () => {
  const username = "adding";
  //Запрос 1
  const searchPath = "/auth/search?name=" + username;
  const resSearch = await request(app).get(searchPath);
  expect(resSearch.statusCode).toBe(400);
  expect(resSearch.body.message).toBe("Ничего не найдено");

  //Запрос 2
  const regPath = "/auth/reg";
  const resReg = await request(app).post(regPath).send({
    username: username,
    password: username,
    city: city1.id,
  });
  expect(resReg.statusCode).toBe(201);
  expect(resReg.body.message).toBe("Регистрация успешна");

  //Запрос 3
  const resSearch1 = await request(app).get(searchPath);
  expect(resSearch1.statusCode).toBe(200);
  expect(resSearch1.body.message).toBe("Профили пользователей");
  expect(resSearch1.body.user[0].username).toBe(username);

  await User.deleteOne({ username: username });
});
