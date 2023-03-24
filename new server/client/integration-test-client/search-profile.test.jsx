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
import createMemoryHistory from "history/createMemoryHistory";
import { Router, Route } from "react-router-dom";

const server = setupServer(...handlers);
//Открываем сервер
beforeAll(() => server.listen());
// сбрасываем обработчики к дефолтной реализации после каждого теста
afterEach(() => server.resetHandlers());
// останавливаем сервер после всех тестов
afterAll(() => server.close());

test("Checking the link between search page and profile page", async () => {
  createDefault();
  const { userId } = jest.fn();
  
  const search = db.user.findMany({});
  const path = search[0].username

  const history = createMemoryHistory();
  history.push("/search/" + path);

  const routes = useRoutes(true, true);
  render(
    <AuthContext.Provider value={{ userId }}>
      <Router history={history}>{routes}</Router>
    </AuthContext.Provider>
  );
  expect(screen.getByTestId("searchPage")).toBeInTheDocument();

  expect(history.location.pathname).toBe("/search/" + path);
  const loading = screen.getByTestId("loader");
  expect(loading).toBeInTheDocument();
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  expect(screen.getAllByTestId("searchUser")[0]).toHaveTextContent(path);

  fireEvent.click(screen.getByText(path));

  //Проверка на путь
  expect(history.location.pathname).toBe("/profile/" + search[0]._id);
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
  //Проверка на имя
  expect(screen.getByTestId("post-user")).toHaveTextContent(
    path
  );
  expect(screen.getByTestId("profile")).toBeInTheDocument()
  clearDB();
});
