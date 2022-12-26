import React, {useState, useContext} from 'react'
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext'


const ProfilePage = () => {
    const {userId} = useContext(AuthContext)
    

    const [userProfileImage, setUserProfileImage] = useState({});


    const [form, setForm] = useState(
        {
            username: '',
            password: '',
            newpass: '',
            checkpass: '',
            text: '',
            city: ''
        }
    )

    axios.get('/auth/profile', { userId }, {
        headers:
        {
            'Context-Type': 'application/json'
        }
    })
        .then(response => {
        setUserProfileImage(`data:${response.data.user.typeImg};base64, ${Buffer.from(response.data.user.image).toString('base64')}`);
    });

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