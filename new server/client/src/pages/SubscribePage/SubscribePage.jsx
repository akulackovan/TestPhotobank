import React, {useContext, useEffect, useState} from 'react'
import axios from "axios";
import {AuthContext} from "../../context/AuthContext";
import PostTable from '../../components/PostsTable/PostsTable';
import Loader from '../../components/Loader/Loader';

const SubscribePage = () => {
    const {userId} = useContext(AuthContext)
    const [post, setPosts] = useState([])
    const [errorMessage, setErrorMessage] = React.useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        try {
            axios({
                method: 'get',
                url: '/post/subscription',
                headers: {
                    "x-auth-token": localStorage.getItem('auth-token'),
                    "content-type": "application/json"
                },
                params: {
                    id: userId
                }
            })
                .then(response => {
                        console.log(response.data.returnedPosts)
                        setPosts(response.data.returnedPosts)
                        setLoading(false)
                    }
                ).catch(error => {
                console.log("HERE " + error.response.data.message)
                if (error) {
                    setErrorMessage(error.response.data.message)
                    setLoading(false)
                }
            })

        } catch {
        }
    }, [])

    if (loading){
        return(
            <Loader />
        )
    }

    if (errorMessage !== "") {
        return (
            <div className="head">
                <h1 className='center head'>{errorMessage}</h1>
                <hr className='hr center' style={{margin: '0 auto 50px auto'}}/>
            </div>
        )
    }

    if (post.length === 0) {
        return (
            <div className="head">
                <h1 className='center head'>Нет постов</h1>
                <hr className='hr center' style={{margin: '0 auto 50px auto'}}/>
            </div>
        )
    }

    return (
        <div style={{width: '80%', marginLeft: 'auto', marginRight: 'auto'}}>
            {errorMessage && <div className="head">errorMessage</div>}
            <PostTable post={post}/>
            <hr className='hr center' style={{margin: '0 auto 50px auto'}}/>
        </div>
    )
}

export default SubscribePage