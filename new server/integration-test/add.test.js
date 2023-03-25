/**
 * @jest-environment node
 */

/*Дополнительный тест, расширение тествового набора*/

//Импортируем настройки app
import { app } from "../app.js";
import request from "supertest";
import mongoose from "mongoose";
import User from "../models/User";
import { user1, user2 } from "./database.js";

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

test("Add 1: Checking the connection between users and changing settings", async () => {
  const id = user1.id;
  //Запрос 1
  const subPath = "/auth/getSub?userId=" + id;
  const resSubOne = await request(app).get(subPath);
  expect(resSubOne.statusCode).toBe(404);
  expect(resSubOne.body.message).toBe("Нет подписок");

  //Запрос 2
  const id2 = user2.id;
  const authSubPath = "/auth/subscribe";
  const resAuthSubOne = await request(app)
    .post(authSubPath)
    .send({
      params: {
        userId: id,
        subscribe: id2,
      },
    });
  expect(resAuthSubOne.statusCode).toBe(201);
  expect(resAuthSubOne.body.message).toBe(
    "Изменение состояние подписки одного пользователя на другого"
  );

  //Запрос 3
  const resSubTwo = await request(app).get(subPath);
  //expect(resSubTwo.statusCode).toBe(200);
  expect(resSubTwo.body.message).toBe("Получены подписки");
  expect(resSubTwo.body.sub[0].id).toBe(id2);
  expect(resSubTwo.body.sub[0].username).toBe("tessi");

  await User.updateOne({ _id: id }, { $pull: { subscriptions: id2 } });
});
