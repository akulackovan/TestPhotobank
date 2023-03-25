/**
 * @jest-environment node
 */

//Импортируем настройки app
import { app } from "../app.js";
import request from "supertest";
import mongoose from "mongoose";
import Post from "../models/Post.js";
import { user2, city1 } from "./database.js";

beforeEach(async () => {
  await mongoose.connect(
    `mongodb+srv://admin:admin@test.qidx0uu.mongodb.net/photobank`,
    { dbName: "photobank" }
  );
});

afterEach(async () => {
  await mongoose.connection.close();
});


test("Checking the connection of adding and getting the post", async () => {
  //Запрос 1
  const getByIdPath = "/post/getMe/?id=" + user2.id;
  const resGetPost = await request(app).get(getByIdPath);
  expect(resGetPost.statusCode).toBe(400);
  expect(resGetPost.body.message).toBe("Фото нет");

  //Запрос 2
  const addPostPath = "/post/post";
  const resAddPost = await request(app).post(addPostPath).send({
    city: city1.id,
    photo: "photo.png",
    userId: user2.id,
  });
  expect(resAddPost.statusCode).toBe(201);
  expect(resAddPost.body.message).toBe("Успешно созданный пост");

  //Запрос 3
  const resGetPost2 = await request(app).get(getByIdPath);
  expect(resGetPost2.statusCode).toBe(200);
  expect(resGetPost2.body.message).toBe("Посты пользователя получены");
  expect(resGetPost2.body.isPost.length).toBe(1);
  await Post.deleteOne({ author: user2.id });
});
