import { setupServer } from "msw/node";
import { render, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import { act } from "react-dom/test-utils";
import { db, createDefault, clearDB } from "./mock/db";
import { handlers } from "./handlers";
import RegPage from "../src/pages/RegPage/RegPage";
import { MemoryRouter } from "react-router-dom";
import { fireEvent } from "@testing-library/react";

const server = setupServer(...handlers);
//Открываем сервер
beforeAll(() => server.listen());
// сбрасываем обработчики к дефолтной реализации после каждого теста
afterEach(() => server.resetHandlers());
// останавливаем сервер после всех тестов
afterAll(() => server.close());

test("Checking the connection between the client and server API when registering a user with an existing user", async () => {
  //Мок
  createDefault();

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
  expect(username.value).toBe("test");
  //Пароль на месте
  const password = screen.getByPlaceholderText("Пароль");
  expect(password).toBeInTheDocument();
  //Заполняем
  fireEvent.change(password, { target: { value: "test" } });
  expect(password.value).toBe("test");

  //Отобразился ли Cpmbobox?
  expect(screen.getByTestId("city")).toBeInTheDocument();
  const mainField = screen.getByText("Город");
  expect(mainField).toBeInTheDocument();
  //Нажимаем на кнопку combobox
  fireEvent.click(mainField);
  //Есть ли объекты
  const cities = screen.getAllByTestId("city-dropdownelement");
  expect(cities).toBeDefined();
  expect(cities).toHaveLength(2);
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

  expect(screen.getByTestId("error")).toHaveTextContent(
    "Имя пользователя занято"
  );

  clearDB();
});
