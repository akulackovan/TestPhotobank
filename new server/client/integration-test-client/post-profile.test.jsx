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

test("Checking the link between profile page and post page", async () => {
  createDefault();
  const { userId } = jest.fn();
  const post = db.post.findFirst({});

  const history = createMemoryHistory();
  history.push("/post/" + post.id);

  const routes = useRoutes(true, true);
  render(
    <AuthContext.Provider value={{ userId }}>
      <Router history={history}>{routes}</Router>
    </AuthContext.Provider>
  );

  expect(screen.getByTestId("postPage")).toBeInTheDocument();
  const loading = screen.getByTestId("loader");
  expect(loading).toBeInTheDocument();
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  expect(screen.getByTestId("author")).toHaveTextContent(post.author.username);

  fireEvent.click(screen.getByTestId("author"));

  //Проверка на путь
  expect(history.location.pathname).toBe("/profile/" + post.author._id);
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
  //Проверка на имя
  expect(screen.getByTestId("post-user")).toHaveTextContent(
    post.author.username
  );
  expect(screen.getByTestId("profile")).toBeInTheDocument();
  clearDB();
});
