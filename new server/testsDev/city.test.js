/**
 * @jest-environment node
 */

import mongoose from "mongoose";
import express from "express";
import request from 'supertest';
import router from '../router/city.js';
import dotenv from 'dotenv'
import cors from 'cors'

const app = express();
const PORT = process.env.PORT || 8001

app.use(cors());
app.use(express.json())

app.use('/city', router)

app.listen(PORT, () => {
  console.log("Start server on port", PORT)})

describe("GET /city/getAllCity", () => {
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


  it("Should return all city", async () => {
    const res = await request(app).get('/city/getallcity')
    expect(res.statusCode).toEqual(200)
    expect(res.body.city.length).toBeGreaterThan(1000);
    expect(res.body.message).toBe("Города получены")
    expect(res.body.city[0]._id).not.toBeNull()
    expect(res.body.city[0].city).not.toBeNull()
  });

  it("Should return error with close mongoose", async () => {
    await mongoose.connection.close();
    const res = await request(app).get(`/city/getallcity`)
    expect(res.statusCode).toEqual(400)
    expect(res.body.message).toBe("Ошибка при получении городов")
  });

});


describe("GET /city/getcity", () => {
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

  it("Should return city with correct id", async () => {
    const id = "63b9473e70bfa1abe160400f"
    const res = await request(app).get(`/city/getcity?cityId=${id}`)
    expect(res.statusCode).toEqual(200)
    expect(res.body.message).toBe("Город найден")
    expect(res.body.isCity._id).not.toBeNull()
    expect(res.body.isCity._id).toBe(id)
    expect(res.body.isCity.city).not.toBeNull()
  });

  it("Should return error with random string", async () => {
    const res = await request(app).get(`/city/getcity?cityId=63b9`)
    expect(res.statusCode).toEqual(400)
    expect(res.body.message).toBe("Ошибка при получении города")
  });


  it("Should return error with unknown city", async () => {
    const res = await request(app).get(`/city/getcity?cityId=66b9473e70bfa1abe160400f`)
    expect(res.statusCode).toEqual(400)
    expect(res.body.message).toBe("Города нет")
  });

  it("Should return error with unknown city", async () => {
    await mongoose.connection.close();
    const res = await request(app).get(`/city/getcity?cityId=66b9473e70bfa1abe160400f`)
    expect(res.statusCode).toEqual(400)
    expect(res.body.message).toBe("Ошибка при получении города")
  });


})
