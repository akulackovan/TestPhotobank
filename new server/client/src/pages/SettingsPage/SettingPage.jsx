import React, { useContext, useState } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "./SettingsPage.scss";
import CityCombobox from "../../components/CityCombobox/CityCombobox";
import { useTheme } from "../../hooks/use.theme";
import Cropper from "../../components/Cropper/cropper";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";

const SettingsPage = () => {
  const { logout } = useContext(AuthContext);
  const { userId } = useContext(AuthContext);
  const [form, setForm] = useState({
    userId: userId,
    username: "",
    password: "",
    newpass: "",
    checkpass: "",
    text: "",
    city: "",
    base64: "",
  });
  const [isOut, setOut] = useState(false)
 
  const [errorMessage, setErrorMessage] = React.useState("");
  const [log, setLog] = React.useState(false);

  const changeForm = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    console.log(form);
  };

  const [formKey, setFormKey] = useState(0);

  const changeOut = (event) => {
    setLog(true);
  };

  const now = localStorage.getItem("app-theme");
  const [newTheme, setNewTheme] = useState(now);
  const { theme, setTheme } = useTheme();

  const changeTheme = (event) => {
    setNewTheme(event.target.value);
    console.log(newTheme);
  };

  const settingsHandler = async () => {
    if (form.username != "" && !form.username.match(/^[A-Za-zА-Яа-я]+$/)) {
      setErrorMessage(
        "Имя пользователя должно содержать только символы русского и английского алфавита"
      );
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }
    if (!(form.username.length <= 128)) {
      setErrorMessage("Имя пользователя должно быть меньше 128 символов");
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }
    if (form.newpass && !form.password) {
      setErrorMessage("Не введен старый пароль");
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }
    if (form.password && !form.newpass) {
      setErrorMessage("Не введен новый пароль");
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }
    if (!form.checkpass && form.newpass) {
      setErrorMessage("Подтверждение пароля не введено");
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }
    if (form.newpass != "" && !form.newpass.match(/^[A-Za-zА-Яа-я]+$/)) {
      setErrorMessage(
        "Пароль должен содержать только символы русского и английского алфавита"
      );
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }
    
    if (!(form.newpass.length <= 128)) {
      setErrorMessage("Пароль должен быть меньше 128 символов");
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }
    if (isOut) {
      setErrorMessage("Изображение не обрезано");
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }
    if (!(form.checkpass == form.newpass)) {
      setErrorMessage("Пароли не совпадают");
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }
    if (!(form.text.length < 512)) {
      setErrorMessage("Описание должно быть меньше 512 символов");
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }
    if (form.onSelect) {
      setErrorMessage("Фото не обрезано");
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }
    try {
      await axios
        .post(
          "/settings",
          { ...form },
          {
            headers: {
              "Context-Type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log(newTheme);
          setTheme(newTheme);
          setErrorMessage(response.data.message);
          setTimeout(() => setErrorMessage(""), 2000);
          setFormKey(formKey + 1);
          document.getElementById("inputs").reset();
          setForm({
            userId: userId,
            username: "",
            password: "",
            newpass: "",
            checkpass: "",
            text: "",
            city: "",
            base64: "",
          });
        });
    } catch (error) {
      console.log(error);
      setErrorMessage(error.response.data.message);
      setTimeout(() => setErrorMessage(""), 2000);
    }
  };

  if (log) {
    logout();
    return <Redirect to="/auth" />;
  }

  return (
    <div className="settings">
      <div className="container-s">
        <form id="inputs">
          <div className="rowC">
            <div className="fiels">
              <input
                className="input"
                type="text"
                placeholder="Логин"
                name="username"
                onChange={changeForm}
              />
              <input
                className="input"
                placeholder="Cтарый пароль"
                name="password"
                type="password"
                onChange={changeForm}
              />
              <input
                className="input"
                type="password"
                placeholder="Новый пароль"
                name="newpass"
                onChange={changeForm}
              />
              <input
                className="input"
                type="password"
                placeholder="Подтверждение нового пароля"
                name="checkpass"
                onChange={changeForm}
              />
            </div>
            <div className="sec" style={{ textAlign: "left" }}>
              <input
                className="input"
                type="text"
                placeholder="Описание пользователя"
                name="text"
                onChange={changeForm}
              />
              <CityCombobox
                name="city"
                onChange={(value) => setForm({ ...form, city: value })}
                key={formKey}
              />
            </div>
          </div>
        </form>

        <div className="theme">
        
        </div>
        <div className="buttons">
          <button className="button" onClick={settingsHandler}>
            СОХРАНИТЬ
          </button>
          <button className="button" onClick={changeOut}>
            ВЫЙТИ ИЗ АККАУНТА
          </button>
        </div>
        {errorMessage && <ErrorMessage msg={errorMessage} />}
      </div>
    </div>
  );
};

export default SettingsPage;
