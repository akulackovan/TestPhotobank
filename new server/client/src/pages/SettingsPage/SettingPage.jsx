import React, { useContext, useState } from 'react'
import { Link, Redirect } from "react-router-dom"
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext'
import './SettingsPage.scss'
import ReactCrop from "react-image-crop";
import  { useRef } from "react";

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
    const [selectedImage, setSelectedImage] = useState(null);

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



    /*return (
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
                
                <button className='button'
                    onClick={settingsHandler}>СОХРАНИТЬ</button>
                <button className='button'
                    onClick={changeOut}>ВЫЙТИ</button>
                {errorMessage && <div className="error"> {errorMessage} </div>}
            </div>
    )*/

    const inputRef = useRef();

    const handleOnChange = (event) => {
      if (event.target.files && event.target.files.length > 0) {
        const reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = function (e) {
          onImageSelected(reader.result);
        };
      }
    };
  
    const onChooseImg = () => {
      inputRef.current.click();
    };
  
    return (
      <div>
        <input
          type="file"
          accept="image/*"
          ref={inputRef}
          onChange={handleOnChange}
          style={{ display: "none" }}
        />
  
        <button className="btn" onClick={onChooseImg}>
          Choose Image
        </button>
      </div>
    );
}

export default SettingsPage