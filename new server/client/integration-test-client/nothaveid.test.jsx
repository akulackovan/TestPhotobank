import { rest } from "msw";
import { setupServer } from "msw/node";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PostPage from "../src/pages/PostPage/PostPage";
import React from "react";
import { AuthContext } from "../src/context/AuthContext";
import { act } from "react-dom/test-utils";


const server = setupServer(
);

beforeAll(() => server.listen());
// сбрасываем обработчики к дефолтной реализации после каждого теста
afterEach(() => server.resetHandlers());
// останавливаем сервер после всех тестов
afterAll(() => server.close());

test("Dont have id post", async () => {
    const { userId } = "123";
    server.use(rest.put("/post/addView", (req, res, ctx) =>
        res(ctx.delay(0), 
            ctx.status(404, 'Поста не существует'), 
            ctx.json({message: 'Поста не существует'}))
    ))

    render(
        <AuthContext.Provider value={{ userId }}>
          <PostPage match={{ params: { id:  1 } }} />
        </AuthContext.Provider>
      );

      const loading = screen.getByTestId("loader");
      expect(loading).toBeInTheDocument();
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
      expect(screen.getByTestId('error')).toHaveTextContent('Поста не существует')
})