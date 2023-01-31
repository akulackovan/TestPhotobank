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
      <a className="site-title">ФОТОБАНК</a>
      <ul>
        <li>
          <a href="/popular">Популярное</a>
        </li>
        <li>
          <a href="/subsc">Подписки</a>
        </li>
        <li>
          <a href="/profile">Профиль</a>
        </li>
        <li>
          <a href="/settings">Настройки</a>
        </li>
        <li>
          <input
            className="input"
            type="text"
            placeholder="ПОИСК"
            name="user"
            onKeyPress={handleKeyPress}
            onChange={changeForm}
          />
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
