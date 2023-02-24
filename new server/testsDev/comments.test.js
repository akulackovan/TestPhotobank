/**
 * @jest-environment node
 */
import { createComment } from "../controllers/comments.js";
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

jest.mock("../models/Post.js");
jest.mock("../models/Comment.js");
jest.mock("../models/User.js");

describe("createComment", () => {
  it("Should 418 with post", async () => {
    const req = { query: { postId: "1234", userId: "1234", comment: "123" } };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    User.findOne = jest.fn().mockResolvedValueOnce({});
    Post.findOne = jest.fn().mockResolvedValueOnce(null);

    await createComment(req, res);
    expect(res.status).toHaveBeenCalledWith(418);
    expect(res.json).toHaveBeenCalledWith({
      message: "Пост не найден",
    });
  });

  it("Should 418 with user", async () => {
    const req = { query: { postId: "1234", userId: "1234", comment: "123" } };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    User.findOne = jest.fn().mockResolvedValueOnce(null);

    await createComment(req, res);
    expect(res.status).toHaveBeenCalledWith(418);
    expect(res.json).toHaveBeenCalledWith({
      message: "Неверный пользователь",
    });
  });

  it("Should 418 with empty password", async () => {
    const req = { query: { postId: "1234", userId: "1234", comment: "" } };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    User.findOne = jest.fn().mockResolvedValueOnce({});
    
    const post = new Post({_id: "1234"});

    Post.findOne = jest.fn().mockResolvedValueOnce(post);

    await createComment(req, res);
    expect(res.status).toHaveBeenCalledWith(418);
    expect(res.json).toHaveBeenCalledWith({
      message: "Комментарий не может быть пустым",
    });
  });


  it("Should 418 with empty password", async () => {
    const req = { query: { postId: "1234", userId: "1234", comment: "" } };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    User.findOne = jest.fn().mockResolvedValueOnce({});

    Post.findOne = jest.fn().mockResolvedValueOnce({});

    await createComment(req, res);
    expect(res.status).toHaveBeenCalledWith(418);
    expect(res.json).toHaveBeenCalledWith({
      message: "Комментарий не может быть пустым",
    });
  });

  it("Should create comment", async () => {
    const req = { query: { postId: "1234", userId: "1234", comment: "123" } };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    User.findOne = jest.fn().mockResolvedValueOnce({});
    Post.findOne = jest.fn().mockResolvedValueOnce({});

    const mockSave = jest.fn();
    Comment.mockImplementationOnce(() => ({
        save: mockSave,
    }));
    await createComment(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Успешно созданный комментарий',
      newComment:  {
            comment: "123",
             user: undefined,
           },
    });
  });
});
