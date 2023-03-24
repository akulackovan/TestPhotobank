/**
 * @jest-environment node
 */

//Импортируем настройки app
import { app } from "../app.js";
import request from "supertest";
import mongoose from "mongoose";
import User from "../models/User";
import { user1 } from "./database.js";

beforeEach(async () => {
  await mongoose.connect(
    `mongodb+srv://admin:admin@test.qidx0uu.mongodb.net/photobank`,
    { dbName: "photobank" }
  );
});

afterEach(async () => {
  await mongoose.connection.close();
});

//10 сценарий - позитивный
test("10: Checking the connection of changing the user password in settings and user login", async () => {
  //Поиск пользователя из DB и его сохранение
  const user = await User.findById(user1.id);
  const oldpass = user.password;

  const newpass = "testpassword";
  const settings = {
    userId: user1.id,
    username: "",
    password: user1.username,
    newpass: newpass,
    checkpass: newpass,
    text: "",
    city: "",
    base64: "",
  };
  //Запрос 1
  const settingsPath = "/settings";
  const resSettings = await request(app).post(settingsPath).send(settings);
  expect(resSettings.statusCode).toBe(201);
  expect(resSettings.body.message).toBe("Настройки изменены");

  //Запрос 2
  const loginPath = "/auth/login";
  const resLogin1 = await request(app).post(loginPath).send({
    username: user1.username,
    password: user1.password,
  });
  expect(resLogin1.statusCode).toBe(401);
  expect(resLogin1.body.message).toBe("Неверный пароль");
  const user2 = await User.findById(user1.id);
  //Сравнение
  expect(user2.password).not.toBe(oldpass);

  await User.updateOne({ _id: user1.id }, { password: oldpass });
});
