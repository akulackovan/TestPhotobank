import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router";
import { useRoutes } from "../src/routes";
import { Router, Route } from "react-router-dom";
import createMemoryHistory from "history/createMemoryHistory";
import { AuthContext } from "../src/context/AuthContext";

import { act } from "react-dom/test-utils";
import axios from "axios";

jest.mock("axios");
afterEach(() => {
  jest.clearAllMocks();
});

//Проверка связи между страницей пользователя и страницы добавления поста
test("Checking the link between the user page and the add post page", async () => {
  //Мокаем (задаем) id пользователя за которым сидим
  const { userId } = "63d82644b88c7334ac1ac6aa";

  //Роутер нужен для перехода по страницам, но он принимает 2 значения готов и логин,
  //Для тестов готов должен быть всегда true, логин по необходимости (false, если нужны страницы регистрации и пользователя)
  const routes = useRoutes(true, true);

  //Создаем историю переходов
  const history = createMemoryHistory();
  //Первый переход на страницу поиска с поиском
  history.push("/profile");

  //Задаем юзера для мока
  const testUser = {
    _id: "63d82644b88c7334ac1ac6aa",
    username: "test",
    text: "",
    city: "123",
    image: "image",
    likes: [],
    post: [],
    subscriptions: [],
  };

  //мокаем, тк нам не важны данные юзера
  axios.mockResolvedValue({
    data: {
      user: testUser,
      subscibe: 0,    
    },
    
  });
  //Рендерим
  render(
    <AuthContext.Provider value={{ userId }}>
      <Router history={history}>{routes}</Router>
    </AuthContext.Provider>
  );

  //Проверяем путь
  expect(history.location.pathname).toBe("/profile");

  //До появления данных юзера, должна быть загрузка
  const loading = screen.getByTestId("loader");
  expect(loading).toBeInTheDocument();
  //"Ожидаем" данные
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  //Проверям, что кнопка есть и нажимаем на нее
  const addPost = await screen.getByText("Добавить фото");
  expect(addPost).toBeInTheDocument();
  //Перед тем как нажать, мокаем города для combobox, чтобы все загрузилось
  axios.get.mockResolvedValue({
    data: {
      city: [
        { _id: "63b9473e70bfa1abe160400f", city: "Москва" },
        { _id: "63b94e8d70bfa1abe1604015", city: "Санкт-Петербург" },
        { _id: "63b96121b19de65ebdf4cd50", city: "Абаза\r", __v: 0 },
      ],
    },
    status: 200,
  });

  fireEvent.click(addPost);

  //Проверяем путь
  expect(history.location.pathname).toBe("/post");
  //Проверяем, что страница загрузилась через общий div
  expect(screen.getByTestId("auth"))

});
