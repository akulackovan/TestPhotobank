import React from 'react'
import './NavBar.scss'

const NavBar = () => {
    


    return(
        <nav>
            <div className="nav-wrapper navbar">
                <a href='/popular' className="left photobank">ФОТОБАНК</a>
                <ul className="list">
                    <li><a href='/popular' className="listHeader">Популярное</a></li>
                    <li><a href='/subsc' className="listHeader">Подписки</a></li>
                    <li><a href='/profile' className="listHeader">Профиль</a></li>
                    <li><a href='/settings' className="listHeader">Настройки</a></li>
                </ul>
                    <form className="search" action="/search" method="get" >
                        <input
                            className="input"
                            type="text"
                            placeholder="ПОИСК"
                            name="user"
                        />
                    </form>

                    <button>Выйти</button>
                    
                </div> 
        </nav>
    )
}

export default NavBar