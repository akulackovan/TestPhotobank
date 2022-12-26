import React, {useState, useContext} from 'react'
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext'
import {Buffer} from 'buffer';


 const ProfilePage = ()=> {
    const {userId} = useContext(AuthContext)


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
                    console.log(userProfileImage)
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
                <h3>ПРОФИЛЬ</h3>
                <img src={userProfileImage}/>
            </div>
        </div>
    )
}

export default ProfilePage