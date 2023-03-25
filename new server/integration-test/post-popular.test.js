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
    { dbName: "photobank" }
  );
});

/* Closing database connection after each test. */
afterEach(async () => {
  await mongoose.connection.close();
});

test("Checking the connection between adding post and popular on the server side", async () => {
  //Популярное 1
  const user = user2.id;
  //URL
  const popularPath = "/post/popular?id=" + user2.id;
  const postPopular1 = await request(app).get(popularPath);
  //Нет постов
  expect(postPopular1.statusCode).toBe(400);
  expect(postPopular1.body.message).toBe("Фотографий в городе нет");

  //Добавляем пост
  const addPostPath = "/post/post";
  const addPostPopular1 = await request(app).post(addPostPath).send({
    city: user2.city,
    photo: "asfs",
    userId: user2.id,
  });
  expect(addPostPopular1.statusCode).toBe(201);
  expect(addPostPopular1.body.message).toBe("Успешно созданный пост");
  console.log(addPostPopular1.body);
  const postId = addPostPopular1.body.newPost._id;

  //3 запрос
  const postPopular2 = await request(app).get(popularPath);
  expect(postPopular2.statusCode).toBe(200);
  expect(postPopular2.body.popular.length).toBe(1);

  //Обратно
  await Post.deleteOne({ _id: postId });
});
