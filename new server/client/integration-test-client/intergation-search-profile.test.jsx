import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router";
import { useRoutes } from "../src/routes";
import { BrowserRouter as Router } from "react-router-dom";
import axios from "axios";
import ProfilePage from "../src/pages/ProfilePage/ProfilePage";
import SearchPage from "../src/pages/SearchPage/SearchPage";
import { createMemoryHistory } from "history";
import { AuthContext } from "../src/context/AuthContext";
import { act } from "react-dom/test-utils";

jest.mock("axios");

afterEach(() => {
  //Очищаем моки
  jest.clearAllMocks();
});

//2 сценарий - проверка переключения кнопок NavBar - оказываемся на замоканных страницах
//Должен меняться url
test("5: Checking the interface link between the search page module and profile page", async () => {
  //Роутер нужен для перехода по страницам, но он принимает 2 значения готов и логин,
  //Для тестов готов должен быть всегда true, логин по необходимости (false, если нужны страницы регистрации и пользователя)
  const routes = useRoutes(true, true);

  //Начинаем с пути /search/test, где test - поиск по имени

  //Мокаем данные поска
  const testUser = {
    id: "63d82644b88c7334ac1ac6aa",
    username: "test",
    text: "",
    city: "City",
    image: "image",
    likes: [],
    subsscriptions: [],
  };
  axios.mockResolvedValue({
    data: {
      user: [{ id: testUser.id, username: testUser.username }],
    },
    status: 200,
  });
  const { userId } = jest.fn();

  render(
    <AuthContext.Provider value={{ userId }}>
      <MemoryRouter initialEntries={["/search/test"]}>{routes}</MemoryRouter>
    </AuthContext.Provider>
  );

  //Должны быть на странице поиска
  //expect(global.window.location.href).toContain("http://localhost/search/test");

  //До появления данных, должна быть загрузка
  let loading = screen.getByTestId("loader");
  expect(loading).toBeInTheDocument();
  //Ждем
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  //Проверка на то, что данные поиска отобразились
  let searchUser = screen.getAllByTestId("searchUser");
  expect(searchUser).toBeDefined();
  expect(searchUser).toHaveLength(1);
  //Проверка на test
  let user = screen.getByText("test");
  expect(user).toBeInTheDocument();
  //Нажимаем на test
  fireEvent.click(user);
  /*expect(global.window.location.href).toContain(
    "http://localhost/profile/" + testUser
  );

  const AnotherUser = screen.getByTestId("AnotherPage");
  expect(AnotherUser).toBeInTheDocument();

  //До появления данных, должна быть загрузка
  loading = screen.getByTestId("loader");
  expect(loading).toBeInTheDocument();

  //Должны перейти на /profile с id
  /*expect(global.window.location.href).toContain(
    "http://localhost/profile/" + testUser
  );*/
});
