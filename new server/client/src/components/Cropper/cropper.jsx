import { set } from 'mongoose'
import React, { useState } from 'react'
import ReactCrop from 'react-image-crop'

import 'react-image-crop/dist/ReactCrop.css'
import 'react-image-crop/src/ReactCrop.scss'


const Cropper = ({ x = 480, y = 480, onChange, size = 7 }) => {

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
        const temp = URL.createObjectURL(e.target.files[0])
        var img = new Image();
        
        img.onload = function() {
            setInfo({...info, x: img.width, y: img.height})
        }

        img.src = window.URL.createObjectURL( e.target.files[0] );
        
        console.log(info)
        if (e.target.files[0].size > 7340032) {
            setErrorMessage("Загружаемое фото пользователя должно быть не больше 7 Мб и иметь разрешение от 480х480")
            return
        }
        setInfo({...info, type: 'image/png' })
        console.log(info)
        setSrc(temp)
        setErrorMessage(null)
        setOutput(null)

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
        onChange({
            base64: arrayOfStrings[1],
            type: info.type
        })
    };

    const onLoadImg = ({ target: img }) => {
    };

    const ChangeCrop = () => {
        setOutput(null)
        setSrc(image)

    }

    return (
        <div className="App">
            <center>
                <input
                    className='button'
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        selectImage(e);
                    }}

                />

                <br />
                <br />
                <div>
                    {src && (
                        <div>
                            <ReactCrop src={src} onImageLoaded={setImage}
                                crop={crop} onChange={setCrop} locked='true'
                                zoomable={false}>
                                <img src={src} id="source" width={info.x} height={info.y} onChange={onLoadImg} />
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
