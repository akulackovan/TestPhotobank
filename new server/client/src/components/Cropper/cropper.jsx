import {set} from 'mongoose'
import React, {useState, useEffect} from 'react'
import ReactCrop from 'react-image-crop'
import "./cropper.scss"

import 'react-image-crop/dist/ReactCrop.css'
import 'react-image-crop/src/ReactCrop.scss'


const Cropper = ({x = 480, y = 480, size = 7, setData}) => {
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
        const name = e.target.files[0].name
        if (!((name[name.length - 1] == 'g' && name[name.length - 2] == 'n' && name[name.length - 3] == 'p' && name[name.length - 4] == '.') ||
            (name[name.length - 1] == 'g' && name[name.length - 2] == 'p' && name[name.length - 3] == 'j' && name[name.length - 4] == '.') ||
            (name[name.length - 1] == 'g' && name[name.length - 2] == 'e' && name[name.length - 3] == 'p' && name[name.length - 4] == 'j' && name[name.length - 5] == '.'))) {
            setErrorMessage("Формат файла не является jpg, jpeg или png")
            return
        }
        setErrorMessage(null)
        setOutput(null)
        setSrc(null)
        const temp = URL.createObjectURL(e.target.files[0])
        var img = new Image();
        img.onload = function () {
            setInfo({...info, y: img.height, x: img.width})
            if ((!(img.height > y && img.width > x) && x == y) || (!(img.height > 590 && img.width > 738) && x != y)) {
                setErrorMessage("Загружаемое фото пользователя иметь разрешение от " + x + "х" + y)
                return
            }
        }

        img.src = window.URL.createObjectURL(e.target.files[0]);

        console.log(info)
        if (e.target.files[0].size > size * 7340032 / 7) {
            setErrorMessage("Загружаемое фото пользователя должно быть не больше " + size + " Мб")
            return
        }
        console.log(e.target.files[0].name)

            // if (e.target.files[0].name > size*7340032/7) {
            //     setErrorMessage("Загружаемое фото пользователя должно быть не больше "+ size+ " Мб")
            //     return
            // }
            setInfo({...info, type: 'image/png'})
        console.log(info)
        setSrc(temp)
        document.getElementById("label-cropper").remove()
    };

    const cropImageNow = () => {
        const canvas = document.createElement('canvas')
        canvas.width = crop.width
        canvas.height = crop.height
        const ctx = canvas.getContext('2d')
        const image = document.getElementById("source")
        if (info.y > info.x) {
            const coefficient = info.y / x
            console.log("Coeff " + coefficient)
            ctx.drawImage(
                image,
                0,
                -crop.y,
                info.y / coefficient,
                info.y / (info.x / x)
            )
        } else {
            const coefficient = info.x / y
            console.log("Coeff " + coefficient)
            ctx.drawImage(
                image,
                -crop.x,
                0,
                info.x / (info.y / y),
                info.x / coefficient)
        }
        const base64Image = canvas.toDataURL(info.type)
        setOutput(base64Image)
        setImage(src)
        setSrc(null)
        setData(base64Image)
        console.log(base64Image)
    };


    const ChangeCrop = () => {
        setSrc(image)
        setOutput(null)
    }

    if (info.y > info.x) {
        return (
            <div className="App">
                <center>
                    <input name="photo" type="file" id="input__file" accept="image/*" className="input input__file"
                           onChange={(e) => {
                               selectImage(e);
                           }}/>
                    <label id="label-cropper" htmlFor="input__file" className="input__file-button">
                        <div className="input__file-icon-wrapper"><img className="input__file-icon"
                                                                       src="https://cdn-icons-png.flaticon.com/512/70/70310.png"
                                                                       alt="Добавить изображение" width="300px"
                                                                       height="300px"/></div>
                    </label>
                    <div>
                        {src && (
                            <div style={{width: x, height: info.y / info.x * x}}>
                                <ReactCrop style={{width: x, height: info.y / info.x * x}} src={src}
                                           onImageLoaded={setImage}
                                           crop={crop} onChange={setCrop} locked='true'
                                           zoomable={false}>
                                    <img src={src} id="source" width={x} height={info.y / info.x * x}/>
                                </ReactCrop>
                            </div>
                        )}
                    </div>
                    {output && <div><img src={output}/>
                        <button className="button " onClick={ChangeCrop}>Изменить область</button>
                    </div>}

                    <div>{error}</div>
                </center>
                {src && <button className="button " onClick={cropImageNow}>Обрезать</button>}
            </div>

        );
    }
    return (
        <div className="App">
            <center>
                <input name="photo" type="file" id="input__file" accept="image/*" className="input input__file"
                       onChange={(e) => {
                           selectImage(e);
                       }}/>
                <label id="label-cropper" htmlFor="input__file" className="input__file-button">
                    <div className="input__file-icon-wrapper"><img className="input__file-icon"
                                                                   src="https://cdn-icons-png.flaticon.com/512/70/70310.png"
                                                                   alt="Добавить изображение" width="300px"
                                                                   height="300px"/></div>
                </label>
                <div>
                    {src && (
                        <div style={{width: info.x / info.y * y, height: y}}>
                            <ReactCrop style={{width: info.x / info.y * y, height: y}} src={src}
                                       onImageLoaded={setImage}
                                       crop={crop} onChange={setCrop} locked='true'
                                       zoomable={false}>
                                <img src={src} id="source" width={info.x / info.y * y} height={y}/>
                            </ReactCrop>
                        </div>
                    )}
                </div>
                {output && <div><img src={output}/>
                    <button className="button " onClick={ChangeCrop}>Изменить область</button>
                </div>}

                <div>{error}</div>
            </center>
            {src && <button className="button " onClick={cropImageNow}>Обрезать</button>}
        </div>

    );

}

export default Cropper