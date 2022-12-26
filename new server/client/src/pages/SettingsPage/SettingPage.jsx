import React, {useContext, useState} from 'react'
import { Link } from "react-router-dom"
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext'


const SettingsPage = () => {
    const { logout } = useContext(AuthContext)

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
            <div className='back'>
            
                <input
                    className="input"
                    type="text"
                    placeholder="Логин"
                    name="username"
                    onChange={changeForm}
                    
                />
                <input
                    className="input"
                    type="text"
                    placeholder="Cтарый пароль"
                    name="password"
                    onChange={changeForm}
                />
                <input
                    className="input"
                    type="text"
                    placeholder="Новый пароль"
                    name="newpass"
                    onChange={changeForm}
                />
                <input
                    className="input"
                    type="text"
                    placeholder="Подтверждение пароля"
                    name="checkpass"
                    onChange={changeForm}
                />
                <input
                    className="input"
                    type="text"
                    placeholder="Описание пользователя"
                    name="text"
                    onChange={changeForm}
                />
                <input
                    className="input"
                    type="text"
                    placeholder="Город"
                    name="city"
                    onChange={changeForm}
                />
                <button className='button'
                onClick={settingsHandler}>СОХРАНИТЬ</button>
                <button className='button'
                onClick={logout}><Link to="/auth">ВЫЙТИ</Link></button>
            </div>
        </div>
    )
}

export default SettingsPage