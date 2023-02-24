/**
 * @jest-environment node
 */
import cors from "cors";
const mongoose = require('mongoose');
const request = require('supertest');
const express = require('express');
const {StatusCodes} = require("http-status-codes");
import authRoute from '../router/auth.js'
import settingRoute from '../router/settings.js'
import cityRoute from '../router/city.js'
import postRoute from '../router/post.js'
import dotenv from "dotenv";
const app = express();
const PORT = process.env.PORT || 8080
app.use(cors());
app.use(express.json())
app.use('/auth', authRoute);
app.use('/settings', settingRoute);
app.use('/post', postRoute);
app.use('/city', cityRoute);

app.listen(PORT, () => {
    console.log("Start server on port", PORT)})
jest.setTimeout(50000);
describe('Test the server', () => {
    beforeAll(async () => {
        jest.setTimeout(50000)
        await mongoose.connect(
            'mongodb+srv://admin:admin@test.qidx0uu.mongodb.net/?retryWrites=true&w=majority',
            {useNewUrlParser: true, useUnifiedTopology: true},
        );
        dotenv.config()
    });

    test('responds with 404 when accessing non-existent route', async () => {
        jest.setTimeout(50000);
        const response = await request(app).get('/non-existent-route');
        expect(response.status).toBe(404);
    });

    // Test the /auth endpoint
    describe('Test the /auth endpoint', () => {
        test("should exist", async () => {
            jest.setTimeout(50000)
            const response = await request(app).post("/auth/login").send({
                username: 'vany',
                password: 'vany',
            });
            expect(response.status !== StatusCodes.NOT_FOUND).toBe(true);
        });

        test('POST /auth/login should return 200', async () => {
            jest.setTimeout(50000)

            const response = await request(app).post('/auth/login').send({
                username: "тест",
                password: "тест",
            });
            expect(response.statusCode).toBe(200);
        });

        test('POST /auth/reg should return 409', async () => {
            jest.setTimeout(50000)

            const response = await request(app).post('/auth/reg').send({
                username: "те=ст",
                password: "тест",
                city: "63b9473e70bfa1abe160400f",
            });
            expect(response.statusCode).toBe(409);
        });
    });

    // Test the /post endpoint
    describe('Test the /post endpoint', () => {
        test('GET /post should exist', async () => {
            jest.setTimeout(50000);
            const response = await request(app).get('/post/?id=63b94e63401cafbbf0be0a8d');
            expect(response.status !== StatusCodes.NOT_FOUND).toBe(true);
            expect(response.statusCode).toBe(200);
        });
    });

    // Test the /city endpoint
    describe('Test the /city endpoint', () => {
        test('GET /city should return 200', async () => {
            jest.setTimeout(50000)
            const id = "63b9473e70bfa1abe160400f"
            const response = await request(app).get(`/city/getcity?cityId=${id}`);
            expect(response.status !== StatusCodes.NOT_FOUND).toBe(true);
            expect(response.statusCode).toBe(200);
        });
    });

    describe('Test the /settings endpoint', () => {
        test('GET /settings should return 200', async () => {
            jest.setTimeout(50000)
            const response = await request(app).post(`/settings/`).send({
                userId: '63b94e63401cafbbf0be0a8w'
            });
            expect(response.statusCode).toBe(400);
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});