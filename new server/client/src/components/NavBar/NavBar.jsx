import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import './NavBar.scss'

const NavBar = () => {
    const [form, setForm] = useState("")
    const [str, setStr] = useState("")

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            setStr('/search/' + form)
        }
    }

    const changeForm = (event) => {
        setForm(event.target.value)
    }

    if (str) {
        return (<Redirect to={str} />)
    }

    return (
        <div className='nav-container'>
            <div className="nav">
                
                <div className='logo-text'>ФОТОБАНК
                </div>


                {/* Список ссылок по требованиям к navbar */}
                <div className='nav-elements'>
                    <ul className="list">
                        <li><a href='/popular'>Популярное</a></li>
                        <li><a href='/subsc'>Подписки</a></li>
                        <li><a href='/profile'>Профиль</a></li>
                        <li><a href='/settings'>Настройки</a></li>
                        <li>
                            <input
                                className="input"
                                type="text"
                                placeholder="ПОИСК"
                                name="user"
                                onKeyPress={handleKeyPress}
                                onChange={changeForm}
                                width='10'
                            />
                        </li>
                    </ul>

                </div>
            </div>
        </div>
    )
}

export default NavBar