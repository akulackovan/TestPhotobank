import React, { useState, useEffect, Component } from 'react'
import axios from 'axios'
import './PostTable.scss'
import { Redirect, Link } from 'react-router-dom'

const PostTable = ({ id }) => {

    const [post, setPost] = useState(null)
    const [postId, setPostId] = useState(null)
    const imageClick = (id) => {
        console.log(id);
        setPostId(id)

    }

    useEffect(() => {
        try {
            axios({
                method: 'get',
                url: '/post/getMe',
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
                }
                )
        }
        catch (error) {
            console.log(error)
            setPost(error.response.data.message)
        }
    }, []);

    if (post == [])
    {return (
        <div className="wrapper">
            <h1>Нет постов</h1>
        </div>
    )
    }


    return (
        <div className="wrapper">
            {post && <div className='gal'>
                <div className="gallery">
                    <ul>
                        {post.map((option) => (
                            <Link to={`/post/${option._id}`}>
                            <li>
                                    <img style={{ width: 351, height: 262 }}
                                        href={'/post/'+option._id}
                                        src={`data:img/png;base64, ${option.image}`} onClick={() => imageClick(option)} />
                                </li>
                                </Link>
                        ))}

                    </ul>
                </div>
                <div>
                    <h2 className='h2'>Фотографии закончились</h2>
                </div>
            </div>}
        </div>


    )
}

export default PostTable