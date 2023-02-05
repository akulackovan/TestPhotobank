import React, {useContext, useEffect, useState} from 'react'
import axios from "axios";
import {Link} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import Loader from '../../components/Loader/Loader';
import PostTable from '../../components/PostsTable/PostsTable';

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
                    setLoader(false)
                })

        } catch (error) {
            console.log(error)
            setErrorMessage(error.response.data.message)
            setLoader(false)
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
                <PostTable post={post}/>
            </div>}
        </div>


    )
}

export default PopularPage