import React, {useContext, useEffect, useState} from 'react'
import axios from "axios";
import './PopularPage.scss'
import {Link} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import Loader from '../../components/Loader/Loader';

const PopularPage = () => {
    const { userId } = useContext(AuthContext)
    const [post, setPosts] = useState([])
    const [errorMessage, setErrorMessage] = React.useState("")
    const [isToday, setToday] = useState(true)
    const [loader, setLoader] = useState(true)
    
    useEffect(() => {
        try {
            axios({
                method: 'get',
                url: '/post/popular',
                headers: {
                    "x-auth-token": localStorage.getItem('auth-token'),
                    "content-type": "application/json"
                },
                params: {
                    id: userId
                }
            })
                .then(response => {
                        console.log(response.data.posts)
                        setPosts(response.data.posts)
                        setToday(response.data.isToday)
                        setLoader(false)
                    }
                )
                .catch(error => {
                    setErrorMessage(error.response.data.message)
                })

        } catch (error) {
            console.log(error)
            setErrorMessage(error.response.data.message)
        }
    }, [])

    if (errorMessage !== "") {
        return (
            <div className="wrapper1">
                <h1>{errorMessage}</h1>
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

    if (loader){
        return (
            <Loader />
        )
    }


    return (
        <div className="wrapper1">

            {post && <div className='gal1'>
                {!isToday && <h3>Фотографий за день нет</h3>}
                <div className="gallery1">
                    <ul className="center">
                        {post.map((option) => (
                            <Link to={`/post/${option._id}`}>
                                <li>
                                    <img style={{width: 400, height: 300}}
                                         href={'/post/' + option._id}
                                         src={option.image}
                                         />
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

export default PopularPage