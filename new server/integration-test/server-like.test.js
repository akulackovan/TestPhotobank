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
import {user1, user2, post} from "./database"

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


test("Add 1: Checking the connection between users and changing like", async () => {
  const userId = user1.id
  const postId = post.id

  //Запрос 1
  const profilePath = "/auth/profile?userId=" + userId;
  const resProfile = await request(app).get(profilePath);
  expect(resProfile.statusCode).toBe(201);
  expect(resProfile.body.message).toBe("Профиль успешен");
  expect(resProfile.body.user.likes).not.toContain(postId)
  const firstValueOfPostLike = resProfile.body.user.likes

  //Запрос 2
  const postPath = "/post/post/id?id=" + postId;
  const resPost = await request(app).get(postPath);
  expect(resPost.statusCode).toBe(200);
  expect(resPost.body.message).toBe("Пост получен");
  expect(resPost.body.isPost._id).toBe(postId)
  const firstValueOfLikes = resPost.body.isPost.likes
  expect(firstValueOfLikes).toBeGreaterThanOrEqual(0)

  //Запрос 3
  const getLikePath = "/post/getLike?idUser=" + userId + "&idPost="+postId;
  const resGetLike = await request(app).get(getLikePath);
  expect(resGetLike.statusCode).toBe(200);
  expect(resGetLike.body.message).toBe("Лайк получен");
  expect(resGetLike.body.like).toBe(false);

  //Запрос 4
  const setLikePath = "/post/setLike?idUser=" + userId + "&idPost="+postId;
  const resSetLike = await request(app).put(setLikePath);
  expect(resSetLike.statusCode).toBe(200);
  expect(resSetLike.body.message).toBe("Лайк изменен");
  expect(resSetLike.body.like).toBe(true);

  //Запрос 5
  const resGetLike2 = await request(app).get(getLikePath);
  expect(resGetLike2.statusCode).toBe(200);
  expect(resGetLike2.body.message).toBe("Лайк получен");
  expect(resGetLike2.body.like).toBe(true);

  //Запрос 6
  const resProfile2 = await request(app).get(profilePath);
  expect(resProfile2.statusCode).toBe(201);
  expect(resProfile2.body.message).toBe("Профиль успешен");
  expect(resProfile2.body.user.likes).toContain(postId)

  //Запрос 7
  const resPost2 = await request(app).get(postPath);
  expect(resPost2.statusCode).toBe(200);
  expect(resPost2.body.message).toBe("Пост получен");
  expect(resPost2.body.isPost._id).toBe(postId)
  expect(resPost2.body.isPost.likes).toBe(firstValueOfLikes + 1)

  await User.updateOne({ _id: userId },  { likes: firstValueOfPostLike });
  await Post.updateOne({_id: postId}, {likes: firstValueOfLikes})
});

