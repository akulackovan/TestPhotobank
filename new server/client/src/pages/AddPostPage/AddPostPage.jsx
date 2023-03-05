import React, { useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import "./AddPostPage.scss";
import CityCombobox from "../../components/CityCombobox/CityCombobox";
import Cropper from "../../components/Cropper/cropper";
import  AuthContext from "../../context/AuthContext";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";

const AddPostPage = () => {
  const [errorMessage, setErrorMessage] = React.useState("");
  const [redirect, setRedirect] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false)
  const { userId } = useContext(AuthContext);
  const [form, setForm] = useState({
    photo: "",
    city: "",
    description: "",
    userId: userId,
  });

  const changeForm = (event) => {
    console.log(event.target);
    setForm({ ...form, [event.target.name]: event.target.value });
    console.log(form);
  };

  const addPostHandler = async () => {
    var description = document.getElementById("description").value;
    if (form.photo == "" || form.photo == true) {
      setErrorMessage("Необходимо добавить фото");
      setTimeout(() => setErrorMessage(""), 5000);
      return;
    }
    if (form.city == "") {
      setErrorMessage("Необходимо выбрать город");
      setTimeout(() => setErrorMessage(""), 5000);
      return;
    }

    if (description.length > 512) {
    console.log(description)
      setErrorMessage("Описание поста должно содержать от 0 до 512 символов");
      setTimeout(() => setErrorMessage(""), 5000);
      return;
    }
    setForm({ ...form, description: "" });
    console.log(form)
    setDisabled(true)
    try {
      await axios
        .post(
          "/post/post",
          { ...form, description: description },
          {
            headers: {
              "Context-Type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log(response);
          setErrorMessage(
            response.data.message +
              "    Вы будете перенаправлены на страницу профиля через 5 секунд"
          );
         setTimeout(() => setRedirect(true), 5000);
        });
    } catch (error) {
      console.log(error);
      setErrorMessage(error.response.data.message);
      setTimeout(() => setErrorMessage(""), 5000);
      setDisabled(false)
    }
  };

  if (redirect) {
    return <Redirect to="/profile" />;
  }

  return (
    <div>
      <div className="addPost" style={disabled ? {pointerEvents: "none"} : null}>
        <div className="container">
          <Cropper
            size={16}
            y={383}
            x={480}
            setData={(value) => setForm({ ...form, photo: value })}
            disabled={disabled}
          ></Cropper>
          <br />
          <div style={{ width: "80%", margin: "auto", textAlign: "left" }}>
            <CityCombobox
              name="city"
              onChange={(value) => setForm({ ...form, city: value })}
              disabled={disabled}
            />
          </div>
          <div className="description">
            <textarea
              className="textarea"
              type="text"
              placeholder="Описание"
              name="input"
              onChange={changeForm}
              id="description"
              disabled={disabled}
              resize='none'
            />
          </div>

          <button className="button" onClick={addPostHandler} disabled={disabled}>
            ЗАГРУЗИТЬ ФОТО
          </button>
          {errorMessage && <ErrorMessage msg={errorMessage} />}
        </div>
      </div>
    </div>
  );
};
export default AddPostPage;