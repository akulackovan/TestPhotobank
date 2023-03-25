import { setupServer } from "msw/node";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import { AuthContext } from "../src/context/AuthContext";
import { act } from "react-dom/test-utils";
import { db, createDefault, clearDB } from "./mock/db";
import { handlers } from "./handlers";
import { AnotherPage } from "../src/components/AnotherPage/AnotherPage";

const server = setupServer(...handlers);
//Открываем сервер
beforeAll(() => server.listen());
// сбрасываем обработчики к дефолтной реализации после каждого теста
afterEach(() => server.resetHandlers());
// останавливаем сервер после всех тестов
afterAll(() => server.close());

test("Checking communication between client and server API on user page. No user", async () => {
  createDefault();
  const { userId } = jest.fn();

  render(
    <AuthContext.Provider value={{ userId }}>
      <AnotherPage id={1} />
    </AuthContext.Provider>
  );

  const loading = screen.getByTestId("loader");
  expect(loading).toBeInTheDocument();
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
  expect(screen.getByTestId("error")).toHaveTextContent(
    "Пользователя не существует"
  );
  clearDB();
});
