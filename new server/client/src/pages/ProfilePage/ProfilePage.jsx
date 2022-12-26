import React, {useState, useContext} from 'react'
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext'
import {Buffer} from 'buffer';


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
                    setUserProfileImage(`data:${response.data.user.typeImg};base64, ${Buffer.from(response.data.user.image).toString('base64')}`);
                    setUsername(response.data.user.username)
                    setText(response.data.user.text)
                }
               )
        }
        catch (error) {
            console.log(error)
        }
    }
    settingsHandler()
 
    return (
        <div className='auth'>
            <div className='center auth-page'>
                <img src={userProfileImage}/>
                <h3>{username}</h3>
                <dev>Описание {text}</dev>
                <dev>Город {city}</dev>
            </div>
        </div>
    )
}

export default ProfilePage