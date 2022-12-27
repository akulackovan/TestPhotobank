import React, {useState, useContext} from 'react'
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext'
import { Redirect, Link } from "react-router-dom"
import './ProfilePage.scss'

 const ProfilePage = ()=> {
    const {userId} = useContext(AuthContext)


    const [username, setUsername] = useState('');
    const [city, setCity] = useState('');
    const [text, setText] = useState('');
    const [userProfileImage, setUserProfileImage] = useState({});

    console.log(userId)

    const settingsHandler = async () =>
    {
        try {
            await axios({
                method: 'get',
                url: '/auth/profile',
                headers: {"x-auth-token": localStorage.getItem('auth-token'),
                "content-type": "application/json" },
                params: {
                    'userId': userId
                }
            })
            .then(response => 
                {
                    setUserProfileImage(`data:${response.data.user.typeImg};base64, ${response.data.user.image}`);
                    setUsername(response.data.user.username)
                    setText(response.data.user.text)
                    axios({
                        method: 'get',
                        url: '/city/getcity',
                        headers: {"x-auth-token": localStorage.getItem('auth-token'),
                        "content-type": "application/json" },
                        params: {
                            'cityId': response.data.user.city
                        }
                    })
                    .then(response => 
                        {
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
            <div className='back'>
                <div className='header'>
                    <div className='first'>
                <img className='img' src={userProfileImage}/>
                </div>
                <div className='second'>
                <div className='username'>{username}</div>
                <h3>Описание:</h3>
                    {text == '' && <h3> Нет описания </h3>}
                    {text != '' && <h3> {text} </h3>}
                <h3>Город {city}</h3>
                <button className='button'><Link to='addpost'>Добавить фото</Link></button>
                </div>
            </div>
            </div>
        </div>
    )
}

export default ProfilePage