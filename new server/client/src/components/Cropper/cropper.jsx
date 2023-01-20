import { set } from 'mongoose'
import React, { useState, useEffect } from 'react'
import ReactCrop, {
    centerCrop,
    makeAspectCrop,
    Crop,
    PixelCrop,
  } from 'react-image-crop'

import 'react-image-crop/dist/ReactCrop.css'
import 'react-image-crop/src/ReactCrop.scss'

function centerAspectCrop(
    mediaWidth,
    mediaHeight,
    aspect,
  ) {
    return centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        aspect,
        mediaWidth,
        mediaHeight,
      ),
      mediaWidth,
      mediaHeight,
    )
  }

const Cropper = ({ x = 480, y = 480, size = 7, setData }) => {
    const [info, setInfo] = useState({
        x: null,
        y: null
    })

    const [src, setSrc] = useState(null);
    const [crop, setCrop] = useState(null)
    const [image, setImage] = useState(null);
    const [output, setOutput] = useState(null);
    const [error, setErrorMessage] = useState(null)
    const [aspect, setAspect] = useState(x / y)

    function onImageLoad(e) {
          const { width, height } = e.currentTarget
          console.log(width + " " + height)
          setCrop(centerAspectCrop(width, height, aspect))
      }

    const selectImage = (e) => {
        setErrorMessage(null)
        setOutput(null)
        setSrc(null)
        setCrop(undefined)
        const temp = URL.createObjectURL(e.target.files[0])
        var img = new Image();
        img.onload = function () {
            setInfo({ ...info, y: img.height, x: img.width })
            if (!(img.height >= y && img.width >= x)) {
                setErrorMessage("Загружаемое фото пользователя должно быть не больше " + size + "Мб и иметь разрешение от " + x + "х" + y)
                setOutput(null)
                setSrc(null)
                setInfo("")
                return
            }
        }
        img.src = window.URL.createObjectURL(e.target.files[0]);
        console.log(info)
        if (e.target.files[0].size > size * 1048576) {
            setErrorMessage("Загружаемое фото пользователя должно быть не больше " + size + "Мб и иметь разрешение от " + x + "х" + y)
            setOutput(null)
            setSrc(null)
            return
        }


        setInfo({ ...info })
        console.log(info)
        setSrc(temp)

    };

    const cropImageNow = () => {
        const canvas = document.createElement('canvas')

        const image = document.getElementById("source")
        let width = image.clientWidth;
        let height = image.clientHeight;
        console.log(width + " " + height)
        const kX = info.x / width
        const kY = info.y / height
        canvas.width = crop.width
        canvas.height = crop.height
        
        console.log(crop.width* kX + " " + crop.height* kY)
        console.log(crop.width* kX + " " + crop.height* kX)
        const ctx = canvas.getContext('2d')

        const X = crop.x * kX
        const Y = crop.y * kY
        const XW = crop.width * kX
        const YH = crop.height * kY

        console.log(X + " " + Y)


        ctx.drawImage(
            image,
            X,
            Y,
            XW,
            YH,
            0,
            0,
            crop.width,
            crop.height,
        )
        const base64Image = canvas.toDataURL()
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
                        style={{ display: 'none' }} />
                </label>
                <div>
                    {src && (
                        <div >
                            <ReactCrop src={src} onImageLoaded={setImage}
                                crop={crop}
                                aspect={x / y}
                                zoomable={false}
                                onChange={(_, percentCrop) => setCrop(percentCrop)}>
                                
                                <img src={src} id="source" 
                                onLoad={onImageLoad} />
                            </ReactCrop>
                            <button className="button " onClick={cropImageNow}>Обрезать</button>
                        </div>
                    )}
                </div>
                {output && <div><img src={output} />
                    <button className="button " onClick={ChangeCrop}>Изменить область</button></div>}

                {error && <div>{error}</div>}
            </center>
        </div>
    );
}

export default Cropper