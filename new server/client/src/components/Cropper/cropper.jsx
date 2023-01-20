import { set } from 'mongoose'
import React, { useState, useEffect } from 'react'
import ReactCrop from 'react-image-crop'

import 'react-image-crop/dist/ReactCrop.css'
import 'react-image-crop/src/ReactCrop.scss'
import './cropper.scss'

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
    const [output, setOutput] = useState(null)
    const [start, setStart] = useState(true)
    const [error, setErrorMessage] = useState(null)

    const selectImage = (e) => {
        const temp = URL.createObjectURL(e.target.files[0])
        var img = new Image();
        //var filePath = e.target.files[0].val(); 
        //var file_ext = filePath.substr(filePath.lastIndexOf('.')+1,filePath.length);
        img.onload = function () {
            setInfo({ ...info, x: img.width, y: img.height })
        }

        img.src = window.URL.createObjectURL(e.target.files[0]);

        console.log( e.target.files[0])
        if (e.target.files[0].size > 7340032) {
            setErrorMessage("Загружаемое фото пользователя должно быть не больше 7 Мб и иметь разрешение от 480х480")
            return
        }
        setInfo({ ...info, type:  e.target.files[0].type})
        console.log(e.target.files[0].type)
        setSrc(temp)
        setErrorMessage(null)
        onSelect(true)
        setStart(false)
        setOutput(null)
        console.log(start)
    }

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
        console.log(base64Image)
        onChange(base64Image)
        onSelect(false)
    };

    const onLoadImg = ({ target: img }) => {
        setInfo({ ...info, y: img.height, x: img.width })
        if (img.width > 800)
        {
            
        
        console.log(img.width)
            setInfo({ ...info, y: img.height / 2, x: img.width / 2})
        }
        
        console.log(info)
    };

    const ChangeCrop = () => {
        setOutput(null)
        setSrc(image)
        onSelect(true)
    }


    return (
        <div className="App">
            <center>
                {start && (
                <label class="button" >
                    ДОБАВИТЬ ФОТО
                <input
                    style={{display: 'none'}}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        selectImage(e);
                    }
                }
                />
            </label>)
                
                }
                <div>
                    {src && (
                        <div style={{ width: info.x, height: info.y }}>
                            <ReactCrop src={src} onImageLoaded={setImage}
                                crop={crop} onChange={setCrop} locked='true'
                                zoomable={false}>
                                <img src={src} id="source" width={info.x} height={info.y} onChange={onLoadImg} />
                            </ReactCrop>
                            <button className="button " style={{ width: '50%' }} onClick={cropImageNow}>Обрезать</button>
                            <label class="button" >
                    Изменить фото
                <input
                    style={{display: 'none'}}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        selectImage(e);
                    }
                }
                />
            </label>
                        </div>
                    )}
                </div>
                {output &&
                    <div>
                        <img src={output} />
                        <button className="button " onClick={ChangeCrop}>Изменить область</button>
                        <label class="button" >
                    Изменить фото
                <input
                    style={{display: 'none'}}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        selectImage(e);
                    }
                }
                />
            </label></div>}
                <div>{error}</div>
            </center>
        </div>
    );
}

export default Cropper
