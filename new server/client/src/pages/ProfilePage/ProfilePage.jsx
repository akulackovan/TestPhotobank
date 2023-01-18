import React, { useState, useContext, useEffect } from 'react'
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext'
import { Redirect, Link } from "react-router-dom"
import PostTable from '../../components/PostsTable/PostsTable'
import './ProfilePage.scss'

const ProfilePage = () => {
    const { userId } = useContext(AuthContext)
    const [username, setUsername] = useState('');
    const [text, setText] = useState('');
    const [post, setPost] = useState('');
    const [userProfileImage, setUserProfileImage] = useState({});
    const [subscriptions, setSubscriptions] = useState(0)
    const [posts, setPosts] = useState([])

    useEffect(() => {
        axios({
            method: 'get',
            url: '/auth/profile',
            headers: {
                "x-auth-token": localStorage.getItem('auth-token'),
                "content-type": "application/json"
            },
            params: {
                'userId': userId
            }
        })
            .then(response => {
                setUserProfileImage(`data:${response.data.user.typeImg};base64, ${response.data.user.image}`);
                setUsername(response.data.user.username)
                setText(response.data.user.text)
                setSubscriptions(response.data.subscriptions)
                console.log(response.data.subscibe)
                if (response.data.user.posts == "") {
                    setPost('Нет постов')
                }
            }
            )
    }, []);


    return (
        <div className='profile'>
            <div className='header'>
                <div className='first'>
                    <img className='img' src={userProfileImage} />
                </div>
                <div className='second'>
                    <div className='header'>
                        <div className='user'>{username}</div>
                    </div>
                    <div className='text'>
                        <div className='back2'>
                            <div className='h2'>Описание:</div>
                            {text == '' && <div> Нет описания</div>}
                            {text != '' && <div> {text} </div>}
                        </div>
                        <div className='back2'>
                            <div className='h2'>Количество подписчиков: {subscriptions}</div>
                        </div>
                        <div>
                            <button className='button'><Link to='addpost'>Добавить фото</Link></button>
                        </div>
                    </div>
                </div>
            </div>
            <div><PostTable id={userId}/></div>
        </div>
    )
}

export default ProfilePage