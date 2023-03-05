/**
 * @jest-environment node
 */

 import mongoose from "mongoose";
 import dotenv from 'dotenv'
 import jwt from 'jsonwebtoken'
 import {getAnother, getMe, register, search, subscibe} from "../controllers/auth.js";
 import {login} from "../controllers/auth.js";
 import User from "../models/User.js";
 import City from "../models/City.js";
 

 
 jest.mock("../models/User.js")
 jest.mock("../models/City.js")

 describe("POST /auth/reg", () => {
 
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
         User.findOne = jest.fn().mockResolvedValueOnce(null);
         City.findOne = jest.fn().mockResolvedValueOnce({_id: "123"});
         const mockSave = jest.fn();
         User.mockImplementationOnce(() => ({
                save: mockSave,
            }));
         await register(req, res);
         expect(res.status).toHaveBeenCalledWith(201);
         expect(res.json).toHaveBeenCalledWith(expect.objectContaining(
             {'message': 'Регистрация успешна'}))
     });

     it("main error", async () => {
        const req = {body: {username: "тест", password: "1235", city: "63b9473e70bfa1abe160400f"}}
        const res = {}
        res.status = jest.fn().mockReturnValue(res)
        res.json = jest.fn().mockReturnValue(res)
        User.findOne = jest.fn().mockRejectedValueOnce(new Error("error"));
        await register(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining(
            {'message': 'Ошибка при авторизации'}))
    });
 });
 
 describe("POST /auth/login", () => {
    
 
     it("Wrong user", async () => {
         const req = {body: {username: "тест", password: "156",}}
         const res = {}
         res.status = jest.fn().mockReturnValue(res)
         res.json = jest.fn().mockReturnValue(res)
         await login(req, res);
         expect(res.status).toHaveBeenCalledWith(404);
         expect(res.json).toHaveBeenCalledWith({
             message: "Такого пользователя не существует"
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
             message: "Неверный пароль"
         })
     });
 
    it("successful", async () => {
         const req = {body: {username: "тест", password: "тест",}}
         User.findOne = jest.fn().mockResolvedValue(mockedUser);
         City.findOne = jest.fn().mockResolvedValue({_id: "123"});
         const res = {}
         res.status = jest.fn().mockReturnValue(res)
         res.json = jest.fn().mockReturnValue(res)
         await login(req, res);
         expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
             message: "Успешный вход в систему."
         }))
     });

     it("main error", async () => {
        const req = {body: {username: "тест", password: "1235", city: "63b9473e70bfa1abe160400f"}}
        const res = {}
        res.status = jest.fn().mockReturnValue(res)
        res.json = jest.fn().mockReturnValue(res)
        User.findOne = jest.fn().mockRejectedValueOnce(new Error("error"));
        await login(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining(
            {'message': 'Ошибка при авторизации.'}))
    });
 });
 
 describe("GET /auth/user", () => {
 
 
     it("No users at all", async () => {
         const req = {query: {myId: "тест", userId: "156",}}
         const res = {}
         res.status = jest.fn().mockReturnValue(res)
         res.json = jest.fn().mockReturnValue(res)
         User.findOne = jest.fn().mockResolvedValueOnce(null);
         await getAnother(req, res);
         expect(res.status).toHaveBeenCalledWith(404);
         expect(res.json).toHaveBeenCalledWith({
             message: "Такого пользователя не существует."
         })
     });

     it("main error", async () => {
        const req = {query: {myId: "тест", userId: "156",}}
        const res = {}
        res.status = jest.fn().mockReturnValue(res)
        res.json = jest.fn().mockReturnValue(res)
        User.findOne = jest.fn().mockRejectedValueOnce(new Error("error"));
        await getAnother(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Нет доступа'
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
         expect(res.status).toHaveBeenCalledWith(201);
         expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
             message: "Профиль успешен"
         }))
     });
 
 });
 
 describe("GET /auth/profile", () => {
     
 
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
 
     it("Wrong user", async () => {
        const req = {query: {myId: "тест", userId: "156",}}
        User.findOne = jest.fn().mockRejectedValueOnce(new Error("Error"));
        const res = {}
        res.status = jest.fn().mockReturnValue(res)
        res.json = jest.fn().mockReturnValue(res)
        await getMe(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Нет'
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
         expect(res.status).toHaveBeenCalledWith(201);
         expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
             message: "Профиль успешен"
         }))
     });
 });
 
 describe("GET /auth/search", () => {
     
 
     afterEach(() => {
         jest.resetAllMocks();
     });
 
     it("nothing found", async () => {
         const req = {query: {name: "тест",}}
         User.find = jest.fn().mockResolvedValue(null);
         const res = {}
         res.status = jest.fn().mockReturnValue(res)
         res.json = jest.fn().mockReturnValue(res)
         User.find = jest.fn().mockResolvedValueOnce([])
         await search(req, res);
         expect(res.status).toHaveBeenCalledWith(400);
         expect(res.json).toHaveBeenCalledWith({
             message: "Ничего не найдено"
         })
     });

     it("nothing found", async () => {
        const req = {query: {name: "",}}
        const res = {}
        res.status = jest.fn().mockReturnValue(res)
        res.json = jest.fn().mockReturnValue(res)
        User.find = jest.fn().mockResolvedValueOnce([])
        await search(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message:  'Запрос для поиска пустой'
        })
    });

    it("main error", async () => {
        const req = {query: {name: "333",}}
        const res = {}
        res.status = jest.fn().mockReturnValue(res)
        res.json = jest.fn().mockReturnValue(res)
        User.find = jest.fn().mockRejectedValueOnce(new Error("Error"))
        await search(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message:  'Ошибка в поиске пользователя'
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
         User.find = jest.fn().mockResolvedValueOnce([{user: 1}])
         await search(req, res);
         expect(res.status).toHaveBeenCalledWith(200);
         expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
             message: "Профили пользователей"
         }))
     });
 });
 
 describe("POST /auth/subscribe", () => {
     /* Каждый раз присоединяемся к БД */
     
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
         expect(res.status).toHaveBeenCalledWith(201);
         expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
             message: 'Изменение состояние подписки одного пользователя на другого'
         }))
     });

     it("main error", async () => {
        const req = {body:{params: {userId: "тест", subscribe: "cnng"}}}
        User.findOne = jest.fn().mockRejectedValue(new Error("Error"));
        const res = {}
        res.status = jest.fn().mockReturnValue(res)
        res.json = jest.fn().mockReturnValue(res)
        await subscibe(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Подписка не успешна'
        }))
    });

     
 });