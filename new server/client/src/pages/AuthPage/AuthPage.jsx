import React, { useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import "./AuthPage.scss";
import AuthContext from "../../context/AuthContext";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";

const AuthPage = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = React.useState("");
  const [redirect, setRedirect] = React.useState(false);
  const [token, setToken] = React.useState("");
  const [userId, setUserID] = React.useState("");
  const [disabled, setDisabled] = React.useState(false)
  const [authRed, setAuthRed] = React.useState(false);

  const changeForm = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    console.log(form);
  };

  const { login } = useContext(AuthContext);

  const authHandler = async () => {
    var username = document.getElementById("username").value
    var password = document.getElementById("password").value
    if (!(username && password)) {
      setErrorMessage("Заполнены не все поля");
      setTimeout(() => setErrorMessage(""), 5000);
      return;
    }
    if (!username.match(/^[A-Za-zА-Яа-яЁё]+$/)) {
      setErrorMessage(
        "Имя пользователя должно содержать только символы русского и английского алфавита"
      );
      setTimeout(() => setErrorMessage(""), 5000);
      return;
    }
    if (!(username.length < 128)) {
      setErrorMessage("Имя пользователя должно быть меньше 128 символов");
      setTimeout(() => setErrorMessage(""), 5000);
      return;
    }
    if (!password.match(/^[A-Za-zА-Яа-яЁё]+$/)) {
      setErrorMessage(
        "Пароль должен содержать только символы русского и английского алфавита"
      );
      setTimeout(() => setErrorMessage(""), 5000);
      return;
    }
    if (!(password.length < 128)) {
      setErrorMessage("Пароль должен быть меньше 128 символов");
      setTimeout(() => setErrorMessage(""), 5000);
      return;
    }
    setDisabled(true)
    setForm({username: username, password: password})
    await axios
      .post(
        "/auth/login",
        { ...form },
        {
          headers: {
            "Context-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        setAuthRed(true);
        console.log(authRed);
        login(response.data.token, response.data.user._id);
      })
      .catch(function (error) {
        console.log(error);
        setErrorMessage(error.response.data.message);
        setTimeout(() => setErrorMessage(""), 5000);
        setDisabled(false)
      });
  };

  const handleOnClick = async () => {
    setRedirect(true);
  };
  console.log(authRed);
  console.log("authRed");

  return (
    <div className="background">
      <div className="auth" style={disabled ? {pointerEvents: "none"} : null}>
        <div className="back" style={{ height: "450px" }}>
          <h3 className="head">ФОТОБАНК</h3>
          <input
            className="input"
            type="text"
            placeholder="Логин"
            name="username"
            data-testid="username"
            onChange={changeForm}
            id="username"
          />
          <input
            className="input"
            placeholder="Пароль"
            name="password"
            type="password"
            onChange={changeForm}
            id="password"
          />
          <button
            className="button"
            onClick={authHandler}
            data-testid="login-button"
            disabled={disabled}
          >
            ВОЙТИ
          </button>
          <button className="button" onClick={handleOnClick}
          
          disabled={disabled}>
            РЕГИСТРАЦИЯ
          </button>
          {errorMessage && (
            <ErrorMessage data-testid="error" msg={errorMessage} />
          )}
          {redirect && <Redirect to="/reg" data-testid="reg" />}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
