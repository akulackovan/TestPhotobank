import React, { useState } from "react";
import axios from "axios";
import "./RegPage.scss";
import { Link, Redirect } from "react-router-dom";
import CityCombobox from "../../components/CityCombobox/CityCombobox";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";

const RegPage = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    city: "",
  });
  const [errorMessage, setErrorMessage] = React.useState("");
  const [redirect, setRedirect] = React.useState(false);
  const [disabled, setDisabled] = useState(false);

  const changeForm = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    console.log(form);
  };

  const registerHandler = async () => {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    if (!(username && password && form.city)) {
      setErrorMessage("Заполнены не все поля");
      setTimeout(() => setErrorMessage(""), 5000);
      return;
    }
    if (!username.match(/^[A-Za-zА-Яа-я]+$/)) {
      setErrorMessage(
        "Логин должен содержать только символы русского и английского алфавита"
      );
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }
    if (!(username.length <= 128)) {
      setErrorMessage("Логин должен содержать до 128 символов");
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }
    if (!password.match(/^[A-Za-zА-Яа-я]+$/)) {
      setErrorMessage(
        "Пароль должен содержать только символы русского и английского алфавита"
      );
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }
    if (!(password.length <= 128)) {
      setErrorMessage("Пароль должен содержать до 128 символов");
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }
    setForm({ ...form, username: username, password: password });
    setDisabled(true);

    try {
      await axios
        .post(
          "/auth/reg",
          { ...form },
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
              "    Вы будете перенаправлены на страницу авторизации через 5 секунд"
          );
          setTimeout(() => setRedirect(true), 5000);
        });
    } catch (error) {
      setDisabled(false);
      console.log(error);
      setErrorMessage(error.response.data.message);
      setTimeout(() => setErrorMessage(""), 2000);
    }
  };

  if (redirect) {
    return <Redirect to="/auth" />;
  }

  return (
    <div className="background" data-testid="reg">
      <div className="box">
        <div className="center back" style={disabled ? {pointerEvents: "none"} : null}>
          <h3 className="head">ФОТОБАНК</h3>
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
            type="password"
            placeholder="Пароль"
            name="password"
            onChange={changeForm}
            id="password"
          />
          <div
            style={{ width: "80%", margin: "auto", textAlign: "left" }}
            data-testid="city"
          >
            <CityCombobox
              disabled={disabled}
              className="city"
              name="city"
              onChange={(value) => setForm({ ...form, city: value })}
            />
          </div>
          <button
            className="button"
            onClick={registerHandler}
            disabled={disabled}
          >
            ЗАРЕГИСТРИРОВАТЬСЯ
          </button>
          <a className="link">
            <Link to="/auth" className="link">
              ОБРАТНО
            </Link>
          </a>
        </div>
      </div>

      {errorMessage && <ErrorMessage msg={errorMessage} />}
    </div>
  );
};

export default RegPage;
