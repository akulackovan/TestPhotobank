/**
 * @jest-environment node
 */

import mongoose from "mongoose";
import express from "express";
import request from 'supertest';
import router from './router/auth.js';
import dotenv from 'dotenv'
import cors from 'cors'
import Post from "./models/User.js"
import {getAnother, getMe, register, search, subscibe} from "./controllers/auth.js";
import {login} from "./controllers/auth.js";
import User from "./models/User.js";
import City from "./models/City.js";

const httpMocks = require('node-mocks-http');

jest.mock("./models/User.js")

describe("POST /auth/reg", () => {
    /* Каждый раз присоединяемся к БД */
    beforeEach(async () => {
        await mongoose.connect(
            `mongodb+srv://admin:admin@test.qidx0uu.mongodb.net/?retryWrites=true&w=majority`
        );
        dotenv.config()
    })

    /* Закрываем БД */
    afterEach(async () => {
        await mongoose.connection.close();
    });


    it("3 empty fields", async () => {
       const req = {body: {username: "", password: "", city: ""}}
       User.findOne = jest.fn().mockResolvedValue()
        const res = {}
        res.status = jest.fn().mockReturnValue(res)
        res.json = jest.fn().mockReturnValue(res)
       await register(req, res);
       expect(res.status).toHaveBeenCalledWith(400);
       expect(res.json).toHaveBeenCalledWith({
           message: "Заполнены не все поля"
       })
    });

    it("2 empty fields but username", async () => {
        const req = {body: {username: "adara", password: "", city: ""}}
        const res = {}
        res.status = jest.fn().mockReturnValue(res)
        res.json = jest.fn().mockReturnValue(res)
        await register(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: "Заполнены не все поля"
        })
    });

    it("2 empty fields but password", async () => {
        const req = {body: {username: "", password: "123456", city: ""}}
        const res = {}
        res.status = jest.fn().mockReturnValue(res)
        res.json = jest.fn().mockReturnValue(res)
        await register(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: "Заполнены не все поля"
        })
    });

    it("2 empty fields but city", async () => {
        const req = {body: {username: "", password: "", city: "63b9473e70bfa1abe160400f"}}
        const res = {}
        res.status = jest.fn().mockReturnValue(res)
        res.json = jest.fn().mockReturnValue(res)
        await register(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: "Заполнены не все поля"
        })
    });

    it("empty password", async () => {
        const req = {body: {username: "adara", password: "", city: "63b9473e70bfa1abe160400f"}}
        const res = {}
        res.status = jest.fn().mockReturnValue(res)
        res.json = jest.fn().mockReturnValue(res)
        await register(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: "Заполнены не все поля"
        })
    });

    it("empty username", async () => {
        const req = {body: {username: "", password: "123456", city: "63b9473e70bfa1abe160400f"}}
        const res = {}
        res.status = jest.fn().mockReturnValue(res)
        res.json = jest.fn().mockReturnValue(res)
        await register(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: "Заполнены не все поля"
        })
    });

    it("empty city", async () => {
        const req = {body: {username: "dada", password: "1235", city: ""}}
        const res = {}
        res.status = jest.fn().mockReturnValue(res)
        res.json = jest.fn().mockReturnValue(res)
        await register(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: "Заполнены не все поля"
        })
    });

    afterEach(() => {
        jest.resetAllMocks();
    });
     const mockedUser = {
         _id: 'someid',
         username: "тест"
     }
    it("used username", async () => {
        const req = {body: {username: "тест", password: "1235", city: "63b9473e70bfa1abe160400f"}}
        User.findOne = jest.fn().mockResolvedValue(mockedUser);
        const res = {}
        res.status = jest.fn().mockReturnValue(res)
        res.json = jest.fn().mockReturnValue(res)
        await register(req, res);
        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({
            message: "Логин занят. Выберите другой!"
        })
    });

    it("unexisting city", async () => {
        const req = {body: {username: "jhvbksbkfvsfbv", password: "1235", city: "00b9473e70bfa1abe160400f"}}
        const res = {}
        res.status = jest.fn().mockReturnValue(res)
        res.json = jest.fn().mockReturnValue(res)
        await register(req, res);
        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({
            message: "Такого города нет"
        })
    });

    it("successful", async () => {
        const req = {body: {username: "тест", password: "1235", city: "63b9473e70bfa1abe160400f"}}
        const res = {}
        res.status = jest.fn().mockReturnValue(res)
        res.json = jest.fn().mockReturnValue(res)
        await register(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining(
            {'message': 'Регистрация успешна'}))
    });
});

describe("POST /auth/login", () => {
    /* Каждый раз присоединяемся к БД */
    beforeEach(async () => {
        await mongoose.connect(
            `mongodb+srv://admin:admin@test.qidx0uu.mongodb.net/?retryWrites=true&w=majority`
        );
        dotenv.config()
    })

    /* Закрываем БД */
    afterEach(async () => {
        await mongoose.connection.close();
    });


    it("Wrong user", async () => {
        const req = {body: {username: "тест", password: "156",}}
        const res = {}
        res.status = jest.fn().mockReturnValue(res)
        res.json = jest.fn().mockReturnValue(res)
        await login(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: "Такого пользователя не существует."
        })
    });

    afterEach(() => {
        jest.resetAllMocks();
    });
    const mockedUser = {
        _id: 'someid',
        username: "тест",
        password: "$2a$10$Mrwv/0gpEKlhi2To03IzyeMjfUKxUJ6TjhZDhhHkYBf/Yua8X1dmW"
    }

    it("Wrong password", async () => {
        const req = {body: {username: "тест", password: "16661",}}
        User.findOne = jest.fn().mockResolvedValue(mockedUser);
        const res = {}
        res.status = jest.fn().mockReturnValue(res)
        res.json = jest.fn().mockReturnValue(res)
        await login(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: "Неверный пароль."
        })
    });

    it("successful", async () => {
        const req = {body: {username: "тест", password: "тест",}}
        User.findOne = jest.fn().mockResolvedValue(mockedUser);
        const res = {}
        res.status = jest.fn().mockReturnValue(res)
        res.json = jest.fn().mockReturnValue(res)
        await login(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: "Успешный вход в систему."
        }))
    });
});

describe("GET /auth/user", () => {
    /* Каждый раз присоединяемся к БД */
    beforeEach(async () => {
        await mongoose.connect(
            `mongodb+srv://admin:admin@test.qidx0uu.mongodb.net/?retryWrites=true&w=majority`
        );
        dotenv.config()
    })

    /* Закрываем БД */
    afterEach(async () => {
        await mongoose.connection.close();
    });


    it("No users at all", async () => {
        const req = {query: {myId: "тест", userId: "156",}}
        const res = {}
        res.status = jest.fn().mockReturnValue(res)
        res.json = jest.fn().mockReturnValue(res)
        await getAnother(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: "Такого пользователя не существует."
        })
    });

    afterEach(() => {
        jest.resetAllMocks();
    });
    const mockedUser ={
        _id: '63b94e63401cafbbf0be0a8d',
        username: "тест",
        subscriptions: "someId",
        password: "$2a$10$Mrwv/0gpEKlhi2To03IzyeMjfUKxUJ6TjhZDhhHkYBf/Yua8X1dmW"
    }
    const mockedUser2 = {
        _id: 'someId',
        city: "63b9473e70bfa1abe160400f",
        username: "тест",
        password: "$2a$10$Mrwv/0gpEKlhi2To03IzyeMjfUKxUJ6TjhZDhhHkYBf/Yua8X1dmW"
    }

    const city ={
        _id: "63b9473e70bfa1abe160400f",
        city: "Москва"
    }

    it("Wrong user", async () => {
        const req = {query: {myId: "63b94e63401cafbbf0be0a8d", userId: "156",}}
        User.findOne = jest.fn().mockResolvedValue(null);
        const res = {}
        res.status = jest.fn().mockReturnValue(res)
        res.json = jest.fn().mockReturnValue(res)
        await getAnother(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: "Такого пользователя не существует."
        })
    });

    it("success", async () => {
        const req = {query: {myId: "63b94e63401cafbbf0be0a8d", userId: "someId",}}
        User.findOne = jest.fn().mockResolvedValue(mockedUser2);
        User.find = jest.fn().mockResolvedValue(mockedUser);
        City.findOne = jest.fn().mockResolvedValue(city);
        const res = {}
        res.status = jest.fn().mockReturnValue(res)
        res.json = jest.fn().mockReturnValue(res)
        await getAnother(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: "Профиль успешен =)"
        }))
    });

});

describe("GET /auth/profile", () => {
    /* Каждый раз присоединяемся к БД */
    beforeEach(async () => {
        await mongoose.connect(
            `mongodb+srv://admin:admin@test.qidx0uu.mongodb.net/?retryWrites=true&w=majority`
        );
        dotenv.config()
    })

    /* Закрываем БД */
    afterEach(async () => {
        await mongoose.connection.close();
    });


    it("Wrong user", async () => {
        const req = {query: {myId: "тест", userId: "156",}}
        User.findOne = jest.fn().mockResolvedValue(null);
        const res = {}
        res.status = jest.fn().mockReturnValue(res)
        res.json = jest.fn().mockReturnValue(res)
        await getMe(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: "Такого пользователя не существует."
        })
    });

    afterEach(() => {
        jest.resetAllMocks();
    });
    const mockedUser = {
        _id: '63b94e63401cafbbf0be0a8d',
        username: "тест",
        subscriptions: "someId",
        password: "$2a$10$Mrwv/0gpEKlhi2To03IzyeMjfUKxUJ6TjhZDhhHkYBf/Yua8X1dmW"
    }

    it("success", async () => {
        const req = {query: {myId: "тест", userId: "156",}}
        User.findOne = jest.fn().mockResolvedValue(mockedUser);
        const res = {}
        res.status = jest.fn().mockReturnValue(res)
        res.json = jest.fn().mockReturnValue(res)
        await getMe(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: "Профиль успешен =)"
        }))
    });
});

describe("GET /auth/search", () => {
    /* Каждый раз присоединяемся к БД */
    beforeEach(async () => {
        await mongoose.connect(
            `mongodb+srv://admin:admin@test.qidx0uu.mongodb.net/?retryWrites=true&w=majority`
        );
        dotenv.config()
    })

    /* Закрываем БД */
    afterEach(async () => {
        await mongoose.connection.close();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it("nothing found", async () => {
        const req = {query: {name: "тест",}}
        User.find = jest.fn().mockResolvedValue(null);
        const res = {}
        res.status = jest.fn().mockReturnValue(res)
        res.json = jest.fn().mockReturnValue(res)
        await search(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Ничего не найдено"
        })
    });

    const mockedUser = {
        _id: '63b94e63401cafbbf0be0a8d',
        username: "тест",
        subscriptions: "someId",
        password: "$2a$10$Mrwv/0gpEKlhi2To03IzyeMjfUKxUJ6TjhZDhhHkYBf/Yua8X1dmW"
    }

    it("success", async () => {
        const req = {query: {name: "тест"}}
        User.find = jest.fn().mockResolvedValue(mockedUser);
        const res = {}
        res.status = jest.fn().mockReturnValue(res)
        res.json = jest.fn().mockReturnValue(res)
        await search(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: "Профили пользователей"
        }))
    });
});

describe("POST /auth/subscribe", () => {
    /* Каждый раз присоединяемся к БД */
    beforeEach(async () => {
        await mongoose.connect(
            `mongodb+srv://admin:admin@test.qidx0uu.mongodb.net/?retryWrites=true&w=majority`
        );
        dotenv.config()
    })

    /* Закрываем БД */
    afterEach(async () => {
        await mongoose.connection.close();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it("wrong user 1", async () => {
        const req = {body:{params: {userId: "тест", subscribe: "cnng"}}}
        User.findOne = jest.fn().mockResolvedValue(null);
        const res = {}
        res.status = jest.fn().mockReturnValue(res)
        res.json = jest.fn().mockReturnValue(res)
        await subscibe(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: "Такого пользователя не существует."
        })
    });

    const mockedUser = {
        _id: '63b94e63401cafbbf0be0a8d',
        username: "тест",
        subscriptions: "someId",
        password: "$2a$10$Mrwv/0gpEKlhi2To03IzyeMjfUKxUJ6TjhZDhhHkYBf/Yua8X1dmW"
    }

    it("wrong user 2", async () => {
        const req = {body:{params: {userId: "тест", subscribe: "cnng"}}}
        User.findOne = jest.fn().mockResolvedValueOnce(mockedUser);
        User.findOne = jest.fn().mockResolvedValueOnce(null);
        const res = {}
        res.status = jest.fn().mockReturnValue(res)
        res.json = jest.fn().mockReturnValue(res)
        await subscibe(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: "Такого пользователя не существует."
        }))
    });

    it("success", async () => {
        const req = {body:{params: {userId: "тест", subscribe: "cnng"}}}
        User.findOne = jest.fn().mockResolvedValue(mockedUser);
        const res = {}
        res.status = jest.fn().mockReturnValue(res)
        res.json = jest.fn().mockReturnValue(res)
        await subscibe(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Изменение состояние подписки одного пользователя на другого'
        }))
    });
});

