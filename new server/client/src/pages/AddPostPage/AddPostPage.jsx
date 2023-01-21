import React, {useState, useContext} from 'react'
import {Redirect, Link} from "react-router-dom"
import axios from 'axios'
import './AddPostPage.scss'
import CityCombobox from '../../components/CityCombobox/CityCombobox'
import Cropper from "../../components/Cropper/cropper";
import {AuthContext} from "../../context/AuthContext";

// function encodeImageFileAsURL(element) {
//     var file = element.files[0];
//     var reader = new FileReader();
//     reader.readAsDataURL(file);
//     return reader.result
// }



const AddPostPage = () => {
    const [errorMessage, setErrorMessage] = React.useState("")
    const [redirect, setRedirect] = React.useState(false)
    const [formKey, setFormKey] = useState(0)
    const { userId } = useContext(AuthContext)
    const [form, setForm] = useState(
        {
            photo: '',
            city: '',
            description: '',
            userId: userId
        }
    )

    const changeForm = (event) => {
        console.log(event.target)
        setForm({...form, [event.target.name]: event.target.value})
        console.log(form)
    }

    const addPostHandler = async () => {
        console.log(form.city)
        if (form.photo == '') {
            setErrorMessage("Необходимо добавить фото");
            return;
        }
        if (form.city == '') {
            setErrorMessage("Необходимо выбрать город");
            return;
        }
        if (form.description.length > 512) {
            setErrorMessage("Описание поста должно содержать от 0 до 512 символов");
            return;
        }
        try {
            await axios.post('/post/post', {...form}, {
                headers:
                    {
                        'Context-Type': 'application/json'
                    }
            })
                .then(response => {
                    console.log(response)
                    setErrorMessage(response.data.message + "    Вы будете перенаправлены на страницу профиля через 5 секунд")
                    setTimeout(() => setRedirect(true), 5000)
                })
        } catch (error) {
            console.log(error)
            setErrorMessage(error.response.data.message)
        }
    }

    if (redirect) {
        return (
            <Redirect to='/profile'/>
        )
    }

    return (
        <div>
            <div className='addPost'>
                <div className='center back'>
                    <Cropper size = {16} y={360} x={480} setData={(value) => setForm({...form, photo: value})}></Cropper>
                    <br/>
                    <div style={{width: '80%', margin: 'auto', textAlign: 'left'}}>
                        <CityCombobox name='city' onChange={(value) => setForm({ ...form, city: value })} key={formKey} />
                    </div>
                    <div className='description'>
                        <input
                            className="input"
                            type="text"
                            placeholder="Описание"
                            name="description"
                            onChange={changeForm}
                        />
                    </div>

                    <button className='button' onClick={addPostHandler}>ЗАГРУЗИТЬ ФОТО</button>
                    {errorMessage && <div className="error"> {errorMessage} </div>}
                </div>
            </div>
        </div>
    )
}
export default AddPostPage

