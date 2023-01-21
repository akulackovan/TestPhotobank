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
                    getComments()
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
            {error && <h1>{error}</h1>}
            {post &&
                <div className='back'>
                    <div >
                        <div >
                            <div className='user'>
                                <Link to={`/profile/${post.author._id}`} >
                                    {post.author.username}
                                </Link>
                            </div>
                            <div className='under'>
                                <div className='data' style={{ width: '300px' }}>
                                    {post.timestamps[8]}{post.timestamps[9]}\{post.timestamps[5]}{post.timestamps[6]}\{post.timestamps[2]}{post.timestamps[3]}
                                </div>
                                <div className='city'>
                                    г. {post.city.city}
                                </div>
                            </div>
                        </div>
                        <img className='img' style={{ width: '738px', height: '590px' }} src={`${post.image}`} />
                        <div className='stat'>
                            <svg className='icon'>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M11.9999 7.5C9.5146 7.5 7.49988 9.51472 7.49988 12C7.49988 14.4853 9.5146 16.5 11.9999 16.5C14.4852 16.5 16.4999 14.4853 16.4999 12C16.4999 9.51472 14.4852 7.5 11.9999 7.5ZM9.49988 12C9.49988 10.6193 10.6192 9.5 11.9999 9.5C13.3806 9.5 14.4999 10.6193 14.4999 12C14.4999 13.3807 13.3806 14.5 11.9999 14.5C10.6192 14.5 9.49988 13.3807 9.49988 12Z" fill="#000000" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M11.9998 2.5C7.80917 2.5 4.80627 4.84327 2.90279 7.0685C1.94654 8.18638 1.24425 9.29981 0.780854 10.1325C0.548544 10.55 0.374643 10.8998 0.257542 11.1484C0.198955 11.2727 0.154474 11.372 0.123909 11.4419C0.108623 11.4769 0.0968071 11.5046 0.0884377 11.5245L0.0784618 11.5483L0.0754044 11.5557L0.0743572 11.5583L0.0739539 11.5593L-0.0742188 11.9233L0.0645713 12.291L0.0649583 12.292L0.0659593 12.2947L0.0688703 12.3023L0.0783443 12.3266C0.0862884 12.3469 0.0975008 12.3751 0.112024 12.4107C0.141064 12.482 0.183381 12.583 0.23932 12.7095C0.351123 12.9623 0.517779 13.318 0.742125 13.7424C1.1896 14.5889 1.87305 15.7209 2.8177 16.8577C4.70134 19.1243 7.7068 21.5 11.9998 21.5C16.2929 21.5 19.2983 19.1243 21.182 16.8577C22.1266 15.7209 22.8101 14.5889 23.2576 13.7424C23.4819 13.318 23.6486 12.9623 23.7604 12.7095C23.8163 12.583 23.8586 12.482 23.8877 12.4107C23.9022 12.3751 23.9134 12.3469 23.9213 12.3266L23.9308 12.3023L23.9337 12.2947L23.9347 12.292L23.9351 12.291L24.0739 11.9233L23.9257 11.5593L23.9243 11.5557L23.9212 11.5483L23.9112 11.5245C23.9029 11.5046 23.8911 11.4769 23.8758 11.4419C23.8452 11.372 23.8007 11.2727 23.7421 11.1484C23.625 10.8998 23.4511 10.55 23.2188 10.1325C22.7554 9.29981 22.0531 8.18638 21.0969 7.0685C19.1934 4.84327 16.1905 2.5 11.9998 2.5ZM22.9998 11.9371C23.9354 12.2902 23.9351 12.291 23.9351 12.291L22.9998 11.9371ZM23.9257 11.5593C23.9257 11.5593 23.926 11.5601 22.9998 11.9371L23.9257 11.5593ZM0.99984 11.9371C0.0736306 11.5601 0.0739539 11.5593 0.0739539 11.5593L0.99984 11.9371ZM0.0645713 12.291C0.0645713 12.291 0.0642597 12.2902 0.99984 11.9371L0.0645713 12.291ZM2.51028 12.8077C2.32519 12.4576 2.18591 12.1632 2.09065 11.9504C2.19077 11.7404 2.33642 11.4501 2.52847 11.105C2.94543 10.3558 3.57456 9.35995 4.4226 8.36857C6.12769 6.37527 8.62479 4.5 11.9998 4.5C15.3749 4.5 17.872 6.37527 19.5771 8.36857C20.4251 9.35995 21.0542 10.3558 21.4712 11.105C21.6633 11.4501 21.8089 11.7404 21.909 11.9504C21.8138 12.1632 21.6745 12.4576 21.4894 12.8077C21.0881 13.5667 20.4781 14.5754 19.6438 15.5794C17.9694 17.5942 15.4749 19.5 11.9998 19.5C8.52477 19.5 6.03023 17.5942 4.3559 15.5794C3.52156 14.5754 2.91153 13.5667 2.51028 12.8077Z" fill="#000000" />
                            </svg>
                            <p>{post.views}</p>

                            <svg>
                                <path d="M2,22H18.644a3.036,3.036,0,0,0,3-2.459l1.305-7a2.962,2.962,0,0,0-.637-2.439A3.064,3.064,0,0,0,19.949,9H15.178V5c0-2.061-2.113-3-4.076-3a1,1,0,0,0-1,1c0,1.907-.34,3.91-.724,4.284L6.593,10H2a1,1,0,0,0-1,1V21A1,1,0,0,0,2,22ZM8,11.421l2.774-2.7c.93-.907,1.212-3.112,1.3-4.584.542.129,1.109.38,1.109.868v5a1,1,0,0,0,1,1h5.771a1.067,1.067,0,0,1,.824.38.958.958,0,0,1,.21.8l-1.3,7A1.036,1.036,0,0,1,18.644,20H8ZM3,12H6v8H3Z" /></svg>
                            <p>{post.likes}</p>

                            <svg>
                                <g clip-path="url(#clip0_429_11233)">
                                    <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 13.4876 3.36093 14.891 4 16.1272L3 21L7.8728 20C9.10904 20.6391 10.5124 21 12 21Z" stroke="#292929" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_429_11233">
                                        <rect width="24" height="24" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                            <p>{post.comments.length}</p>

                        </div>
                        <div>
                            {post.text}
                        </div>
                    </div>
                    <div className='second'>

                        <div className='comment'>
                            {like && <bitton >
                                <svg width="40px" height="40px">
                                    <path d="M2,22H18.644a3.036,3.036,0,0,0,3-2.459l1.305-7a2.962,2.962,0,0,0-.637-2.439A3.064,3.064,0,0,0,19.949,9H15.178V5c0-2.061-2.113-3-4.076-3a1,1,0,0,0-1,1c0,1.907-.34,3.91-.724,4.284L6.593,10H2a1,1,0,0,0-1,1V21A1,1,0,0,0,2,22ZM8,11.421l2.774-2.7c.93-.907,1.212-3.112,1.3-4.584.542.129,1.109.38,1.109.868v5a1,1,0,0,0,1,1h5.771a1.067,1.067,0,0,1,.824.38.958.958,0,0,1,.21.8l-1.3,7A1.036,1.036,0,0,1,18.644,20H8ZM3,12H6v8H3Z" /></svg>
                            </bitton>}
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
                        </div>

                        {comments && <div className='comments'>
                            <ul>
                                {comments.map(item => (
                                    <li>
                                        <h5>{item.user}</h5>
                                        <p>{item.comment}</p>
                                        <hr align="center" width="100%" size="2" color="#ff0000" />
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