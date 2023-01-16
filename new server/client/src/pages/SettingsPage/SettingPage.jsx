import React, { useContext, useState } from 'react'
import { Link, Redirect } from "react-router-dom"
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext'
import './SettingsPage.scss'
import CityCombobox from '../../components/CityCombobox/CityCombobox'
import { Gapped, Radio, RadioGroup } from '@skbkontur/react-ui';
import { useTheme } from '../../hooks/use.theme'

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

    const now = localStorage.getItem('app-theme')
    const [ newTheme, setNewTheme ] = useState(now)
    const { theme, setTheme } = useTheme()

    const changeTheme = (event) => {
        setNewTheme(event.target.value)
        console.log(newTheme)
    }

    const settingsHandler = async () => {

        if (form.username != '' && !form.username.match(/^[A-Za-z0-9]+$/)) {
            setErrorMessage("Имя пользователя должно содержать только цифры и латинские буквы");
            return;
        }
        if (!(form.username.length <= 128)) {
            setErrorMessage("Имя пользователя должно быть меньше 128 символов");
            return;
        }
        if (form.newpass != '' && !form.newpass.match(/^[A-Za-z0-9]+$/)) {
            setErrorMessage("Пароль должен содержать только цифры и латинские буквы");
            return;
        }
        if (!(form.newpass.length <= 128)) {
            setErrorMessage("Пароль должен быть меньше 128 символов");
            return;
        }
        if (!(form.checkpass == form.newpass)) {
            setErrorMessage("Пароли не совпадают");
            return;
        }
        if (!(form.text.length < 512)) {
            setErrorMessage("Описание должно быть меньше 512 символов");
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
                    console.log(newTheme)
                    setTheme(newTheme)
                    setErrorMessage(response.data.message)
                })
        }
        catch (error) {
            console.log(error)
            setErrorMessage(error.response.data.message)
        }
    }


    /*
        По требованиям нет кнопки выхода, перед сдачей почистить
    */
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
                            placeholder="Подтверждение нового пароля"
                            name="checkpass"
                            onChange={changeForm}
                        />
                    </div>
                    <div className='second' style={{ textAlign: 'left' }}>
                        <input
                            className="input"
                            type="text"
                            placeholder="Описание пользователя"
                            name="text"
                            onChange={changeForm}
                        />
                        <CityCombobox name='city' />
                    </div>
                </div>

                <div className='theme'>
                    <RadioGroup name="number-complex" defaultValue={now}>
                        <Gapped horizontal gap={0}>
                            <b>Тема: </b>
                            <Radio value="light" onChange={changeTheme}>Светлая</Radio>
                            <Radio value="dark" onChange={changeTheme}>Темная</Radio>
                        </Gapped>
                    </RadioGroup>
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