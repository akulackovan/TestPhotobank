import React, { useContext, useState } from 'react'
import { Link, Redirect } from "react-router-dom"
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext'
import './SettingsPage.scss'
import CityCombobox from '../../components/CityCombobox/CityCombobox'
import { Gapped, Radio, RadioGroup } from '@skbkontur/react-ui';
import { useTheme } from '../../hooks/use.theme'
import Cropper from '../../components/Cropper/cropper'

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
            city: '',
            base64: '',
            type: ''
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
                    setTimeout(() => setErrorMessage(""), 2000)
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
            <div className='container-s'>
                <div className='rowC'>
                    <div className='fiels'>
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
                    <div className='sec' style={{ textAlign: 'left' }}>
                        <input
                            className="input"
                            type="text"
                            placeholder="Описание пользователя"
                            name="text"
                            onChange={changeForm}
                        />
                        <CityCombobox name='city' onChange={(value) => setForm({...form, city: value})}/>
                    </div>
                </div>

                <div className='theme'>
                    <RadioGroup name="number-complex" defaultValue={now}>
                        <Gapped horizontal gap={0}>
                            <b>Тема: </b>
                            <Radio className ="radio" value="light" onChange={changeTheme}/> <b>Светлая</b>
                            <Radio className ="radio" value="dark" onChange={changeTheme} /> <b>Темная</b>
                        </Gapped>
                    </RadioGroup>
                </div>
                <Cropper onChange={(value) => setForm({...form, base64: value.base64, type: value.type})} />
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