import { set } from 'mongoose'
import React, { useState, useEffect } from 'react'
import ReactCrop from 'react-image-crop'

import 'react-image-crop/dist/ReactCrop.css'
import 'react-image-crop/src/ReactCrop.scss'


const Cropper = ({ x = 480, y = 480, onChange, size = 7, onSelect }) => {

    const [info, setInfo] = useState({
        x: null,
        y: null,
        type: null
    })

    const [src, setSrc] = useState(null);
    const [crop, setCrop] = useState({
        unit: 'px',
        width: x,
        height: y,
        x: 0,
        y: 0
    })
    const [image, setImage] = useState(null);
    const [output, setOutput] = useState(null);
    const [error, setErrorMessage] = useState(null)

    const selectImage = (e) => {
        setErrorMessage(null)
        onSelect(true)
        setOutput(null)
        setSrc(null)
        const temp = URL.createObjectURL(e.target.files[0])
        var img = new Image();
        img.onload = function () {
            setInfo({ ...info, y: img.height, x: img.width })

        }

        img.src = window.URL.createObjectURL(e.target.files[0]);

        console.log(info)
        if (e.target.files[0].size > 7340032) {
            setErrorMessage("Загружаемое фото пользователя должно быть не больше 7 Мб и иметь разрешение от 480х480")
            return
        }
        setInfo({ ...info, type: 'image/png' })
        console.log(info)
        setSrc(temp)

    };

    const cropImageNow = () => {
        const canvas = document.createElement('canvas')
        canvas.width = crop.width
        canvas.height = crop.height
        const ctx = canvas.getContext('2d')
        const image = document.getElementById("source")

        ctx.drawImage(
            image,
            crop.x,
            crop.y,
            crop.width,
            crop.height,
            0,
            0,
            crop.width,
            crop.height,
        )
        const base64Image = canvas.toDataURL(info.type)
        setOutput(base64Image)
        setImage(src)
        setSrc(null)
        var arrayOfStrings = base64Image.split('base64,')
        onChange(base64Image)
        console.log(base64Image)
        onSelect(false)
    };


    const ChangeCrop = () => {
        setSrc(image)
        setOutput(null)
    }


    return (
        <div className="App">
            <center>
                <label class="button" >
                    Загрузить фото
                    <input
                        className='button'
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            selectImage(e);
                        }}
                        style={{ display: 'none' }}/>
                </label>
                <div>
                    {src && (
                        <div style={{ width: info.x, height: info.y }}>
                            <ReactCrop style={{ width: info.x, height: info.y }} src={src} onImageLoaded={setImage}
                                crop={crop} onChange={setCrop} locked='true'
                                zoomable={false}>
                                <img src={src} id="source" width={info.x} height={info.y} />
                            </ReactCrop>
                            <br />
                            <button className="button " onClick={cropImageNow}>Обрезать</button>
                            <br />
                            <br />
                        </div>
                    )}
                </div>
                {output && <div><img src={output} />
                    <button className="button " onClick={ChangeCrop}>Изменить область</button></div>}

                <div>{error}</div>
            </center>
        </div>
    );
}

export default Cropper