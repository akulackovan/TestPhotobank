/**
 * @jest-environment node
 */
import { getCity, getAllCity } from "../controllers/city.js";
import City from "../models/City.js";
jest.mock("../models/City.js");

describe("GET /city/getAllCity", () => {


  it("Should return all cities", async () => {
    const req = {}
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    City.find = jest.fn().mockResolvedValueOnce([
      { _id: "63b9473e70bfa1abe160400f", city: "Москва" },
      { _id: "63b94e8d70bfa1abe1604015", city: "Санкт-Петербург" },
      { _id: "63b96121b19de65ebdf4cd50", city: "Абаза" },
    ]);

    await getAllCity(req, res);
    expect(res.json).toHaveBeenCalledWith({
      message: "Города получены",
      city: [
        { _id: "63b9473e70bfa1abe160400f", city: "Москва" },
        { _id: "63b94e8d70bfa1abe1604015", city: "Санкт-Петербург" },
        { _id: "63b96121b19de65ebdf4cd50", city: "Абаза" },
      ]
    });
  });

  it("Should return error", async () => {
    const req = {}
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    City.find = jest.fn().mockRejectedValueOnce(new Error('Async error'));
    await getAllCity(req, res);
    expect(res.json).toHaveBeenCalledWith({
      message: "Ошибка при получении городов",
    });
    expect(res.status).toHaveBeenCalledWith(400);
  });
});


describe("GET /city/getcity", () => {
 
  it("Should return city with correct id", async () => {
    const req = { query: { cityId: "1234"} };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    City.findOne = jest.fn().mockResolvedValue(
      { _id: "63b9473e70bfa1abe160400f", city: "Москва" },
      );

     await getCity(req, res)

     expect(res.json).toHaveBeenCalledWith({
      message: 'Город найден',
      isCity: { _id: "63b9473e70bfa1abe160400f", city: "Москва" }
    });
  });

  it("Should return error with random string", async () => {
    const req = { query: { cityId: "1234"} };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    City.findOne = jest.fn().mockResolvedValue(
     null);

     await getCity(req, res)

     expect(res.json).toHaveBeenCalledWith({
      message: 'Города нет',
    });
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("Should return error", async () => {
    const req = {}
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    City.findOne = jest.fn().mockRejectedValueOnce(new Error('Async error'));
    await getCity(req, res);
    expect(res.json).toHaveBeenCalledWith({
      message: "Ошибка при получении города",
    });
    expect(res.status).toHaveBeenCalledWith(400);
  });

  
})
