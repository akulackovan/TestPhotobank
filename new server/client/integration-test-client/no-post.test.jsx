import { rest } from "msw";
import { setupServer } from "msw/node";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PostPage from "../src/pages/PostPage/PostPage";
import React from "react";
import { AuthContext } from "../src/context/AuthContext";
import { act } from "react-dom/test-utils";
import { db, createDefault, clearDB } from "./mock/db";
import { handlers } from './handlers'

const server = setupServer(...handlers
  
);
//Открываем сервер
beforeAll(() => server.listen());
// сбрасываем обработчики к дефолтной реализации после каждого теста
afterEach(() => server.resetHandlers());
// останавливаем сервер после всех тестов
afterAll(() => server.close());

test("Checking communication between client and server API on post page. No post", async () => {
  //Мок
  createDefault();
  const post = await db.post.findFirst({
  });
  const { userId } = jest.fn();

  render(
    <AuthContext.Provider value={{ userId }}>
      <PostPage match={{ params: { id: 1 } }} />
    </AuthContext.Provider>
  );

  const loading = screen.getByTestId("loader");
  expect(loading).toBeInTheDocument();
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
  expect(screen.getByTestId("error")).toHaveTextContent("Поста не существует");
  clearDB();
});
