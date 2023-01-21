import React, { useState } from 'react'
import axios from 'axios'
import './RegPage.scss'
import { Link, Redirect } from 'react-router-dom'
import CityCombobox from '../../components/CityCombobox/CityCombobox'

const RegPage = () => {

    const [form, setForm] = useState(
        {
            username: '',
            password: '',
            city: ''
        }
    )
    const [errorMessage, setErrorMessage] = React.useState("")
    const [redirect, setRedirect] = React.useState(false)


    const changeForm = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value })
        console.log(form)
    }

   
    const registerHandler = async () => {
        if (!form.username.match(/^[A-Za-z0-9]+$/)) {
            setErrorMessage("Имя пользователя должно содержать только цифры и латинские буквы");
            setTimeout(() => setErrorMessage(""), 2000)
            return;
        }
        if (!(form.username.length < 128)) {
            setErrorMessage("Имя пользователя должно быть меньше 128 символов");
            setTimeout(() => setErrorMessage(""), 2000)
            return;
        }
        if (!form.password.match(/^[A-Za-z0-9]+$/)) {
            setErrorMessage("Пароль должен содержать только цифры и латинские буквы");
            setTimeout(() => setErrorMessage(""), 2000)
            return;
        }
        if (!(form.password.length < 128)) {
            setErrorMessage("Пароль должен быть меньше 128 символов");
            setTimeout(() => setErrorMessage(""), 2000)
            return;
        }
        try {
            await axios.post('/auth/reg', { ...form }, {
                headers:
                {
                    'Context-Type': 'application/json'
                }
            })
                .then(response => {
                    console.log(response)
                    setErrorMessage(response.data.message + "    Вы будете перенаправлены на страницу авторизации через 5 секунд")
                    setTimeout(() => setRedirect(true), 5000)
                })
        }
        catch (error) {
            console.log(error)
            setErrorMessage(error.response.data.message)
        }
    }


    if (redirect) {
        return (
            <Redirect to='/auth' />
        )
    }

    return (
        <div className='box'>
            <div className='center back'>
                <h3 className='head'>ФОТОБАНК</h3>
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
                    placeholder="Пароль"
                    name="password"
                    onChange={changeForm}
                />
                <div style={{width: '80%', margin: 'auto', textAlign: 'left'}}>
                <CityCombobox className="city" name="city" onChange={(value) => setForm({...form, city: value})} />
                </div>
                <button
                    className='button'
                    onClick={registerHandler}
                >ЗАРЕГИСТРИРОВАТЬСЯ</button>
                {errorMessage && <div className="error"> {errorMessage} </div>}
                <a className='link'><Link to="/auth">ОБРАТНО</Link></a>

            </div>
        </div>
    )
}

export default RegPage