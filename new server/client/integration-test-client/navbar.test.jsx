import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router";
import { useRoutes } from "../src/routes";
import { Router, Route } from "react-router-dom";
import PopularPage from "../src/pages/PopularPage/PopularPage";
import SubscribePage from "../src/pages/SubscribePage/SubscribePage";
import SettingsPage from "../src/pages/SettingsPage/SettingPage";
import ProfilePage from "../src/pages/ProfilePage/ProfilePage";
import createMemoryHistory from "history/createMemoryHistory";
import { AuthContext } from "../src/context/AuthContext";

//мок страниц, тк нам неважно для 2 теста, что именно на них будет
//важно только, что совершен переход
//Для других тестов по типу переход Профиль->Добавление фото надо, но можно (и желательно) замокать ответ от сервера
jest.mock("../src/pages/PopularPage/PopularPage");
jest.mock("../src/pages/SubscribePage/SubscribePage");
jest.mock("../src/pages/SettingsPage/SettingPage");
jest.mock("../src/pages/ProfilePage/ProfilePage");

afterEach(() => {
  //Очищаем моки
  jest.clearAllMocks();
});

//проверка переключения кнопок NavBar - оказываемся на замоканных страницах
//Должен меняться url
test("2: Checking the interface link between the site header module and page modules popular, subscriptions, settings, profile", async () => {
  //Мок страниц, тк нам для теста неважно, что на них находится, будем просто выводить их названия
  PopularPage.mockImplementation(() => <div>PopularPage</div>);
  SubscribePage.mockImplementation(() => <div>SubscribePage</div>);
  SettingsPage.mockImplementation(() => <div>SettingsPage</div>);
  ProfilePage.mockImplementation(() => <div>ProfilePage</div>);
  const { userId } = "123";

  //Роутер нужен для перехода по страницам, но он принимает 2 значения готов и логин,
  //Для тестов готов должен быть всегда true, логин по необходимости (false, если нужны страницы регистрации и пользователя)
  const routes = useRoutes(true, true);
  const history = createMemoryHistory();
  history.push("/");

  //Начинаем с пути /, должен автоматически перекинуть на popular
  render(
    <AuthContext.Provider value={{ userId }}>
      <Router history={history}>{routes}</Router>
    </AuthContext.Provider>
  );

  //Проверка на NavBar
  const nav = screen.getByTestId("nav");
  expect(nav).toBeInTheDocument();

  //Перекинул на Popular
  fireEvent.click(screen.getByText("Популярное"));
  const popular = screen.getByText("PopularPage");
  expect(popular).toBeInTheDocument();
  expect(history.location.pathname).toBe("/popular");

  //Подписки
  fireEvent.click(screen.getByText("Подписки"));
  expect(screen.getByText("SubscribePage")).toBeInTheDocument();
  expect(history.location.pathname).toBe("/subsc");

  //Профиль
  fireEvent.click(screen.getByText("Профиль"));
  expect(screen.getByText("ProfilePage")).toBeInTheDocument();
  expect(history.location.pathname).toBe("/profile");

  //Настройки
  fireEvent.click(screen.getByText("Настройки"));
  expect(screen.getByText("SettingsPage")).toBeInTheDocument();
  expect(history.location.pathname).toBe("/settings");
});
