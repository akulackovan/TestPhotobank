import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router";
import { useRoutes } from "../src/routes";
import { Router, Route } from 'react-router-dom';
import PopularPage from "../src/pages/PopularPage/PopularPage";
import SubscribePage from "../src/pages/SubscribePage/SubscribePage";
import SettingsPage from "../src/pages/SettingsPage/SettingPage";
import ProfilePage from "../src/pages/ProfilePage/ProfilePage";
import createMemoryHistory from 'history/createMemoryHistory';
import { AuthContext } from "../src/context/AuthContext";

import { act } from "react-dom/test-utils";
import axios from "axios";

jest.mock("axios");
afterEach(() => {
  jest.clearAllMocks();
});


//5 сценарий - проверка переключения кнопок NavBar - оказываемся на замоканных страницах
//Должен меняться url
test("5: Checking the interface link between the search page and another profile page", async () => {

  //Мокаем id пользователя за которым сидим
  const { userId } = jest.fn();

  //Роутер нужен для перехода по страницам, но он принимает 2 значения готов и логин,
  //Для тестов готов должен быть всегда true, логин по необходимости (false, если нужны страницы регистрации и пользователя)
  const routes = useRoutes(true, true);

  //Создаем историю переходов
  const history = createMemoryHistory();
  //Первый переход на страницу поиска с поиском
  history.push('/search/test');
  

  //Задаем юзера для мока
  const testUser = {
    id: "63d82644b88c7334ac1ac6aa",
    username: "test",
    text: "",
    city: "City",
    image: "image",
    likes: [],
    post: [],
    subscriptions: [],
  };

  //Мокаем данные поиска
  axios.mockResolvedValue({
    data: {
      user: [{ id: testUser.id, username: testUser.username }],
    },
    status: 200,
  });

  //Рендерим
  render(
    <AuthContext.Provider value={{ userId }}>
    <Router history={history}>
      {routes}
    </Router>
    </AuthContext.Provider>
  );

  //До появления данных поиска, должна быть загрузка
  let loading = screen.getByTestId("loader");
  expect(loading).toBeInTheDocument();
  //"Ожидаем" данные
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  //Проверка на то, что данные поиска отобразились
  let searchUser = screen.getAllByTestId("searchUser");
  expect(searchUser).toBeDefined();
  expect(searchUser).toHaveLength(1);
  //Проверка на то, что test есть
  let user = screen.getByText("test");
  expect(user).toBeInTheDocument();
  //Нажимаем на test
  axios.mockResolvedValueOnce({
    data: {
      user: testUser,
      subscibe: [],
      isSubscribe: false,
    },
  });
  fireEvent.click(user);

  //Проверяем id пользователя по истории, должен совпадать с id замоканного пользователя
  expect(history.location.pathname).toBe("/profile/" + testUser.id);


  //До появления данных юзера, должна быть загрузка
  loading = screen.getByTestId("loader");
  expect(loading).toBeInTheDocument();
  //"Ожидаем" данные
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  //Проверям, что имя пользователя есть на странице
  const username = screen.getByTestId("post-user");
  expect(username).toHaveTextContent(testUser.username);


});
