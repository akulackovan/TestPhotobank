import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import { useRoutes } from "../src/routes";
import { Router } from "react-router-dom";
import createMemoryHistory from "history/createMemoryHistory";
import { AuthContext } from "../src/context/AuthContext";
import axios from "axios";

jest.mock("axios");

afterEach(() => {
  //Очищаем моки
  jest.clearAllMocks();
});

test("Checking the connection between the login and registration pages", async () => {
  //Мокаем данные о городах
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

  const routes = useRoutes(false, true);
  const history = createMemoryHistory();
  history.push("/auth");

  const userId = jest.fn();
  //Начинаем с пути /, должен автоматически перекинуть на popular
  render(
    <AuthContext.Provider value={{ userId }}>
      <Router history={history}>{routes}</Router>
    </AuthContext.Provider>
  );

  //Проверка на страницу входа
  const auth = screen.getByTestId("auth");
  expect(auth).toBeInTheDocument();

  //Нажимаем на кнопку
  const button = screen.getByText(/Регистрация/i);
  expect(button).toBeInTheDocument();
  fireEvent.click(button);

  //Переход на регистрацию, проверяем основной div
  const reg = screen.getByTestId("reg");
  expect(reg).toBeInTheDocument();
});
