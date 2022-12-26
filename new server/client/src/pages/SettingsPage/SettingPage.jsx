import React, {useContext, useState} from 'react'
import { Link } from "react-router-dom"
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext'


const SettingsPage = () => {

    const {userId} = useContext(AuthContext)
    const [form, setForm] = useState(
        {
            userId: userId,
            username: '',
            password: '',
            newpass: '',
            checkpass: '',
            text: '',
            city: ''
        }
    )

    const changeForm = (event) => {
        setForm({...form, [event.target.name]: event.target.value})
        console.log(form)
    }


    const settingsHandler = async () =>
    {
        try {
            await axios.post('/settings', {...form}, {
                headers:
                {
                    'Context-Type': 'application/json'
                }
            })
            .then(response => 
                console.log(response))
        }
        catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='settings'>
            <div className='center auth-page'>
                <h3>ФОТОБАНК</h3>
                <input
                    className="username"
                    type="text"
                    placeholder="Логин"
                    name="username"
                    onChange={changeForm}
                    
                />
                <input
                    className="password"
                    type="text"
                    placeholder="Cтарый пароль"
                    name="password"
                    onChange={changeForm}
                />
                <input
                    className="newpass"
                    type="text"
                    placeholder="Новый пароль"
                    name="newpass"
                    onChange={changeForm}
                />
                <input
                    className="checkpass"
                    type="text"
                    placeholder="Подтверждение пароля"
                    name="checkpass"
                    onChange={changeForm}
                />
                <input
                    className="text"
                    type="text"
                    placeholder="Описание пользователя"
                    name="text"
                    onChange={changeForm}
                />
                <input
                    className="city"
                    type="text"
                    placeholder="Город"
                    name="city"
                    onChange={changeForm}
                />
                <button
                onClick={settingsHandler}>СОХРАНИТЬ</button>
            </div>
        </div>
    )
}

export default SettingsPage