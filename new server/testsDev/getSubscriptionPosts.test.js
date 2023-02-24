/**
 * @jest-environment node
 */

import {getSubscriptionPosts} from "../controllers/getSubscriptionPosts.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

jest.mock('../models/User.js');
jest.mock('../models/Post.js');

describe('getSubscriptionPosts', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });


    it('should return an error message if user is not found', async () => {
        User.findById.mockResolvedValueOnce(null);

        const req = {query: {id: 'mock_user_id'}}
        const res = {status: jest.fn().mockReturnThis(), json: jest.fn()}

        await getSubscriptionPosts(req, res)

        expect(User.findById).toHaveBeenCalledWith({_id: 'mock_user_id'})
        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({message: 'Такого пользователя не существует.'})
    });

    it('should return an error message if user has no subscriptions', async () => {
        const mockUser = {
            _id: 'mock_user_id',
            username: 'mock_user_username',
            password: 'mock_user_password',
            text: 'This is a mock user',
            city: 'mock_city_id',
            image: 'mock_user_image',
            typeImg: 'mock_user_type',
            likes: [],
            subscriptions: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        User.findById.mockResolvedValueOnce(mockUser);

        const req = {query: {id: mockUser._id}}
        const res = {status: jest.fn().mockReturnThis(), json: jest.fn()}

        await getSubscriptionPosts(req, res)

        expect(User.findById).toHaveBeenCalledWith({_id: mockUser._id})
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({message: 'Нет подписок'})
    });

    it('should return an error message if there are no published posts from subscriptions', async () => {
        const mockUser = {
            _id: 'mock_user_id',
            username: 'mock_user_username',
            password: 'mock_user_password',
            text: 'This is a mock user',
            city: 'mock_city_id',
            image: 'mock_user_image',
            typeImg: 'mock_user_type',
            likes: [],
            subscriptions: [{_id: 'mock_sub_id_1'}, {_id: 'mock_sub_id_2'}],
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        User.findById.mockResolvedValueOnce(mockUser);
        Post.find.mockResolvedValueOnce([]);

        const req = {query: {id: mockUser._id}}
        const res = {status: jest.fn().mockReturnThis(), json: jest.fn()}

        await getSubscriptionPosts(req, res)

        expect(User.findById).toHaveBeenCalledWith({_id: mockUser._id})
        expect(Post.find).toHaveBeenCalledWith({author: 'mock_sub_id_1'})
        expect(Post.find).toHaveBeenCalledWith({author: 'mock_sub_id_2'})
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({message: 'Нет опубликованных фотографий'})
    });

    it('should return sorted list of published posts from subscriptions', async () => {
        const mockUser = {
            _id: 'mock_user_id',
            username: 'mock_user_username',
            password: 'mock_user_password',
            text: 'This is a mock user',
            city: 'mock_city_id',
            image: 'mock_user_image',
            typeImg: 'mock_user_type',
            likes: [],
            subscriptions: [{_id: 'mock_sub_id_1'}, {_id: 'mock_sub_id_2'}],
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        const mockPost1 = {
            _id: 'mock_post_id_1',
            author: 'mock_sub_id_1',
            imageUrl: 'mock_image_url_1',
            description: 'Mock post 1',
            likes: [],
            comments: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        const mockPost2 = {
            _id: 'mock_post_id_2',
            author: 'mock_sub_id_2',
            imageUrl: 'mock_image_url_2',
            description: 'Mock post 2',
            likes: [],
            comments: [],
            createdAt: new Date() - 4,
            updatedAt: new Date() - 4,
        }

        User.findById.mockResolvedValueOnce(mockUser);
        Post.find.mockResolvedValueOnce([mockPost2, mockPost1]);

        const req = {query: {id: mockUser._id}}
        const res = {status: jest.fn().mockReturnThis(), json: jest.fn()}

        await getSubscriptionPosts(req, res)

        expect(User.findById).toHaveBeenCalledWith({_id: mockUser._id})
        expect(Post.find).toHaveBeenCalledWith({author: 'mock_sub_id_1'})
        expect(Post.find).toHaveBeenCalledWith({author: 'mock_sub_id_2'})
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            message: "Подписки",
            returnedPosts: [mockPost2, mockPost1]
        })
    });

    it('returns error message when there is an error fetching subscription posts', async () => {
        const mockUser = {
            _id: 'user123',
            subscriptions: [{_id: 'author1'}, {_id: 'author2'}],
        };
        const mockPost1 = {_id: 'post1', author: 'author1', timestamps: '2022-01-01'};
        const mockPost2 = {_id: 'post2', author: 'author2', timestamps: '2022-02-01'};

        User.findById.mockRejectedValue(new Error('Database error'));

        const req = {query: {id: 'user123'}};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        await getSubscriptionPosts(req, res);

        expect(res.status).toBeCalledWith(400);
        expect(res.json).toBeCalledWith({message: 'Ошибка при получении подписных постов'});
    });
});
