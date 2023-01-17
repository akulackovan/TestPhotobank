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
        console.log(e.target.files[0])
        const temp = URL.createObjectURL(e.target.files[0])

        
        if (e.target.files[0].size > 7340032
            || temp.naturalWidth < 480 || temp.naturalHeight < 480) {
            setErrorMessage("Загружаемое фото пользователя должно быть не больше 7 Мб и иметь разрешение от 480х480")
            return
        }
        setInfo({x: temp.naturalWidth, y: temp.naturalHeight, type: e.target.files[0].type})
        setSrc(temp)
    };

    const cropImageNow = () => {
        const canvas = document.createElement('canvas')
        canvas.width = crop.width
        canvas.height = crop.height
        const ctx = canvas.getContext('2d')
        const image = document.getElementById("source")

        console.log(image)

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
        const base64Image = canvas.toDataURL('image/jpeg')
        setOutput(base64Image)
        
        setImage(src)
        setSrc(null)
        onChange({base64: base64Image,
            type: info.type})
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
                                crop={crop} onChange={setCrop} locked='true'>
                                <img src={src} id="source" width={info.x} height={info.y}/>
                            </ReactCrop>
                            <br />
                            <button className="button "onClick={cropImageNow}>Обрезать</button>
                            <br />
                            <br />
                        </div>
                    )}
                </div>
                {output && <div><img src={output} />
                <button className="button "onClick={ChangeCrop}>Изменить область</button></div>}
                
                <div>{error}</div>
            </center>
        </div>
    );
}

export default Cropper
