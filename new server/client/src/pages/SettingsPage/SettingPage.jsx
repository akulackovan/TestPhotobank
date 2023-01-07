import React, { useContext, useState } from 'react'
import { Link, Redirect } from "react-router-dom"
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext'
import './SettingsPage.scss'
import CityCombobox from '../../components/CityCombobox/CityCombobox'

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

        if(form.username != '' && !form.username.match(/^[A-Za-z0-9]+$/)){
            setErrorMessage("Имя пользователя должно содержать только цифры и латинские буквы");
            return;
         }
         if(!(form.username.length <= 128)){
            setErrorMessage("Имя пользователя должно быть меньше 128 символов");
            return;
         }
         if(form.newpass != '' && !form.newpass.match(/^[A-Za-z0-9]+$/)){
            setErrorMessage("Пароль должен содержать только цифры и латинские буквы");
            return;
         }
         if(!(form.newpass.length <= 128)){
            setErrorMessage("Пароль должен быть меньше 128 символов");
            return;
         }
         if(!(form.checkpass == form.newpass)){
            setErrorMessage("Пароли не совпадают");
            return;
         }
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
                        <CityCombobox />
                    </div>
                </div>
                
                <button className='button'
                    onClick={settingsHandler}>СОХРАНИТЬ</button>
                <button className='button'
                    onClick={changeOut}>ВЫЙТИ ИЗ АККАУНТА</button>
                {errorMessage && <div className="error"> {errorMessage} </div>}
            </div>
        </div>
    )
}

export default SettingsPage