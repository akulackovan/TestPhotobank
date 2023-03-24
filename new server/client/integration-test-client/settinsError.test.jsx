import { rest } from "msw";
import { setupServer } from "msw/node";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import { AuthContext } from "../src/context/AuthContext";
import { act } from "react-dom/test-utils";
import { db, createDefault, clearDB } from "./mock/db";
import { handlers } from "./handlers";
import { useRoutes } from "../src/routes";
import SettingsPage from "../src/pages/SettingsPage/SettingPage";

const server = setupServer(...handlers);
//Открываем сервер
beforeAll(() => server.listen());
// сбрасываем обработчики к дефолтной реализации после каждого теста
afterEach(() => server.resetHandlers());
// останавливаем сервер после всех тестов
afterAll(() => server.close());

test("Checking the connection between the client and server API when changing the username with an existing user", async () => {
  createDefault();

  //Поиск пользователя
  const user = db.user.findMany({});
  const { userId } = user[1]._id;
  const path = user[0].username;
  console.log("adsds");
  console.log(path);
  render(
    <AuthContext.Provider value={{ userId }}>
      <SettingsPage />
    </AuthContext.Provider>
  );

  const username = screen.getByPlaceholderText("Логин");
  expect(username).toBeInTheDocument();
  //Заполняем поле
  fireEvent.change(username, { target: { value: path } });
  expect(username.value).toBe(path);
  //Нажимаем
  const regButton = screen.getByText("СОХРАНИТЬ");
  expect(regButton).toBeInTheDocument();
  fireEvent.click(regButton);

  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  expect(screen.getByTestId("error")).toHaveTextContent(
    "Имя пользователя занято"
  );

  clearDB();
});
