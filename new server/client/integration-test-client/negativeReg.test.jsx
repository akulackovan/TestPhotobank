import RegPage from "../src/pages/RegPage/RegPage";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";

jest.mock("axios");

afterEach(() => {
  //Очищаем моки
  jest.clearAllMocks();
});


//8 сценарий
test("8: Test reg page with busy login", async () => {
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
  //И ответ от сервера (надо ли??)
  axios.post.mockRejectedValueOnce({
    response: {
      data: {
        message: "Логин занят. Выберите другой",
      },
    },
    status: 409,
  });

  //Рендерим
  render(
    <MemoryRouter>
      <RegPage />
    </MemoryRouter>
  );

  //"Ждем" обработку от axios
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
  //Проверяем логин на месте?
  const username = screen.getByPlaceholderText("Логин");
  expect(username).toBeInTheDocument();
  //Заполняем поле
  fireEvent.change(username, { target: { value: "test" } });
  //Пароль на месте
  const password = screen.getByPlaceholderText("Пароль");
  expect(password).toBeInTheDocument();
  //Заполняем
  fireEvent.change(password, { target: { value: "test" } });

  //Отобразился ли Cpmbobox?
  expect(screen.getByTestId("city")).toBeInTheDocument();
  const mainField = screen.getByText("Город");
  expect(mainField).toBeInTheDocument();
  //Нажимаем на кнопку combobox
  fireEvent.click(mainField);
  //Есть ли объекты
  const cities = screen.getAllByTestId("city-dropdownelement");
  expect(cities).toBeDefined();
  expect(cities).toHaveLength(3);
  //Нажимаем на Москву, выбираем ее
  fireEvent.click(screen.getByText("Москва"));

  //Нажимаем на кнопку регистрации
  const regButton = screen.getByText("ЗАРЕГИСТРИРОВАТЬСЯ");
  expect(regButton).toBeInTheDocument();
  fireEvent.click(regButton);

  //"Ждем" обработку от axios
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  //Есть ли ошибка
  const error = screen.getByText("Логин занят. Выберите другой");
  //Ошибка есть
  expect(error).toBeInTheDocument();

  //


});
