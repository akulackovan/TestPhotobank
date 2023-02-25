/**
 * @jest-environment node
 */
 import { getSubsribeUsers } from "../controllers/sub.js";
 import User from "../models/User.js";

 jest.mock("../models/User.js");
 
 describe("getSubsribeUsers", () => {

    const mockUser = {_id: "1", username: "1", subscriptions: [{_id: "63c28b41e2dae1e84ead9deb"}]}
    const mockSubscriptionOne = {_id: "63c28b41e2dae1e84ead9deb", username: "1", password: "123"}

   it("Should return 200", async () => {
     const req = { query: { userId: "1"} };
 
     const res = {
       status: jest.fn(() => res),
       json: jest.fn(),
     };
 
     User.findOne = jest.fn().mockResolvedValue(mockUser)
     User.findById = jest.fn().mockResolvedValue(mockSubscriptionOne)
 
     await getSubsribeUsers(req, res);
     expect(res.status).toHaveBeenCalledWith(200);
     expect(res.json).toHaveBeenCalledWith({
        message: "Получены подписки",
           sub:  [
              {
                "id": "63c28b41e2dae1e84ead9deb",
                "username": "1",
             },
           ],
     });
   });
 
   it("Should return 404 with empty subscriptions", async () => {
     const req = { query: { userId: "654"} };
 
     const res = {
       status: jest.fn(() => res),
       json: jest.fn(),
     };
 
     User.findOne = jest.fn().mockResolvedValueOnce({subscriptions: []});
 
     await getSubsribeUsers(req, res);
     expect(res.status).toHaveBeenCalledWith(404);
     expect(res.json).toHaveBeenCalledWith({
       message: 'Нет подписок',
     });
   });
 
   it("Should return 404 with user", async () => {
     const req = { query: { userId: "55"} };
 
     const res = {
       status: jest.fn(() => res),
       json: jest.fn(),
     };
 
     User.findOne = jest.fn().mockResolvedValueOnce(null);
 
     await getSubsribeUsers(req, res);
     expect(res.status).toHaveBeenCalledWith(404);
     expect(res.json).toHaveBeenCalledWith({
       message: 'Такого пользователя не существует.',
     });
   });
 
   it("Should return 404 with sub user", async () => {
    const req = { query: { userId: "55"} };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    User.findOne = jest.fn().mockResolvedValueOnce(mockUser);
    User.findById = jest.fn().mockRejectedValue(new Error("Error"));
    await getSubsribeUsers(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Такого пользователя не существует.',
    });
  });

 
   it("Should return 404 with empty user", async () => {
    const req = { query: { userId: ""} };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    User.findOne = jest.fn().mockResolvedValueOnce(null);

    await getSubsribeUsers(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Такого пользователя не существует.',
    });
  });


  it("Should return 401 with error in BD", async () => {
    const req = { query: { userId: ""} };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    User.findOne = jest.fn().mockRejectedValue(new Error("Error"));

    await getSubsribeUsers(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Не удалось получить подписки",
    });
  });
 
 
 });
 