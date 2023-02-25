import React, { useContext, useState } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import  AuthContext  from "../../context/AuthContext";
import "./SettingsPage.scss";
import CityCombobox from "../../components/CityCombobox/CityCombobox";
import { useTheme } from "../../hooks/use.theme";
import Cropper from "../../components/Cropper/cropper";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import { Gapped, Radio, RadioGroup } from "@skbkontur/react-ui";

const SettingsPage = () => {
  const { logout } = useContext(AuthContext);
  const { userId } = useContext(AuthContext);
  const [disabled, setDisabled] = useState(false)
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
  
 
  const [errorMessage, setErrorMessage] = React.useState("");
  const [log, setLog] = React.useState(false);

  const changeForm = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    console.log(form);
  };

  const [formKey, setFormKey] = useState(0);

  const changeOut = () => {
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
    var username = document.getElementById("username").value
    var newpass = document.getElementById("newpass").value
    var password = document.getElementById("password").value
    var checkpass = document.getElementById("checkpass").value
    var text = document.getElementById("text").value
    if (username != "" && !username.match(/^[A-Za-zА-Яа-я]+$/)) {
      setErrorMessage(
        "Имя пользователя должно содержать только символы русского и английского алфавита"
      );
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }
    if (!(username.length <= 128)) {
      setErrorMessage("Имя пользователя должно быть меньше 128 символов");
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }
    if (newpass && !password) {
      setErrorMessage("Не введен старый пароль");
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }
    if (password && !newpass) {
      setErrorMessage("Не введен новый пароль");
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }
    if (!checkpass && newpass) {
      setErrorMessage("Подтверждение пароля не введено");
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }
    if (newpass != "" && !newpass.match(/^[A-Za-zА-Яа-я]+$/)) {
      setErrorMessage(
        "Пароль должен содержать только символы русского и английского алфавита"
      );
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }
    
    if (!(newpass.length <= 128)) {
      setErrorMessage("Пароль должен быть меньше 128 символов");
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }
    if (form.base64 == true) {
      setErrorMessage("Изображение не обрезано");
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }
    if (!(checkpass == newpass)) {
      setErrorMessage("Пароли не совпадают");
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }
    if (!(text.length < 512)) {
      setErrorMessage("Описание должно быть меньше 512 символов");
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }
    setDisabled(true)
    setForm({...form, username: username, password: password, checkpass: checkpass, newpass: newpass, text: text})
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
          setDisabled(false)
        });
    } catch (error) {
      console.log(error);
      setErrorMessage(error.response.data.message);
      setTimeout(() => setErrorMessage(""), 2000);
      setDisabled(false)
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
                id="username"
              />
              <input
                className="input"
                placeholder="Cтарый пароль"
                name="password"
                type="password"
                onChange={changeForm}
                id="password"
              />
              <input
                className="input"
                type="password"
                placeholder="Новый пароль"
                name="newpass"
                onChange={changeForm}
                id="newpass"
              />
              <input
                className="input"
                type="password"
                placeholder="Подтверждение нового пароля"
                name="checkpass"
                onChange={changeForm}
                id="checkpass"
              />
            </div>
            <div className="sec" style={{ textAlign: "left" }}>
              <input
                className="input"
                type="text"
                placeholder="Описание пользователя"
                name="text"
                onChange={changeForm}
                id="text"
              />
              <CityCombobox
                name="city"
                onChange={(value) => setForm({ ...form, city: value })}
                key={formKey}
                disabled={disabled}
              />
            </div>
          </div>
        </form>

        <div className="theme">
        <RadioGroup name="number-complex" defaultValue={now}>
            <Gapped horizontal gap={0} >
              <b>Тема: </b>
              <Radio
                data-testid="light-button"
                className="radio"
                value="light"
                onChange={changeTheme}
                style={{color: 'black'}}
                
              />{" "}
              <b>Светлая</b>
              <Radio
                data-testid="dark-button"
                className="radio"
                value="dark"
                onChange={changeTheme}
              />{" "}
              <b>Темная</b>
            </Gapped>
          </RadioGroup>
        </div>

        <div>
          <Cropper
            setData={(value) => setForm({ ...form, base64: value })}
            key={formKey}
            disabled={disabled}
            />
        </div>
        <div className="buttons">
          <button className="button" onClick={settingsHandler} disabled={disabled}>
            СОХРАНИТЬ
          </button>
          <button className="button" onClick={changeOut} disabled={disabled}>
            ВЫЙТИ ИЗ АККАУНТА
          </button>
        </div>
        {errorMessage && <ErrorMessage msg={errorMessage} />}
      </div>
    </div>
  );
};

export default SettingsPage;