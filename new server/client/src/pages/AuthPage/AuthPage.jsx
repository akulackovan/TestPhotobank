import React, {useState, useContext} from 'react'
import { Redirect } from "react-router-dom"
import axios from 'axios'
import './AuthPage.scss'
import { AuthContext } from '../../context/AuthContext'

const AuthPage = () => {

    const [form, setForm] = useState(
        {
            username: '',
            password: ''
        }
    )
    const [errorMessage, setErrorMessage] = React.useState("");
    const [redirect, setRedirect] = React.useState(false);
    const [token, setToken] = React.useState("");
    const [userId, setUserID] = React.useState("");
    const [authRed, setAuthRed] = React.useState(false);
    
    const changeForm = (event) => {
        setForm({...form, [event.target.name]: event.target.value})
        console.log(form)
    }

    const { login } = useContext(AuthContext)


    const authHandler = async () =>
    {
        try {
            await axios.post('/auth/login', {...form}, {
                headers:
                {
                    'Context-Type': 'application/json'
                }
            })
            .then(response => 
                {
                setAuthRed(true)
                
                console.log(authRed)
                console.log("authRed")
                console.log("RES")  
                setToken(response.data.token)
                setUserID(response.data.user._id)              
        })
        }
        catch (error) {
            console.log(error)
            setErrorMessage(error.response.data.message)
        }
    }

    const handleOnClick = async () => {
        setRedirect(true)
    }
    console.log(authRed)
    console.log("authRed")
    if (authRed)
    {
        login(token, userId)
        return(
            <Redirect to='/popular'/>
        )
    }

    return (
        <div className='auth'>
            <div className='center back'>
                <h3 className="head">ФОТОБАНК</h3>
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
                    <button className='button'
                    onClick={authHandler}>ВОЙТИ</button>
                    <button className='button' onClick={handleOnClick}>РЕГИСТРАЦИЯ</button>
                    {errorMessage && <div className="error"> {errorMessage} </div>}
                    {redirect && <Redirect to='/reg'/>}
            </div>
        </div>
    )
}

export default AuthPage