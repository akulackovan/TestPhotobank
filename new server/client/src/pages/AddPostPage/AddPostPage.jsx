import React, {useState, useContext} from 'react'
import {Redirect, Link} from "react-router-dom"
import axios from 'axios'
import './AddPostPage.scss'

const AddPostPage = () => {

    return (
        <div>
            <div className='addPost'>
                <div className='center back'>
                    <div className='photo'>
                        <input
                            className="input"
                            type="file"
                            placeholder="Фото"
                            name="photo"
                        />
                    </div>
                    <div className='city'>
                        <input
                            className="input"
                            type="text"
                            placeholder="Город"
                            name="city"
                        />
                    </div>
                    <div className='description'>
                        <input
                            className="input"
                            type="text"
                            placeholder="Описание"
                            name="username"
                        />
                    </div>

                    <button className='button'>ЗАГРУЗИТЬ ФОТО</button>
                </div>
            </div>
        </div>
    )
}

export default AddPostPage