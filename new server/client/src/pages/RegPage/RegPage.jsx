import React, {useState} from 'react'
import { Link } from "react-router-dom"
import axios from 'axios'
import './RegPage.scss'


const RegPage = () => {

    const [form, setForm] = useState(
        {
            username: '',
            password: '',
            city: ''
        }
    )

    const changeForm = (event) => {
        setForm({...form, [event.target.name]: event.target.value})
        console.log(form)
    }

    const registerHandler = async () =>
    {
        try {
            await axios.post('/auth/reg', {...form}, {
                headers:
                {
                    'Context-Type': 'application/json'
                }
            })
            .then(response => console.log(response))
        }
        catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='box'>
            <div className='center auth-page'>
                <h3>ФОТОБАНК</h3>
                <input
                    className="login"
                    type="text"
                    placeholder="Логин"
                    name="username"
                    
                    onChange={changeForm}
                />
                <input
                    className="pass"
                    type="text"
                    placeholder="Пароль"
                    name="password"
                    
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
                onClick={registerHandler}
                >ЗАРЕГИСТРИРОВАТЬСЯ</button>
            </div>
        </div>
    )
}

export default RegPage