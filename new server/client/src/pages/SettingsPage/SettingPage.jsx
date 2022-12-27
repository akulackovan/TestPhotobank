import React, { useContext, useState } from 'react'
import { Link, Redirect } from "react-router-dom"
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext'
import './SettingsPage.scss'

const SettingsPage = () => {
    const { logout } = useContext(AuthContext)

    const { userId } = useContext(AuthContext)
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
    const [errorMessage, setErrorMessage] = React.useState("")
    const [log, setLog] = React.useState(false)

    const changeForm = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value })
        console.log(form)
    }

    const changeOut = (event) => {
        setLog(true)
    }


    const settingsHandler = async () => {
        try {
            await axios.post('/settings', { ...form }, {
                headers:
                {
                    'Context-Type': 'application/json'
                }
            })
                .then(response => {

                    console.log(response)
                    setErrorMessage(response.data.message)
                })
        }
        catch (error) {
            console.log(error)
            setErrorMessage(error.response.data.message)
        }
    }

    if (log) {
        logout()
        return (
            <Redirect to="/auth" />
        )
    }



    return (
        <div className='settings'>
            <div className='back'>
                <div className='rowC'>
                    <div className='first'>
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
                    </div>
                    <div className='second'>
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
                    </div>
                </div>
                <div className='theme'>
                <h2 className='radio1'>Тема:</h2>
                        <div className="radio">
                            <label>
                                <input type="radio" value="option1" checked={true} />
                                <h2 className='radio1'>Светлая</h2>
                            </label>
                        </div>
                        <div className="radio">
                            <label>
                                <input type="radio" value="option2" checked={false}/>
                                <h2 className='radio1'>Темная</h2>
                            </label>
                        </div>
                </div>
                <button className='button'
                    onClick={settingsHandler}>СОХРАНИТЬ</button>
                <button className='button'
                    onClick={changeOut}>ВЫЙТИ</button>
                {errorMessage && <div className="error"> {errorMessage} </div>}
            </div>
        </div>
    )
}

export default SettingsPage