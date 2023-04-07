import React, { useState } from "react";
import { Redirect, Link } from "react-router-dom";
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
      <div className="parent" data-testid="nav">
        <div className="child">
          <a className="site-title">ФОТОБАНК</a>
          <ul>
            <li data-testid="popular">
              <Link to="/popular" title="Популярное">
                Популярное
              </Link>
            </li>
            <li>
              <Link to="/subsc" title="Подписки">
                Подписки
              </Link>
            </li>
            <li>
              <Link to="/profile" title="Профиль">
                Профиль
              </Link>
            </li>
            <li>
              <Link to="/settings" title="Настройки">
                Настройки
              </Link>
            </li>
            <li>
              <input
                className="input"
                type="text"
                placeholder="ПОИСК"
                name="user"
                title="Поиск"
                data-testid="searchInput"
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
