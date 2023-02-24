/**
 * @jest-environment node
 */

import mongoose from "mongoose";
import express from "express";
import request from "supertest";
import router from "../router/settings.js";
import dotenv from "dotenv";
import cors from "cors";
import { settings } from "../controllers/settings";

import User from "../models/User.js";

import City from "../models/City.js";

jest.mock("../models/User.js");
jest.mock("../models/City.js");

describe("POST /settings/ check find user", () => {
  it("Should find user with correct id", async () => {
    const userId = "63b94e63401cafbbf0be0a8d";
    const req = {
      body: {
        userId: userId,
        username: "",
        password: "",
        newpass: "",
        checkpass: "",
        text: "",
        city: "",
        base64: "",
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    User.findOne = jest.fn().mockResolvedValueOnce({});
    await settings(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Настройки изменены",
    });
  });

  it("Should not find user with uncorrect id", async () => {
    const userId = "41224d776a326fb40f000001";
    const req = {
      body: {
        userId: userId,
        username: "",
        password: "",
        newpass: "",
        checkpass: "",
        text: "",
        city: "",
        base64: "",
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    User.findOne = jest.fn().mockResolvedValueOnce(null);
    await settings(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Такого пользователя не существует.",
    });
  });
});

describe("POST /settings/ ", () => {
  const photo = "data:image/jpeg;base64,";
  const city = "63b9473e70bfa1abe160400f";
  const mockUser = {
    password: "$2a$10$tKPUw/TOTBHJU/BvrlYpautlQ8a1dxbkY/xyc0EtgSbmQzJSwxtoa",
  };
  const text = "122222222222222222222222222222222222222222222222222222222222222222222222xsssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss122222222222222222222222222222222222222222222222222222222222222222222222xsssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss122222222222222222222222222222222222222222222222222222222222222222222222xsssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss122222222222222222222222222222222222222222222222222222222222222222222222xsssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss122222222222222222222222222222222222222222222222222222222222222222222222xsssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss122222222222222222222222222222222222222222222222222222222222222222222222xsssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss122222222222222222222222222222222222222222222222222222222222222222222222xsssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss122222222222222222222222222222222222222222222222222222222222222222222222xsssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss"

  it("Should find empty password field with correct username and error in city", async () => {
    const userId = "63b94e63401cafbbf0be0a8d";
    const req = {
      body: {
        userId: userId,
        username: "ЕнвроывНЕроVGHsh",
        password: "",
        newpass: "тест",
        checkpass: "тест",
        text: "",
        city: "63b94e63401cafbbf0be0a8d",
        base64: photo,
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    User.findOne = jest.fn().mockResolvedValueOnce(mockUser);
    await settings(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Не все поля для изменения пароля введены",
    });
  });

  it("Should give an error stating that the login is busy with error in password", async () => {
    const userId = "63b94e63401cafbbf0be0a8d";
    const req = {
      body: {
        userId: userId,
        username: "акула",
        password: "",
        newpass: "",
        checkpass: "",
        text: "",
        city: city,
        base64: ""},
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    User.findOne = jest.fn().mockResolvedValue(mockUser);
    //User.findOne = jest.fn().mockResolvedValueOnce({username: "akula"});
    await settings(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Логин занят. Выберите другой",
    });
  });

  it("Should give an error stating that the login is busy with error in text", async () => {
    const userId = "63b94e63401cafbbf0be0a8d";
    const req = {
      body: {
        userId: userId,
        username: "тест",
        password: "тест",
        newpass: "тест",
        checkpass: "тест",
        text: text,
        city: city,
        base64: ""},
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    User.findOne = jest.fn().mockResolvedValue(mockUser);
    await settings(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Логин занят. Выберите другой",
    });
  });

  it("Should give an error stating that the login is busy with error in text and password", async () => {
    const userId = "63b94e63401cafbbf0be0a8d";
    const req = {
      body: {
        userId: userId,
        username: "тест",
        password: "тест",
        newpass: "тест",
        checkpass: "тестик",
        text: text,
        city: "",
        base64: photo},
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    User.findOne = jest.fn().mockResolvedValue(mockUser);
    await settings(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Логин занят. Выберите другой",
    });
  });

  it("Should give an error in password with empty other field", async () => {
    const userId = "63b94e63401cafbbf0be0a8d";
    const req = {
      body: {
        userId: userId,
        username: "",
        password: "",
        newpass: "",
        checkpass: "тестик",
        text: "",
        city: "",
        base64: ""},
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    User.findOne = jest.fn().mockResolvedValueOnce(mockUser);
    await settings(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Не все поля для изменения пароля введены",
    });
  });

  it("Should give an error in text with error in city and correct other field", async () => {
    const userId = "63b94e63401cafbbf0be0a8d";
    const req = {
      body: {
        userId: userId,
        username: "",
        password: "тест",
        newpass: "тест",
        checkpass: "тест",
        text: text,
        city: userId,
        base64: photo},
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    User.findOne = jest.fn().mockResolvedValueOnce(mockUser);
    await settings(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 
      "Описание пользователя содержит больше 512 символов."},
    );
  });

  it("Should give an error in text with error in city and correct other field", async () => {
    const userId = "63b94e63401cafbbf0be0a8d";
    const req = {
      body: {
        userId: userId,
        username: "",
        password: "тест",
        newpass: "тест",
        checkpass: "тест",
        text: text,
        city: userId,
        base64: photo},
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    User.findOne = jest.fn().mockResolvedValueOnce(mockUser);
    await settings(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 
      "Описание пользователя содержит больше 512 символов."},
    );
  });

  it("Should give an error in password with correct other field", async () => {
    const userId = "63b94e63401cafbbf0be0a8d";
    const req = {
      body: {
        userId: userId,
        username: "",
        password: "тест12",
        newpass: "",
        checkpass: "тест",
        text: "Это тест",
        city: city,
        base64: ""},
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    User.findOne = jest.fn().mockResolvedValueOnce(mockUser);
    await settings(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Не все поля для изменения пароля введены",
    });
  });

  it("Should give an error in password with correct photo and empty other field", async () => {
    const userId = "63b94e63401cafbbf0be0a8d";
    const req = {
      body: {
        userId: userId,
        username: "",
        password: "",
        newpass: "тест",
        checkpass: "тест",
        text: "",
        city: "",
        base64: photo},
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    User.findOne = jest.fn().mockResolvedValueOnce(mockUser);
    await settings(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Не все поля для изменения пароля введены",
    });
  });

  it("Should give an error in password with empty photo and uncorrect other field", async () => {
    const userId = "63b94e63401cafbbf0be0a8d";
    const req = {
      body: {
        userId: userId,
        username: "",
        password: "тест",
        newpass: "",
        checkpass: "тест",
        text: text,
        city: userId,
        base64: ""},
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    User.findOne = jest.fn().mockResolvedValueOnce(mockUser);
    await settings(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Не все поля для изменения пароля введены",
    });
  });

  it("Should give an error in uncorrect password for user with correct other field", async () => {
    const userId = "63b94e63401cafbbf0be0a8d";
    const req = {
      body: {
        userId: userId,
        username: "",
        password: "тест1122",
        newpass: "тест",
        checkpass: "тест",
        text: "Это тест",
        city: city,
        base64: photo},
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    User.findOne = jest.fn().mockResolvedValueOnce(mockUser);
    await settings(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Неверный пароль.",
    });
  });

  it("Should give an error in password with uncorrect text and correct other field with change login", async () => {
    const userId = "63b94e63401cafbbf0be0a8d";
    const req = {
      body: {
        userId: userId,
        username: "тест3333",
        password: "тест",
        newpass: "",
        checkpass: "",
        text: text,
        city: city,
        base64: ""},
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    User.findOne = jest.fn().mockResolvedValueOnce(mockUser);
    await settings(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Не все поля для изменения пароля введены",
    });
  });

  it("Should give an error in uncorrect password with correct other field", async () => {
    const userId = "63b94e63401cafbbf0be0a8d";
    const req = {
      body: {
        userId: userId,
        username: "тест3333",
        password: "тест122",
        newpass: "тест",
        checkpass: "тест1222",
        text: "Это тест",
        city: "",
        base64: photo},
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    User.findOne = jest.fn().mockResolvedValueOnce(mockUser);
    await settings(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Неверный пароль.",
    });
  });

  it("Should give an error in city with correct other field", async () => {
    const userId = "63b94e63401cafbbf0be0a8d";
    const req = {
      body: {
        userId: userId,
        username: "тест3333",
        password: "",
        newpass: "",
        checkpass: "",
        text: "",
        city: userId,
        base64: ""},
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    User.findOne = jest.fn().mockResolvedValueOnce(mockUser);
    City.findOne = jest.fn().mockResolvedValueOnce(null);
    await settings(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Такого города нет",
    });
  });

  it("Should give an error different password with uncorrect text", async () => {
    const userId = "63b94e63401cafbbf0be0a8d";
    const req = {
      body: {
        userId: userId,
        username: "тест3333",
        password: "тест",
        newpass: "тест",
        checkpass: "тесттпро",
        text: text,
        city: city,
        base64: photo},
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    User.findOne = jest.fn().mockResolvedValueOnce(mockUser);
    await settings(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Пароли не совпадают.",
    });
  });

  it("Should give an error empty password with correct and empty other fields", async () => {
    const userId = "63b94e63401cafbbf0be0a8d";
    const req = {
      body: {
        userId: userId,
        username: "тест3333",
        password: "тест111",
        newpass: "",
        checkpass: "",
        text: "Тест",
        city: "",
        base64: ""},
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    User.findOne = jest.fn().mockResolvedValueOnce(mockUser);
    await settings(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Не все поля для изменения пароля введены",
    });
  });

  it("Should give an error empty password with uncorrect city and correct other fields", async () => {
    const userId = "63b94e63401cafbbf0be0a8d";
    const req = {
      body: {
        userId: userId,
        username: "тест3333",
        password: "",
        newpass: "тест",
        checkpass: "тест123",
        text: "Тест",
        city: userId,
        base64: photo},
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    User.findOne = jest.fn().mockResolvedValueOnce(mockUser);
    await settings(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Не все поля для изменения пароля введены",
    });
  });

  it("Should give an error in busy login with uncorrect password and uncorrect other fields", async () => {
    const userId = "63b94e63401cafbbf0be0a8d";
    const req = {
      body: {
        userId: userId,
        username: "тест",
        password: "тестпрпор",
        newpass: "",
        checkpass: "тест123",
        text: "Тест",
        city: userId,
        base64: ""},
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    User.findOne = jest.fn().mockResolvedValue(mockUser);
    await settings(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Логин занят. Выберите другой",
    });
  });

  it("Should give an error in busy login with empty password and uncorrect other fields", async () => {
    const userId = "63b94e63401cafbbf0be0a8d";
    const req = {
      body: {
        userId: userId,
        username: "тест",
        password: "",
        newpass: "тест",
        checkpass: "тест",
        text: "",
        city: city,
        base64: photo},
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    User.findOne = jest.fn().mockResolvedValue(mockUser);
    await settings(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Логин занят. Выберите другой",
    });
  });

  it("Should give an error in busy login with empty password and uncorrect text", async () => {
    const userId = "63b94e63401cafbbf0be0a8d";
    const req = {
      body: {
        userId: userId,
        username: "тест",
        password: "тест",
        newpass: "",
        checkpass: "тест123",
        text: text,
        city: "",
        base64: ""},
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    User.findOne = jest.fn().mockResolvedValue(mockUser);
    await settings(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Логин занят. Выберите другой",
    });
  });

  it("Should give an error in busy login with empty password and uncorrect city", async () => {
    const userId = "63b94e63401cafbbf0be0a8d";
    const req = {
      body: {
        userId: userId,
        username: "тест",
        password: "тест123",
        newpass: "тест",
        checkpass: "тест",
        text: "Это тест",
        city: userId,
        base64: ""},
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    User.findOne = jest.fn().mockResolvedValue(mockUser);
    await settings(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Логин занят. Выберите другой",
    });
  });

  it("Should give an error in busy login with wrong check password", async () => {
    const userId = "63b94e63401cafbbf0be0a8d";
    const req = {
      body: {
        userId: userId,
        username: "тест",
        password: "",
        newpass: "",
        checkpass: "тест11",
        text: "",
        city: city,
        base64: ""},
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    User.findOne = jest.fn().mockResolvedValue(mockUser);
    await settings(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Логин занят. Выберите другой",
    });
  });

  it("Should give an error in busy login with wrong text", async () => {
    const userId = "63b94e63401cafbbf0be0a8d";
    const req = {
      body: {
        userId: userId,
        username: "тест",
        password: "тест",
        newpass: "тест",
        checkpass: "тест",
        text: text,
        city: "",
        base64: photo},
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    User.findOne = jest.fn().mockResolvedValue(mockUser);
    await settings(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Логин занят. Выберите другой",
    });
  });

  //2

  it("Should return 201 when all empty", async () => {
    const userId = "63b94e63401cafbbf0be0a8d";
    const req = {
      body: {
        userId: userId,
        username: "",
        password: "",
        newpass: "",
        checkpass: "",
        text: "",
        city: city,
        base64: ""},
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    User.findOne = jest.fn().mockResolvedValueOnce(mockUser);
    City.findOne = jest.fn().mockResolvedValueOnce({});
    await settings(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Настройки изменены",
    });
  });

  it("Should return 201 and change user when login is empty", async () => {
    const userId = "63b94e63401cafbbf0be0a8d";
    const req = {
      body: {
        userId: userId,
        username: "",
        password: "тест",
        newpass: "тест",
        checkpass: "тест",
        text: "Это тест",
        city: city,
        base64: photo},
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    User.findOne = jest.fn().mockResolvedValueOnce(mockUser);
    City.findOne = jest.fn().mockResolvedValueOnce({});
    
    await settings(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Настройки изменены",
    });
  });

  it("Should return 201 and change user when text and photo is empty", async () => {
    const userId = "63b94e63401cafbbf0be0a8d";
    const req = {
      body: {
        userId: userId,
        username: "тест6",
        password: "тест",
        newpass: "тест",
        checkpass: "тест",
        text: "",
        city: city,
        base64: ""},
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    User.findOne = jest.fn().mockResolvedValueOnce(mockUser);
    City.findOne = jest.fn().mockResolvedValueOnce({});
    
    await settings(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Настройки изменены",
    });
  });

  it("Should return 201 and change user when password and city is empty", async () => {
    const userId = "63b94e63401cafbbf0be0a8d";
    const req = {
      body: {
        userId: userId,
        username: "тест",
        password: "",
        newpass: "",
        checkpass: "",
        text: "",
        city: "",
        base64: photo},
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    User.findOne = jest.fn().mockResolvedValueOnce(mockUser);
    await settings(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Настройки изменены",
    });
  });
});
