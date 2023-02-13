import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import "./NavBar.scss";

const NavBar = () => {
  const [form, setForm] = useState("");
  const [str, setStr] = useState("");

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setStr("/search/" + form);
    }
  };

  const changeForm = (event) => {
    setForm(event.target.value);
  };

  if (str) {
    return <Redirect to={str} />;
  }

  return (
    <nav className="nav">
      <div className="parent">
        <div className="child">
          <a className="site-title">ФОТОБАНК</a>
          <ul>
            <li data-testid="popular">
              <a href="/popular" title="Популярное">
                Популярное
              </a>
            </li>
            <li>
              <a href="/subsc" title="Подписки">
                Подписки
              </a>
            </li>
            <li>
              <a href="/profile" title="Профиль">
                Профиль
              </a>
            </li>
            <li>
              <a href="/settings" title="Настройки">
                Настройки
              </a>
            </li>
            <li>
              <input
                className="input"
                type="text"
                placeholder="ПОИСК"
                name="user"
                title="Поиск"
                onKeyPress={handleKeyPress}
                onChange={changeForm}
              />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
