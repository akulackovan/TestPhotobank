import React, { useState, useContext } from 'react'
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext'
import { Redirect, Link } from "react-router-dom"
import './ProfilePage.scss'

const ProfilePage = () => {
    const { userId } = useContext(AuthContext)


    const [username, setUsername] = useState('');
    const [city, setCity] = useState('');
    const [text, setText] = useState('');
    const [post, setPost] = useState('');
    const [userProfileImage, setUserProfileImage] = useState({});

    console.log(userId)

    const settingsHandler = async () => {
        try {
            await axios({
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
                    if (response.data.user.posts == "") {
                        setPost('Нет постов')
                    }
                    else {
                        setPost('Посты есть, но отображаться пока не хотят((')
                    }
                    axios({
                        method: 'get',
                        url: '/city/getcity',
                        headers: {
                            "x-auth-token": localStorage.getItem('auth-token'),
                            "content-type": "application/json"
                        },
                        params: {
                            'cityId': response.data.user.city
                        }
                    })
                        .then(response => {
                            setCity(response.data.isCity.city)
                        }
                        )
                }
                )
        }
        catch (error) {
            console.log(error)
        }
    }
    settingsHandler()

    return (
        <div className='profile'>
            <div className='back1'>
                <div className='header'>
                    <div className='first'>
                        <img className='img' src={userProfileImage} />
                    </div>
                    <div className='second'>
                        <div className='in'>
                            <div className='header'>
                                <div className='user'>{username}</div>
                                <div className='city'>г. {city}</div>
                            </div>
                            <div className='text'>
                                <div className='back2'>
                                    <div className='h2'>Описание:</div>
                                    {text == '' && <div> Нет описания</div>}
                                    {text != '' && <div> {text} </div>}
                                </div>
                            </div>
                            <div className='end'>
                                <div className='sub'>
                                    <div className='h2'>Количество подписчиков: </div>
                                    60000000
                                </div>
                                <button className='button'><Link to='addpost'>Добавить фото</Link></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <h3 className='h3'>{post}</h3>
        </div>
    )
}

export default ProfilePage