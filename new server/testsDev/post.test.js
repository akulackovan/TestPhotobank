import cors from "cors";
import authRoute from '../router/auth.js'
import settingRoute from '../router/settings.js'
import cityRoute from '../router/city.js'
import postRoute from '../router/post.js'
import {addView, getLike, setLike} from '../controllers/post.js'
import Post from '../models/Post.js';
import User from '../models/User.js';
const mongoose = require('mongoose');
const request = require('supertest');
const httpMocks = require('node-mocks-http');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json())
app.use('/auth', authRoute);
app.use('/settings', settingRoute);
app.use('/post', postRoute);
app.use('/city', cityRoute);

describe('addView', () => {

    it('should increment post views count', async () => {
        // Create mock post data
        const postId = '1234';
        const post = new Post({_id: postId, views: 0});

        // Create mock request and response objects
        const req = httpMocks.createRequest({
            method: 'PUT',
            url: '/addView',
            query: {id: postId},
        });
        const res = httpMocks.createResponse();

        // Mock the necessary Post methods
        Post.findById = jest.fn().mockResolvedValue(post);
        Post.updateOne = jest.fn();

        // Call the function
        await addView(req, res);

        // Check that the views count was incremented and response is successful
        expect(Post.updateOne).toHaveBeenCalledWith({_id: postId}, {views: 1});
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData().message).toBe('Успешно');
    });

    it('should return an error if post does not exist', async () => {
        // Create mock request and response objects
        const req = httpMocks.createRequest({
            method: 'PUT',
            url: '/addView',
            query: {id: '1234'},
        });
        const res = httpMocks.createResponse();

        // Mock Post.findById to return null (post does not exist)
        Post.findById = jest.fn().mockResolvedValue(null);

        // Call the function
        await addView(req, res);

        // Check that an error response is returned
        expect(Post.findById).toHaveBeenCalledWith('1234');
        expect(res.statusCode).toBe(400);
        expect(res._getJSONData().message).toBe('Поста не существует');
    });

    it('should return an error if there is an error updating post', async () => {
        // Create mock post data
        const postId = '1234';
        const post = new Post({_id: postId, views: 0});

        // Create mock request and response objects
        const req = httpMocks.createRequest({
            method: 'PUT',
            url: '/addView',
            query: {id: postId},
        });
        const res = httpMocks.createResponse();

        // Mock the necessary Post methods and force an error when updating
        Post.findById = jest.fn().mockResolvedValue(post);
        Post.updateOne = jest.fn().mockImplementation(() => {
            throw new Error('Could not update post');
        });

        // Call the function
        await addView(req, res);

        // Check that an error response is returned
        expect(Post.updateOne).toHaveBeenCalledWith({_id: postId}, {views: 1});
        expect(res.statusCode).toBe(400);
        expect(res._getJSONData().message).toBe('Ошибка при добавлении просмотра');
    });
});

describe('getLike', () => {
    let req, res, next;
    jest.setTimeout(500000);

    const mockedUser = {
        _id: 'someuserid',
        likes: ['somepostid'],
    };
    const mockedPost = {
        _id: 'somepostid',
    };

    beforeEach(() => {
        req = {query: {}};
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('returns like status as false when user has not liked post', async () => {
        req.query = {idUser: mockedUser._id, idPost: mockedPost._id};
        Post.findOne = jest.fn().mockResolvedValue(mockedPost);
        User.findOne = jest.fn().mockResolvedValue(null);

        await getLike(req, res, next);

        expect(Post.findOne).toHaveBeenCalledTimes(1);
        expect(Post.findOne).toHaveBeenCalledWith({_id: mockedPost._id});
        expect(User.findOne).toHaveBeenCalledTimes(1);
        expect(User.findOne).toHaveBeenCalledWith({
            _id: mockedUser._id,
            likes: mockedPost._id,
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            like: false,
            message: 'Лайк получен',
        });
    });

    it('returns like status as true when user has liked post', async () => {
        req.query = {idUser: mockedUser._id, idPost: mockedPost._id};
        Post.findOne = jest.fn().mockResolvedValue(mockedPost);
        User.findOne = jest.fn().mockResolvedValue(mockedUser);

        await getLike(req, res, next);

        expect(Post.findOne).toHaveBeenCalledTimes(1);
        expect(Post.findOne).toHaveBeenCalledWith({_id: mockedPost._id});
        expect(User.findOne).toHaveBeenCalledTimes(1);
        expect(User.findOne).toHaveBeenCalledWith({
            _id: mockedUser._id,
            likes: mockedPost._id,
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            like: true,
            message: 'Лайк получен',
        });
    });

    it('returns error when there is an error during execution', async () => {
        req.query = {idUser: mockedUser._id, idPost: mockedPost._id};
        Post.findOne = jest.fn().mockRejectedValue(new Error('Database error'));

        await getLike(req, res, next);

        expect(Post.findOne).toHaveBeenCalledTimes(1);
        expect(Post.findOne).toHaveBeenCalledWith({_id: mockedPost._id});
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Ошибка при получении статуса лайка',
        });
    });
});

describe('setLike', () => {
    // beforeAll(async () => {
    //     jest.setTimeout(50000)
    //     await mongoose.connect(
    //         'mongodb+srv://admin:admin@test.qidx0uu.mongodb.net/?retryWrites=true&w=majority',
    //         {useNewUrlParser: true, useUnifiedTopology: true},
    //     );
    //     dotenv.config()
    // });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should return a 400 status code if the post does not exist', async () => {
        let mockReq;
        let mockRes;
        mockReq = {
            query: {
                idUser: '123',
                idPost: '456',
            },
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const mockPost = null;
        jest.spyOn(Post, 'findById').mockResolvedValue(mockPost);

        await setLike(mockReq, mockRes);

        expect(Post.findById).toHaveBeenCalledWith(mockReq.query.idPost);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({message: 'Поста не существует'});
    });

    // it('should add a like if the user has not already liked the post', async () => {
    //     const user = new User({
    //         name: 'Test User',
    //         likes: [],
    //     });
    //     await user.save();
    //
    //     const post = new Post({
    //         title: 'Test Post',
    //         likes: 0,
    //     });
    //     await post.save();
    //
    //     const req = {
    //         query: {
    //             idUser: user._id,
    //             idPost: post._id,
    //         },
    //     };
    //     const res = {
    //         status: jest.fn(() => res),
    //         json: jest.fn(),
    //     };
    //     await setLike(req, res);
    //     expect(res.status).toHaveBeenCalledWith(200);
    //     expect(res.json).toHaveBeenCalledWith({ like: true, message: 'Лайк изменен' });
    //
    //     const updatedUser = await User.findById(user._id);
    //     expect(updatedUser.likes).toContain(post._id);
    //
    //     const updatedPost = await Post.findById(post._id);
    //     expect(updatedPost.likes).toBe(1);
    // });

    // it('should remove a like if the user has already liked the post', async () => {
    //     const user = new User({
    //         name: 'Test User',
    //         likes: [],
    //     });
    //     await user.save();
    //
    //     const post = new Post({
    //         title: 'Test Post',
    //         likes: 1,
    //     });
    //     await post.save();
    //
    //     await User.updateOne({ _id: user._id }, { $push: { likes: post._id } });
    //
    //     const req = {
    //         query: {
    //             idUser: user._id,
    //             idPost: post._id,
    //         },
    //     };
    //     const res = {
    //         status: jest.fn(() => res),
    //         json: jest.fn(),
    //     };
    //     await setLike(req, res);
    //     expect(res.status).toHaveBeenCalledWith(200);
    //     expect(res.json).toHaveBeenCalledWith({ like: false, message: 'Лайк изменен' });
    //
    //     const updatedUser = await User.findById(user._id);
    //     expect(updatedUser.likes).not.toContain(post._id);
    //
    //     const updatedPost = await Post.findById(post._id);
    //     expect(updatedPost.likes).toBe(0);
    // });
});