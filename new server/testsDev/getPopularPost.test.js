/**
 * @jest-environment node
 */

 import compare from "../controllers/getPopularPosts.js"
 import { getPopular } from "../controllers/getPopularPosts.js"
import Post from "../models/Post.js";
import User from "../models/User.js";

jest.mock("../models/Post.js");
jest.mock("../models/User.js");

 describe("GET /post/popular?id=", () => {
 
   it("Should return posts", async () => {
    const req = { query: { id: "123"}}
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    User.findOne = jest.fn().mockResolvedValueOnce({city: "city" });
    Post.find = jest.fn(() => ({
      sort: jest.fn().mockResolvedValueOnce([{id: 1, 
        timestamps: "2022-12-11T21:00:00.000+00:00",
      views: 5},
      {id: 2, 
        timestamps: "2022-12-11T21:00:00.000+00:00",
      views: 6}])
    }));
    await getPopular(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
   });
   it("Get posts to invalid user", async () => {
    const req = { query: { id: "123"}}
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    User.findOne = jest.fn().mockResolvedValue(null);
    
    await getPopular(req, res);

    expect(res.json).toHaveBeenCalledWith({
      message: "Такого пользователя не существует.",
    });
    expect(res.status).toHaveBeenCalledWith(404)
   });
   it("Get post to user with empty photos", async () => {
    const req = { query: { id: "123"}}
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    User.findOne = jest.fn().mockResolvedValueOnce({city: "city" });
    Post.find = jest.fn(() => ({
      sort: jest.fn().mockResolvedValueOnce([])
    }));
    await getPopular(req, res);

    expect(res.json).toHaveBeenCalledWith({
      message: "Фотографий в городе нет",
    });
   });


   it("Get error", async () => {
    const req = { query: { id: "123"}}
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    User.findOne = jest.fn().mockRejectedValueOnce(new Error('Async error'));


    await getPopular(req, res);

    expect(res.json).toHaveBeenCalledWith({
      message: "Ошибка при получении популярных",
    });
   });
   it("test compare function", async () => {
     expect(compare({views: 2}, {views: 3})).toBe(1)
     expect(compare({views: 3}, {views: 2})).toBe(-1)
     expect(compare({views: 3}, {views: 3})).toBe(0)
   })
 });