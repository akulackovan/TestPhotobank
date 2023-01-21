import React, {useEffect, useState} from 'react'
import axios from "axios";
import './SubscribePage.scss'
import {Link} from "react-router-dom";

const SubscribePage = () => {
    const [post, setPosts] = useState([])
    const [errorMessage, setErrorMessage] = React.useState("")
    const [postId, setPostId] = useState(null)
    const [isToday, setToday] = useState(true)
    const imageClick = (id) => {
        console.log(id);
        setPostId(id)

    }


    useEffect(() => {
        try {
            axios({
                method: 'get',
                url: '/post/subsc',
                headers: {
                    "x-auth-token": localStorage.getItem('auth-token'),
                    "content-type": "application/json"
                }
            })
                .then(response => {
                        console.log(response.data.posts)
                        setPosts(response.data.posts)

                    }
                )

        } catch (error) {
            console.log(error)
            setErrorMessage(error.response.data.message)
        }
    }, [])

    if (errorMessage !== "") {
        return (
            <div className="wrapper1">
                <h1>${errorMessage}</h1>
            </div>
        )
    }

    if (post === []) {
        return (
            <div className="wrapper1">
                <h1>Нет постов</h1>
            </div>
        )
    }


    return (
        <div className="wrapper1">

            {post && <div className='gal1'>
                <div className="gallery1">
                    <ul className="center">
                        {post.map((option) => (
                            <Link to={`/post/${option._id}`}>
                                <li>
                                    <img style={{width: 400, height: 300}}
                                         href={'/post/' + option._id}
                                         src={option.image}
                                         onClick={() => imageClick(option)}/>
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

export default SubscribePage