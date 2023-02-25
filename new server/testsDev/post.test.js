/**
 * @jest-environment node
 */
 import cors from "cors";
 import authRoute from '../router/auth.js'
 import settingRoute from '../router/settings.js'
 import cityRoute from '../router/city.js'
 import postRoute from '../router/post.js'
 import {addView, getLike, getMyPost, getPostById, getPostComments, setLike} from '../controllers/post.js'
 import City from '../models/City.js';
 import Post from '../models/Post'
 import User from '../models/User'
 import Comment from '../models/Comment'
 
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
     const postId = '1234';
 
     it('should increment post views count', async () => {
         const post = new Post({_id: postId, views: 0});
         const req = httpMocks.createRequest({
             method: 'PUT',
             url: '/addView',
             query: {id: postId},
         });
         const res = httpMocks.createResponse();
         Post.findById = jest.fn().mockResolvedValue(post);
         Post.updateOne = jest.fn();
         await addView(req, res);
 
         // expect(Post.updateOne).toHaveBeenCalledWith({_id: postId}, {views: 1});
         expect(res.statusCode).toBe(200);
         expect(res._getJSONData().message).toBe('Успешно');
     });

     it('should return error because post is not created', async () => {
        const req = httpMocks.createRequest({
            method: 'PUT',
            url: '/addView',
            query: {id: postId},
        });
        const res = httpMocks.createResponse();
        Post.findById = jest.fn().mockResolvedValue(null);
        await addView(req, res);

        // expect(Post.updateOne).toHaveBeenCalledWith({_id: postId}, {views: 1});
        expect(res.statusCode).toBe(400);
        expect(res._getJSONData().message).toBe('Поста не существует');
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
         const post = new Post({_id: postId, views: 0});
 
         const req = httpMocks.createRequest({
             method: 'PUT',
             url: '/addView',
             query: {id: postId},
         });
         const res = httpMocks.createResponse();
 
         Post.findById = jest.fn().mockResolvedValue(post);
         Post.updateOne = jest.fn().mockImplementation(() => {
             throw new Error('Could not update post');
         });
 
         await addView(req, res);
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


     it('returns error because post is not be created', async () => {
        req.query = {idUser: mockedUser._id, idPost: mockedPost._id};
        Post.findOne = jest.fn().mockResolvedValue(null);

        await getLike(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Поста не существует',
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
     beforeEach(() => {
         jest.clearAllMocks();
     });
 
     it('should return a 400 status code if the post does not exist', async () => {
         const mockReq = {
             query: {
                 idUser: '123',
                 idPost: '456',
             },
         };
         const mockRes = {
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
 
     it('should to like to a post if the user has not liked the post before', async () => {
         const mockReq = {
             query: {
                 idUser: '123',
                 idPost: '456',
             },
         };
         const mockRes = {
             status: jest.fn().mockReturnThis(),
             json: jest.fn(),
         };
         const mockPost = {
             _id: '456',
             author: 'user123',
             likes: 0,
         };
         const mockUser = {
             _id: '123',
             likes: [],
         };
         jest.spyOn(Post, 'findById').mockResolvedValue(mockPost);
         jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);
         jest.spyOn(User, 'updateOne').mockResolvedValue();
         jest.spyOn(Post, 'updateOne').mockResolvedValue();
 
         await setLike(mockReq, mockRes);
 
         expect(Post.findById).toHaveBeenCalledWith(mockReq.query.idPost);
         expect(User.findOne).toHaveBeenCalledWith({_id: mockReq.query.idUser, likes: mockReq.query.idPost});
         expect(User.updateOne).toHaveBeenCalledWith({_id: mockReq.query.idUser}, {$pull: {likes: mockReq.query.idPost}});
     });
 
     it('should update a like from a post if the user has already liked the post', async () => {
         const mockReq = {
             query: {
                 idUser: '123',
                 idPost: '456',
             },
         };
         const mockRes = {
             status: jest.fn().mockReturnThis(),
             json: jest.fn(),
         };
         const mockPost = {
             _id: '456',
             author: 'user123',
             likes: 1,
         };
         const mockUser = {
             _id: '123',
             likes: ['456'],
         };
         jest.spyOn(Post, 'findById').mockResolvedValue(mockPost);
         jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);
         jest.spyOn(User, 'updateOne').mockResolvedValue();
         jest.spyOn(Post, 'updateOne').mockResolvedValue();
 
         await setLike(mockReq, mockRes);
 
         expect(Post.findById).toHaveBeenCalledWith(mockReq.query.idPost);
         expect(User.findOne).toHaveBeenCalledWith({_id: mockReq.query.idUser, likes: mockReq.query.idPost});
         expect(User.updateOne).toHaveBeenCalledWith({_id: mockReq.query.idUser}, {$pull: {likes: mockReq.query.idPost
             }});
     });
 
     it('should return a bad status code and an error message if an error occurs while finding the post', async () => {
         const mockReq = {
             query: {
                 idUser: '123',
                 idPost: '456',
             },
         };
         const mockRes = {
             status: jest.fn().mockReturnThis(),
             json: jest.fn(),
         };
         jest.spyOn(Post, 'findById').mockRejectedValue(new Error('Test error'));
         await setLike(mockReq, mockRes);
 
         expect(Post.findById).toHaveBeenCalledWith(mockReq.query.idPost);
         expect(mockRes.status).toHaveBeenCalledWith(400);
     });
 
     it('should return a bad status code and an error message if an error occurs while finding the user', async () => {
         const mockReq = {
             query: {
                 idUser: '123',
                 idPost: '456',
             },
         };
         const mockRes = {
             status: jest.fn().mockReturnThis(),
             json: jest.fn(),
         };
         const mockPost = {
             _id: '456',
             author: 'user123',
             likes: 0,
         };
         jest.spyOn(Post, 'findById').mockResolvedValue(mockPost);
         jest.spyOn(User, 'findOne').mockRejectedValue(new Error('Test error'));
         await setLike(mockReq, mockRes);
 
         expect(Post.findById).toHaveBeenCalledWith(mockReq.query.idPost);
         expect(User.findOne).toHaveBeenCalledWith({_id: mockReq.query.idUser, likes: mockReq.query.idPost});
         expect(mockRes.status).toHaveBeenCalledWith(400);
     });
 
     it('should return a bad status code and an error message if an error occurs while updating the user', async () => {
         const mockReq = {
             query: {
                 idUser: '123',
                 idPost: '456',
             },
         };
         const mockRes = {
             status: jest.fn().mockReturnThis(),
             json: jest.fn(),
         };
         const mockPost = {
             _id: '456',
             author: 'user123',
             likes: 0,
         };
         const mockUser = {
             _id: '123',
             likes: [],
         };
         jest.spyOn(Post, 'findById').mockResolvedValue(mockPost);
         jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);
         jest.spyOn(User, 'updateOne').mockRejectedValue(new Error('Test error'));
         await setLike(mockReq, mockRes);
 
         expect(Post.findById).toHaveBeenCalledWith(mockReq.query.idPost);
         expect(User.findOne).toHaveBeenCalledWith({_id: mockReq.query.idUser, likes: mockReq.query.idPost});
         expect(User.updateOne).toHaveBeenCalledWith({_id: mockReq.query.idUser}, {$pull: {likes: mockReq.query.idPost}});
         // expect(mockRes.status).toHaveBeenCalledWith(500);
         expect(mockRes.json).toHaveBeenCalledWith({message: 'Ошибка при получении статуса лайка'});
 
     });

     
 });
 
 const mockPostId = 'mock_post_id'
 const mockPost = {
     _id: mockPostId,
     title: 'Mock Post',
     content: 'This is a mock post',
     author: 'mock_author_id',
     city: 'mock_city_id',
     likes: ['mock_user_id_1', 'mock_user_id_2'],
     createdAt: new Date(),
     updatedAt: new Date(),
 }
 const mockAuthor = {
     _id: 'mock_author_id',
     username: 'mock_author_username',
     password: 'mock_author_password',
     text: 'This is a mock author',
     city: 'mock_city_id',
     image: 'mock_author_image',
     typeImg: 'mock_author_type',
     likes: [],
     subscriptions: [],
     createdAt: new Date(),
     updatedAt: new Date(),
 }
 const mockCity = {
     _id: 'mock_city_id',
     city: 'Mockow',
 }
 const mockUser1 = {
     _id: 'mock_user_id_1',
     username: 'mock_user_username_1',
     password: 'mock_user_password_1',
     text: 'This is a mock user 1',
     city: 'mock_city_id',
     image: 'mock_user_image_1',
     typeImg: 'mock_user_type_1',
     likes: [],
     subscriptions: [],
     createdAt: new Date(),
     updatedAt: new Date(),
 }
 const mockUser2 = {
     _id: 'mock_user_id_2',
     username: 'mock_user_username_2',
     password: 'mock_user_password_2',
     text: 'This is a mock user 2',
     city: 'mock_city_id',
     image: 'mock_user_image_2',
     typeImg: 'mock_user_type_2',
     likes: [],
     subscriptions: [],
     createdAt: new Date(),
     updatedAt: new Date(),
 }
 
 jest.mock('../models/Post')
 jest.mock('../models/User')
 jest.mock('../models/City')
 jest.mock('../models/Comment')
 
 describe('getMyPost', () => {
     beforeEach(() => {
         jest.clearAllMocks()
     })
 
     it('should return the user\'s posts when the user exists and has posts', async () => {
         // Set up mock data
         const mockUserId = 'mock_user_id'
         const mockPost1 = {
             _id: 'mock_post_id_1',
             title: 'Mock Post 1',
             content: 'This is a mock post 1',
             author: mockUserId,
             city: 'mock_city_id',
             likes: [],
             createdAt: new Date(),
             updatedAt: new Date(),
         }
         const mockPost2 = {
             _id: 'mock_post_id_2',
             title: 'Mock Post 2',
             content: 'This is a mock post 2',
             author: mockUserId,
             city: 'mock_city_id',
             likes: [],
             createdAt: new Date(),
             updatedAt: new Date(),
         }
         const mockUser = {
             _id: mockUserId,
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
 
         // Mock User.findOne() to return the mock user
         User.findOne.mockResolvedValueOnce(mockUser)
 
         // Mock Post.find() to return the mock posts
         Post.find.mockResolvedValueOnce([mockPost1, mockPost2])
 
         // Call the getMyPost function with the mock request and response objects
         const req = {query: {id: mockUserId}}
         const res = {json: jest.fn()}
         await getMyPost(req, res)
 
         // Expect User.findOne() to be called with the mock user ID
         expect(User.findOne).toHaveBeenCalledWith({id: mockUserId})
 
         // Expect Post.find() to be called with the mock user ID
         expect(Post.find).toHaveBeenCalledWith({author: mockUserId})
 
         // Expect the response to contain the mock posts and a success message
         expect(res.json).toHaveBeenCalledWith({
             isPost: [mockPost1, mockPost2],
             message: 'Посты пользователя получены',
         })
     })
 
     it('should return an error message when the user does not exist', async () => {
         // Mock User.findOne() to return null
         User.findOne.mockResolvedValueOnce(null)
 
         // Call the getMyPost function with the mock request and response objects
         const req = {query: {id: 'nonexistent_user_id'}}
         const res = {status: jest.fn().mockReturnThis(), json: jest.fn()}
         await getMyPost(req, res)
 
         // Expect User.findOne() to be called with the mock user ID
         expect(User.findOne).toHaveBeenCalledWith({id: 'nonexistent_user_id'})
 
         // Expect the response to have a 400 status code and an error message
         expect(res.status).toHaveBeenCalledWith(400)
         expect(res.json).toHaveBeenCalledWith({
             message: 'Пользователя не существует',
         })
     });
 
     it('returns "Фото нет" message when there are no posts for the given user', async () => {
         const mockUser = { id: 'user123' };
         const mockPost = [];
 
         User.findOne.mockResolvedValueOnce(mockUser);
         Post.find.mockResolvedValueOnce(mockPost);
 
         const res = {
             status: jest.fn().mockReturnThis(),
             json: jest.fn()
         };
 
         await getMyPost({ query: { id: 'user123' } }, res);
 
         expect(User.findOne).toHaveBeenCalledWith({ id: 'user123' });
         expect(Post.find).toHaveBeenCalledWith({ author: 'user123' });
 
         expect(res.status).toHaveBeenCalledWith(400);
         expect(res.json).toHaveBeenCalledWith({ message: 'Фото нет' });
     });
 
     it('returns "Ошибка при получении постов пользователя" message when there is an error fetching posts for the given user', async () => {
         const mockUser = { id: 'user123' };
         const errorMessage = 'Database error';
 
         User.findOne.mockResolvedValueOnce(mockUser);
         Post.find.mockRejectedValueOnce(new Error(errorMessage));
 
         const res = {
             status: jest.fn().mockReturnThis(),
             json: jest.fn()
         };
 
         await getMyPost({ query: { id: 'user123' } }, res);
 
         expect(User.findOne).toHaveBeenCalledWith({ id: 'user123' });
         expect(Post.find).toHaveBeenCalledWith({ author: 'user123' });
 
         expect(res.status).toHaveBeenCalledWith(400);
         expect(res.json).toHaveBeenCalledWith({ message: 'Ошибка при получении постов пользователя' });
     });
 });
 
 describe('getPostById', () => {
     beforeEach(() => {
         jest.clearAllMocks()
     })
 
     it('should return a post with author, city, and likes', async () => {
         Post.findOne.mockResolvedValueOnce(mockPost)
         User.find.mockResolvedValueOnce([mockUser1, mockUser2])
         User.findOne.mockResolvedValueOnce(mockAuthor)
         City.findOne.mockResolvedValueOnce(mockCity)
         const req = {query: {id: mockPostId}}
         const res = {json: jest.fn()}
         await getPostById(req, res)
 
         expect(Post.findOne).toHaveBeenCalledWith({_id: mockPostId})
         expect(User.find).toHaveBeenCalledWith({likes: mockPostId})
         expect(User.findOne).toHaveBeenCalledWith({_id: mockAuthor._id})
         expect(City.findOne).toHaveBeenCalledWith({_id: mockCity._id})
         expect(res.json).toHaveBeenCalledWith({
             isPost: {
                 ...mockPost,
                 likes: 2,
                 author: {
                     ...mockAuthor,
                     password: ''
                 },
                 city: mockCity
             },
             message: 'Пост получен'
         });
 
     });
 
     it('should return a 400 error if post does not exist', async () => {
         // Mock Post.findOne() to return null
         Post.findOne.mockResolvedValueOnce(null)
 
         // Call the getPostById function with the mock request and response objects
         const req = {query: {id: 'nonexistent_post_id'}}
         const res = {status: jest.fn().mockReturnThis(), json: jest.fn()}
         await getPostById(req, res)
 
         // Expect Post.findOne() to be called with the mock post ID
         expect(Post.findOne).toHaveBeenCalledWith({_id: 'nonexistent_post_id'})
 
         // Expect the response to have a 400 status and a message indicating the post does not exist
         expect(res.status).toHaveBeenCalledWith(400)
         expect(res.json).toHaveBeenCalledWith({message: 'Поста не существует'})
     });
 
     it('should return a 400 error if an error occurs while querying the database', async () => {
         // Mock Post.findOne() to throw an error
         Post.findOne.mockImplementationOnce(() => {
             throw new Error('test error')
         })
 
         // Call the getPostById function with the mock request and response objects
         const req = {query: {id: mockPostId}}
         const res = {status: jest.fn().mockReturnThis(), json: jest.fn()}
         await getPostById(req, res)
 
         // Expect Post.findOne() to be called with the mock post ID
         expect(Post.findOne).toHaveBeenCalledWith({_id: mockPostId})
 
         // Expect the response to have a 400 status and a message indicating an error occurred
         expect(res.status).toHaveBeenCalledWith(400)
         expect(res.json).toHaveBeenCalledWith({message: 'Ошибка при получении поста'})
     });
 
     it('should return a post with author, city, and no likes', async () => {
         // Mock Post.findOne() to return the mock post with no likes
         const mockPostNoLikes = {...mockPost, likes: []}
         Post.findOne.mockResolvedValueOnce(mockPostNoLikes)
 
         // Mock User.find() to return an empty array
         User.find.mockResolvedValueOnce([])
 
         // Mock User.findOne() to return the mock author
         User.findOne.mockResolvedValueOnce(mockAuthor)
 
         // Mock City.findOne() to return the mock city
         City.findOne.mockResolvedValueOnce(mockCity)
 
         // Call the getPostById function with the mock request and response objects
         const req = {query: {id: mockPostId}}
         const res = {json: jest.fn()}
         await getPostById(req, res)
 
         // Expect Post.findOne() to be called with the mock post ID
         expect(Post.findOne).toHaveBeenCalledWith({_id: mockPostId})
 
         // Expect the response to have a post object with the mock post data and no likes
         expect(res.json).toHaveBeenCalledWith({
             isPost: {
                 ...mockPostNoLikes,
                 author: {...mockAuthor, password: ''},
                 city: mockCity,
                 likes: 0,
             },
             message: 'Пост получен',
         })
     });
 
 });
 
 describe('getPostComments', () => {
     beforeEach(() => {
         jest.clearAllMocks()
     })
 
     it('should return the comments for a post', async () => {
         // Set up mock data
         const mockComment1 = {
             _id: 'mock_comment_id_1',
             comment: 'Mock Comment 1',
             author: 'mock_user_id_1',
             createdAt: new Date(),
             updatedAt: new Date(),
         }
         const mockComment2 = {
             _id: 'mock_comment_id_2',
             comment: 'Mock Comment 2',
             author: 'mock_user_id_2',
             createdAt: new Date(),
             updatedAt: new Date(),
         }
         const mockPost = {
             _id: 'mock_post_id',
             title: 'Mock Post',
             content: 'This is a mock post',
             author: 'mock_user_id',
             city: 'mock_city_id',
             likes: [],
             comments: [mockComment1._id, mockComment2._id],
             createdAt: new Date(),
             updatedAt: new Date(),
         }
         const mockUser1 = {
             _id: 'mock_user_id_1',
             username: 'mock_user_username_1',
             password: 'mock_user_password_1',
             text: 'This is a mock user 1',
             city: 'mock_city_id',
             image: 'mock_user_image_1',
             typeImg: 'mock_user_type_1',
             likes: [],
             subscriptions: [],
             createdAt: new Date(),
             updatedAt: new Date(),
         }
         const mockUser2 = {
             _id: 'mock_user_id_2',
             username: 'mock_user_username_2',
             password: 'mock_user_password_2',
             text: 'This is a mock user 2',
             city: 'mock_city_id',
             image: 'mock_user_image_2',
             typeImg: 'mock_user_type_2',
             likes: [],
             subscriptions: [],
             createdAt: new Date(),
             updatedAt: new Date(),
         }
 
         Post.findById.mockResolvedValueOnce(mockPost)
         Comment.findById.mockResolvedValueOnce(mockComment1)
         Comment.findById.mockResolvedValueOnce(mockComment2)
         User.findById.mockResolvedValueOnce(mockUser1)
         User.findById.mockResolvedValueOnce(mockUser2)
 
         const req = {query: {id: mockPost._id}}
         const res = {json: jest.fn(), status: jest.fn(() => res)}
         await getPostComments(req, res)
 
         expect(Post.findById).toHaveBeenCalledWith(mockPost._id)
         expect(Comment.findById).toHaveBeenCalledWith(mockComment1._id)
         expect(Comment.findById).toHaveBeenCalledWith(mockComment2._id)
 
         expect(User.findById).toHaveBeenCalledWith(mockUser1._id)
         expect(User.findById).toHaveBeenCalledWith(mockUser2._id)
         expect(res.status).toHaveBeenCalledWith(200)
         expect(res.json).toHaveBeenCalledWith({
             total: [
                 {user: mockUser2.username, comment: mockComment2.comment},
                 {user: mockUser1.username, comment: mockComment1.comment},
             ],
             message: 'Комментарии получены',
         })
     });
 
 
     it('should return an error if the post does not exist', async () => {
         Post.findById.mockResolvedValueOnce(null)
         const req = {query: {id: 'nonexistent_post_id'}}
         const res = {status: jest.fn().mockReturnThis(), json: jest.fn()}
         await getPostComments(req, res)
 
         expect(Post.findById).toHaveBeenCalledWith('nonexistent_post_id')
 
         expect(res.status).toHaveBeenCalledWith(400)
         expect(res.json).toHaveBeenCalledWith({
             message: 'Поста не существует',
         })
     });
 
     it('should return an error if there is an error while getting the comments', async () => {
         Post.findById.mockRejectedValueOnce(new Error('Mock Error'))
         const req = {query: {id: 'mock_post_id'}}
         const res = {status: jest.fn().mockReturnThis(), json: jest.fn()}
         await getPostComments(req, res)
 
         expect(Post.findById).toHaveBeenCalledWith('mock_post_id')
 
         expect(res.status).toHaveBeenCalledWith(400)
         expect(res.json).toHaveBeenCalledWith({
             message: 'Ошибка при получении комментариев к посту',
         })
 
     });
 });