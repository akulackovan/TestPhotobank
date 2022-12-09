import React from 'react'
import './AuthPage.scss'

const AuthPage = () => {
    return(
        <React.Fragment>
            <div className='box'>
                <div className='center auth-page'>
                    <h3>ФОТОБАНК</h3>
                    <input
                                className="login"
                                type="text"
                                placeholder="Логин"
                                name="user"
                            />
                    <input
                                className="pass"
                                type="text"
                                placeholder="Пароль"
                                name="user"
                            />
                    <input
                                className="city"
                                type="text"
                                placeholder="Город"
                                name="user"
                            />

                <button>ЗАРЕГИСТРИРОВАТЬСЯ</button>

                </div>
            </div>
        </React.Fragment>
    )
}

export default AuthPage