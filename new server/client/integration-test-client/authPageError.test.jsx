import { rest } from "msw";
import { setupServer } from "msw/node";
import { render, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import { act } from "react-dom/test-utils";
import { db, createDefault, clearDB } from "./mock/db";
import { handlers } from "./handlers";
import { MemoryRouter } from "react-router-dom";
import { fireEvent } from "@testing-library/react";
import AuthPage from "../src/pages/AuthPage/AuthPage";
import { AuthContext } from "../src/context/AuthContext";

const server = setupServer(...handlers);
//Открываем сервер
beforeAll(() => server.listen());
// сбрасываем обработчики к дефолтной реализации после каждого теста
afterEach(() => server.resetHandlers());
// останавливаем сервер после всех тестов
afterAll(() => server.close());

test("Checking communication between client and server API on post page. No post", async () => {
  //Мок
  createDefault();

  const { userId } = jest.fn();

  render(
    <AuthContext.Provider value={{ userId }}>
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>
    </AuthContext.Provider>
  );

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
  fireEvent.change(password, { target: { value: "testpassword" } });
  expect(password.value).toBe("testpassword");

  //Нажимаем на кнопку войти
  const regButton = screen.getByText("ВОЙТИ");
  expect(regButton).toBeInTheDocument();
  fireEvent.click(regButton);

  //"Ждем" обработку от axios
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  expect(screen.getByTestId("error")).toHaveTextContent("Неверный пароль");

  clearDB();
});
