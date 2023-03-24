/**
 * @jest-environment node
 */

import { app } from "../app.js";
import request from "supertest";
import mongoose from "mongoose";
import User from "../models/User";
import Comment from "../models/Comment";
import Post from "../models/Post";

const user1 = {
  id: "641a06240f9a67fef8978340",
  username: "test",
  city: "641a05b85f099a95d1e261a0",
};
const user2 = {
  id: "641a0989c55304c0d7de669c",
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
  await mongoose.connect(
    `mongodb+srv://admin:admin@test.qidx0uu.mongodb.net/photobank`,
    { dbName: "photobank" }
  );
});

/* Closing database connection after each test. */
afterEach(async () => {
  await mongoose.connection.close();
});

// This is a test to check the connection between the user and popular subscription on the server side.
test("20: Checking the connection between user and popular on the server side", async () => {
  // Select the user to test the connection
  const user = user2.id;
  // Set the popular subscription URL with the user ID
  const popularPath = "/post/popular?id=" + user;
  // Make a request to the popular subscription URL to get posts
  const postPopular1 = await request(app).get(popularPath);
  // Check if there are no posts available for the user
  expect(postPopular1.statusCode).toBe(400);
  expect(postPopular1.body.message).toBe("Фотографий в городе нет");

  // Change the user's settings to get more posts
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

  // Check if the settings have been successfully updated
  expect(resSettings.statusCode).toBe(201);
  expect(resSettings.body.message).toBe("Настройки изменены");

  // Make another request to the popular subscription URL to get more posts
  const postPopular2 = await request(app).get(popularPath);

  // Check if there are at least one post available for the user
  expect(postPopular2.statusCode).toBe(200);
  expect(postPopular2.body.popular.length).toBeGreaterThanOrEqual(1);

  // Change the user's settings back to the original state
  await User.updateOne({ _id: user }, { $set: { city: user2.city } });
});
