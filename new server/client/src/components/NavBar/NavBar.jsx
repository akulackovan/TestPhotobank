import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import './NavBar.scss'

const NavBar = () => {
    const [form, setForm] = useState("")
    const [str, setStr] = useState("")

    const handleKeyPress = (event) => {
        if(event.key === 'Enter'){
            setStr('/search/' + form)
        }
      }

      const changeForm = (event) => {
        setForm(event.target.value)
        console.log(form)
    }

    if (str)
    {
        return(<Redirect to={str}/>)
    }

    return (
        <nav>
            <div className="nav-wrapper navbar">
                <a href='/popular' className="left photobank">ФОТОБАНК</a>
                <ul className="list">
                    <li><a href='/popular' className="listHeader">Популярное</a></li>
                    <li><a href='/subsc' className="listHeader">Подписки</a></li>
                    <li><a href='/profile' className="listHeader">Профиль</a></li>
                    <li><a href='/settings' className="listHeader">Настройки</a></li>
                </ul>
                <div className="search">
                    <input
                        className="input"
                        type="text"
                        placeholder="ПОИСК"
                        name="user"
                        onKeyPress={handleKeyPress}
                        onChange={changeForm}                        
                    />
                </div>
            </div>
        </nav>
    )
}

export default NavBar