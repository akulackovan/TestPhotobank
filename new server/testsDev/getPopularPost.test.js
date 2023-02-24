/**
 * @jest-environment node
 */

 import mongoose from "mongoose";
 import express from "express";
 import request from 'supertest';
 import dotenv from 'dotenv'
 import cors from 'cors'
 import compare from "../controllers/getPopularPosts.js"
 
 import router from "../router/post.js";
 
 const app = express();
 const PORT = process.env.PORT || 8082
 
 app.use(cors());
 app.use(express.json())
 app.use('/popular', router)
 
 app.listen(PORT, () => {
   console.log("Start server on port", PORT)
 })
 
 describe("GET /post/popular?id=", () => {
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
 
 
   it("Should return posts", async () => {
     const id = "63e359e156dc8cda748351da"
     const res = await request(app).get(`/popular?id=${id}`)
     expect(res.body.message).toBe("Популярное")
     expect(res.statusCode).toEqual(200)
   });
   it("Get posts to invalid user", async () => {
     const id = "1"
     const res = await request(app).get(`/popular?id=${id}`)
     expect(res.body.message).toBe("Такого пользователя не существует.")
     expect(res.statusCode).toEqual(404)
   });
   it("Get post to user with empty photos", async () => {
     const id = "63f61faf4868562676c76591"
     const res = await request(app).get(`/popular?id=${id}`)
     expect(res.body.message).toBe("Фотографий в городе нет")
     expect(res.statusCode).toEqual(400)
   });
   it("test compare function", async () => {
     expect(compare({views: 2}, {views: 3})).toBe(1)
     expect(compare({views: 3}, {views: 2})).toBe(-1)
     expect(compare({views: 3}, {views: 3})).toBe(0)
   })
 });