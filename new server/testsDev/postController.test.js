import {createPost, deletePost} from '../controllers/postController.js';
import Post from '../models/Post.js';

jest.mock('../models/Post.js');

describe('createPost', () => {
    it('should create a new post successfully', async () => {
        const req = {
            body: {
                city: 'Moscow',
                photo: 'Test Photo',
                description: 'Test Description',
                userId: 'Test User ID',
            },
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };
        const mockSave = jest.fn();
        Post.mockImplementationOnce(() => ({
            save: mockSave,
        }));
        await createPost(req, res);
        expect(mockSave).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            newPost: expect.any(Object),
            message: 'Успешно созданный пост',
        });
    });

    it('should fail to create a new post if city or photo are missing', async () => {
        const req = {
            body: {
                photo: 'Test Photo',
                description: 'Test Description',
                userId: 'Test User ID',
            },
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };
        await createPost(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Ошибка при создании поста',
        });
    });

    it('should handle errors when creating a new post', async () => {
        const req = {
            body: {
                city: 'Test City',
                photo: 'Test Photo',
                description: 'Test Description',
                userId: 'Test User ID',
            },
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };
        const mockSave = jest.fn(() => {
            throw new Error();
        });
        Post.mockImplementationOnce(() => ({
            save: mockSave,
        }));
        await createPost(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Ошибка при создании поста',
        });
    });
});

describe('deletePost', () => {
    let req, res, postId;

    beforeEach(() => {
        postId = '123';
        req = {
            body: { postId },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should return 404 if post is not found', async () => {
        Post.findOne = jest.fn().mockResolvedValueOnce(null);

        await deletePost(req, res);

        expect(Post.findOne).toHaveBeenCalledWith({ postId });
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Такого поста не существует' });
    });

    it('should delete the post and return 204', async () => {
        const mockPost = { _id: '123', author: 'authorId', city: 'city', image: 'image', text: 'text', view: 0, likes: 0, timestamps: new Date() };
        Post.findOne = jest.fn().mockResolvedValueOnce(mockPost);
        Post.deleteOne = jest.fn().mockResolvedValueOnce();

        await deletePost(req, res);

        expect(Post.findOne).toHaveBeenCalledWith({ postId });
        expect(Post.deleteOne).toHaveBeenCalledWith({ _id: mockPost._id }._id);
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.json).toHaveBeenCalledWith({ message: 'Пост был удален' });
    });

    it('should return 400 if there is an error while deleting the post', async () => {
        const mockError = new Error('mock error');
        Post.findOne = jest.fn().mockResolvedValueOnce({});
        Post.deleteOne = jest.fn().mockRejectedValueOnce(mockError);

        await deletePost(req, res);

        expect(Post.findOne).toHaveBeenCalledWith({ postId });
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Ошибка при удалении поста' });
    });
});
