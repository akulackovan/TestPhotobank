import React, { useState, useEffect, Component, useContext } from 'react'
import axios from 'axios'
import { positions } from 'react-alert'
import { Redirect, Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import './PostPage.scss'


const PostPageComponent = ({ id, idUser }) => {

    const [post, setPost] = useState("")
    const [city, setCity] = useState('')
    const [error, setErrorMessage] = useState("")
    const [comment, setComment] = useState("")
    const [comments, setComments] = useState(null)
    const { userId } = useContext(AuthContext)
    const [like, setLike] = useState()
    console.log(userId)
    const [view, setView] = useState(false)

    const getLike = () => {
        axios({
            method: 'get',
            url: '/post/getLike',
            headers: {
                "content-type": "application/json"
            },
            params: {
                'idUser': userId,
                'idPost': id
            }
        })
            .then(response => {
                setLike(response.data.like)
                console.log(like)
            }).catch(error => {
                setErrorMessage(error.response.data.message)

                setTimeout(() => setErrorMessage(""), 2000)
            })
    }

    const getComments = () => {
        axios({
            method: 'get',
            url: '/post/comments',
            headers: {
                "content-type": "application/json"
            },
            params: {
                'id': id
            }
        })
            .then(response => {
                console.log(response.data)
                if (response.data.total.length == 0) {
                    setComments(null)
                    return
                }
                setComments(response.data.total)
            }).catch(error => {
                setErrorMessage(error.response.data.message)
                setTimeout(() => setErrorMessage(""), 2000)
            })
    }

    useEffect(() => {
        axios({
            method: 'get',
            url: '/post?id=',
            headers: {
                "content-type": "application/json"
            },
            params: {
                'id': id
            }
        })
            .then(response => {
                console.log(response.data.isPost)
                setPost(response.data.isPost)
                console.log(post)
                getComments()
                getLike()
                post.timestamps = post.timestamps.split('-')
                console.log(post.timestamps)

            }).catch(error => {
                setErrorMessage(error.response.data.message)
                setTimeout(() => setErrorMessage(""), 2000)
            })

    }, [])
    useEffect(() => {
        if (!view) {
            axios({
                method: 'post',
                url: '/post/addView',
                headers: {
                    "content-type": "application/json"
                },
                params: {
                    'id': id
                }
            })
                .then(response => {
                    console.log(response.data)
                    setView(true)

                }).catch(error => {
                    setErrorMessage(error.response.data.message)
                    setTimeout(() => setErrorMessage(""), 2000)
                })
        }
    }, [view])

    const changeForm = (event) => {
        if (!(comment.length <= 128)) {
            setErrorMessage("Имя пользователя должно быть меньше 128 символов");
            setTimeout(() => setErrorMessage(""), 2000)
            return;
        }
        setComment(event.target.value)
        console.log(comment)
    }

    const changeLike = async () => {
        try {
            await axios({
                method: 'post',
                url: '/post/setLike',
                params: {
                    'idPost': id,
                    'idUser': userId
                }
            })
                .then(response => {
                    setLike(response.data.like)
                })

                await axios({
                    method: 'get',
                    url: '/post/updateLike',
                    params: {
                        'idPost': id
                    }
                })
                    .then(response => {
                        setPost({...post, likes: response.data.likes})
                        console.log(response)
                    })
        }
        catch (error) {
            console.log(error)
            setErrorMessage(error.response.data.message)
            setTimeout(() => setErrorMessage(""), 2000)
        }
    }

    const commentHandler = async () => {

        try {
            await axios({
                method: 'post',
                url: '/post/comments',
                headers: {
                    "content-type": "application/json"
                },
                params: {
                    'postId': id,
                    'userId': userId,
                    'comment': comment
                }
            })
                .then(response => {
                    document.getElementById("inputs").reset()
                    getComments("")
                    setComment(null)
                })
        }
        catch (error) {
            console.log(error)
            setErrorMessage(error.response.data.message)
            setTimeout(() => setErrorMessage(""), 2000)
        }
    }

    return (
        <div className='allPost'>
            {error && <h6>Ошибка: {error}</h6>}
            {post &&
                <div className='back'>
                    <div className='one'>
                        <div >
                            <div className='user'>
                                <Link to={`/profile/${post.author._id}`} >
                                    <h4>{post.author.username}</h4>
                                </Link>
                            </div>
                            <div className='under'>
                                <div className='data'>
                                    {post.timestamps[8]}{post.timestamps[9]}\{post.timestamps[5]}{post.timestamps[6]}\{post.timestamps[2]}{post.timestamps[3]} &emsp; г.{post.city.city}
                                </div>
                            </div>
                        </div>
                        <img className='img' style={{ width: '738px', height: '590px' }} src={`${post.image}`} />
                        <div className='stat'>
                            <div>
                            Просмотры: {post.views} &emsp;&emsp;&emsp;Лайки: {post.likes}&emsp;&emsp;&emsp; Комментарии: {post.comments.length}
                            </div>

                        </div>
                        <div className='text' style={{width: '80%'}}>
                        <h5>Описание</h5>
                            {post.text}
                        </div>
                    </div>
                    <div className='second'>
                    <div className='comment'>
                    {!like && <button className='button like' onClick={changeLike} >ЛАЙК</button>}
                            {like && <button className='button dislike' onClick={changeLike}>ОТМЕНИТЬ ЛАЙК</button>}
                        
                            <form id='inputs'>
                                <textarea
                                    className="textarea"
                                    type="text"
                                    placeholder="Комментарий"
                                    name="text"
                                    onChange={changeForm}
                                    maxLength='128'
                                />
                            </form>
                            <div onClick={commentHandler}>
                                <button className='button'>Опубликовать</button>
                            </div>
                            {comments== 0 && <h3>Комментариев нет</h3>}
                        </div>
                        
                        {comments  && <div className='comments'>
                            <ul>
                                {comments.map(item => (
                                    <li>
                                        <h5>{item.user}</h5>
                                        <p>{item.comment}</p>
                                        <hr align="center" width="100%" size="2" color="" />
                                    </li>
                                ))}
                            </ul>
                        </div>}
                    </div>
                </div>

            }
        </div>
    )
}

export default PostPageComponent