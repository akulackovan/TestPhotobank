import React, { useState } from "react";
import ReactCrop from "react-image-crop";
import "./cropper.scss";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

import "react-image-crop/dist/ReactCrop.css";
import "react-image-crop/src/ReactCrop.scss";


const Cropper = ({ x = 480, y = 480, size = 7, disabled=false, setData}) => {
  const [info, setInfo] = useState({
    x: null,
    y: null,
    type: null,
  });
  const [src, setSrc] = useState(null);
  const [crop, setCrop] = useState();

  const [image, setImage] = useState(null);
  const [output, setOutput] = useState(null);
  const [error, setErrorMessage] = useState(null);

  const [is43, setIs43] = useState(null);

  const selectImage = (e) => {
    setErrorMessage(null);
    setOutput(null);
    setData(false)
    setSrc(null);
    const temp = URL.createObjectURL(e.target.files[0]);
    var img = new Image();
    console.log("Load");
    const name = e.target.files[0].name;
      if (
        !(
          (name[name.length - 1] == "g" &&
            name[name.length - 2] == "n" &&
            name[name.length - 3] == "p" &&
            name[name.length - 4] == ".") ||
          (name[name.length - 1] == "g" &&
            name[name.length - 2] == "p" &&
            name[name.length - 3] == "j" &&
            name[name.length - 4] == ".") ||
          (name[name.length - 1] == "g" &&
            name[name.length - 2] == "e" &&
            name[name.length - 3] == "p" &&
            name[name.length - 4] == "j" &&
            name[name.length - 5] == ".")
        )
      ) {
        setErrorMessage("Формат файла не является jpg, jpeg или png");
        setTimeout(() => setErrorMessage(""), 5000);
        return;
      }
      else{

      
    img.src = window.URL.createObjectURL(e.target.files[0]);
    img.onload = function () {
      
      /** Проверка на формат */
      console.log("Format");
      /** Проверка на ширину и длину изображения */
      if (size == 7 && !(img.height >= y && img.width >= x) && x == y) {
        setErrorMessage(
          "Выбранное изображение не соответвует характеристикам\n Загружаемое фото пользователя должно быть не больше 7 Мб и иметь разрешение от " +
            x +
            "х" +
            y
        );
        setTimeout(() => setErrorMessage(""), 5000);
        return;
      } else {
        if (!(img.height >= 590 && img.width >= 738) && x != y) {
          setSrc(null);
          setErrorMessage(
            "Фото должно быть не меньше 590x738 пикселей"
          );
          setTimeout(() => setErrorMessage(""), 5000);
          return;
        }
      }
      /** Проверка на размер изображения */
      if (e.target.files[0].size > size * 1048576) {
        if (size == 7){
          setErrorMessage(
            "Выбранное изображение не соответвует характеристикам\n Загружаемое фото пользователя должно быть не больше 7 Мб и иметь разрешение от " +
              x +
              "х" +
              y
          );
          setTimeout(() => setErrorMessage(""), 5000);
          return;
        }
        setSrc(null);
        setErrorMessage(
          "Фото должно быть не больше " + size + " Мб"
        );
        setTimeout(() => setErrorMessage(""), 5000);
        return;
      }
      /** Если все хорошо, то устанавливаем изображение */
      const split = e.target.files[0].name.split(".");
      setInfo({
        y: img.height,
        x: img.width,
        type: `image/${split[split.length - 1]}`,
      });
      console.log(info);
      setSrc(temp);
      document.getElementById("label-cropper").remove();
      /** Если это фото для аватарки */
      if (y == x) {
        setCrop({
          unit: "px",
          width: 400,
          height: 400,
          x: 0,
          y: 0,
        });
      } else {
        console.log(img.width / img.height);
        /** Если фото 4/3 */
        if (img.width / img.height == 4 / 3) {
          console.log("4/3")
          setIs43(true);
        }
        setCrop({
          unit: "px",
          width: 480,
          height: 360,
          x: 0,
          y: 0,
        });
      }
      setData(true)
    };
  }
  };

  /** Обрезка изображения */
  const cropImageNow = () => {
    const canvas = document.createElement("canvas");
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");
    const image = document.getElementById("source");
    if (is43) {
      console.log("Here");
      ctx.drawImage(image, 0, 0, x, y);
    } else {
      if (info.y > info.x) {
        const coefficient = info.y / x;
        console.log("Coeff " + coefficient);
        ctx.drawImage(
          image,
          -crop.x,
          -crop.y,
          info.y / coefficient,
          info.y / (info.x / x)
        );
      } else {
        const coefficient = info.x / y;
        console.log("Coeff " + coefficient);
        ctx.drawImage(
          image,
          -crop.x,
          -crop.y,
          info.x / (info.y / y),
          info.x / coefficient
        );
      }
    }
    const base64Image = canvas.toDataURL(info.type);
    setOutput(base64Image);
    setImage(src);
    setSrc(null);
    setData(base64Image);
    console.log(base64Image);
  
  };

  const ChangeCrop = () => {
    setSrc(image);
    setOutput(null);
    setData(true)
  };

  if (info.y > info.x) {
    return (
      <div className="App center">
        <center>
          <div>
            {src && (
              <div style={{ width: x, height: (info.y / info.x) * x }}>
                <ReactCrop
                  style={{ width: x, height: (info.y / info.x) * x }}
                  src={src}
                  onImageLoaded={setImage}
                  crop={crop}
                  onChange={setCrop}
                  locked="true"
                >
                  <img
                    src={src}
                    id="source"
                    width={x}
                    data-testid="photo"
                    height={(info.y / info.x) * x}
                  />
                </ReactCrop>
              </div>
            )}
          </div>
          {output && (
            <div className="output">
              <div>
                <div className="center">Загружаемое изображение:</div>
                <img src={output} />
              </div>
              <button className="button " onClick={ChangeCrop} disabled={disabled}>
                Изменить область
              </button>
            </div>
          )}
          {error && <ErrorMessage msg={error} />}
        </center>
        {src && !output && (
          <button className="button " onClick={cropImageNow} disabled={disabled}>
            Обрезать
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="App" style={error ? {pointerEvents: "none"} : null}>
      <div className="App">
        <input
          name="photo"
          type="file"
          id="input__file_img"
          accept="image/jpeg, image/png, image/jpg"
          className="input__file_img"
          onChange={(e) => {
            selectImage(e);
          }}
          disabled={disabled}
          data-testid="inputfile"
        />
        <label
          id="label-cropper"
          htmlFor="input__file_img"
          className="input__file-button"
          style={{ width: `480px`, height: `360px` }}
          title="Выбрать изображение"
        >
          <div className="input__file-icon-wrapper">
            <img
              className="input__file-icon"
              src="https://cdn-icons-png.flaticon.com/512/70/70310.png"
              alt="Добавить изображение"
              width="300px"
              height="300px"
            />
          </div>
        </label>
      </div>
      {is43 && (
        <div>
          {src && (
            <div>
              {!output && (
                <div className="center">
                  <ReactCrop
                    style={{ width: 400, height: 300 }}
                    src={src}
                    onImageLoaded={setImage}
                    crop={crop}
                    onChange={setCrop}
                    locked="true"
                  >
                    <img src={src} id="source" width={400} height={300} />
                  </ReactCrop>
                  <button className="button " onClick={cropImageNow} disabled={disabled}>
                    Подтвердить
                  </button>
                </div>
              )}
            </div>
          )}
          {output && (
            <div className="center">
              <div>Загружаемое изображение:</div>
              <div className="output center">
                <img src={output} />
              </div>
            </div>
          )}
        </div>
      )}

      {!is43 && (
        <div>
          <div className="image">
            {src && (
              <div style={{ width: (info.x / info.y) * y, height: y }}>
                <ReactCrop
                  style={{ width: (info.x / info.y) * y, height: y }}
                  src={src}
                  onImageLoaded={setImage}
                  crop={crop}
                  onChange={setCrop}
                  locked="true"
                  zoomable={false}
                >
                  <img
                    src={src}
                    id="source"
                    width={(info.x / info.y) * y}
                    height={y}
                  />
                </ReactCrop>
              </div>
            )}
          </div>
          {output && (
            <div className="output">
              <div>
                <div className="center">Загружаемое изображение:</div>
                <img src={output} />
              </div>

              <button className="button " onClick={ChangeCrop} disabled={disabled}>
                Изменить область
              </button>
            </div>
          )}

          {error && <ErrorMessage msg={error} />}

          {src && !output && (
            <button className="button " onClick={cropImageNow} disabled={disabled}>
              Обрезать
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Cropper;
