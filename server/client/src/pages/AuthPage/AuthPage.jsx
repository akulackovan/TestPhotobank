import React from 'react'

const AuthPage = () => {
    return (
        <div className='auth'>
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
                <button>ВОЙТИ</button>
                <button>РЕГИСТРАЦИЯ</button>
            </div>
        </div>
    )
}

export default AuthPage