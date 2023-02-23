import { render, screen, fireEvent } from "@testing-library/react";
import AuthPage from "../pages/AuthPage/AuthPage";
import React from "react";
import "@testing-library/jest-dom";
import axios from "axios";

import { act } from "react-dom/test-utils";

import { AuthContext } from "../context/AuthContext";

//Ставим заглушку - не обращамся напрямую к серверу, а представляем, чтобы он нам выдал хороший/плохой ответ
jest.mock("axios");

describe("AuthPage component", () => {
  it("Checking the filling of AuthPage components", () => {
    //Используем Mock-функцию
    //Игнорируем детали реализации
    const { login, logout, token, userId, isReady, isLogin } = jest.fn();
    render(
      <AuthContext.Provider
        value={{ login, logout, token, userId, isReady, isLogin }}
      >
        <AuthPage />
      </AuthContext.Provider>
    );
    const username = screen.getByPlaceholderText("Логин");
    expect(username).toBeInTheDocument();
    const password = screen.getByPlaceholderText("Пароль");
    expect(password).toBeInTheDocument();
    const loginButton = screen.getByText("ВОЙТИ");
    expect(loginButton).toBeInTheDocument();
    const regButton = screen.getByText("РЕГИСТРАЦИЯ");
    expect(regButton).toBeInTheDocument();
  });
});

describe("AuthPage Error Message", () => {
  it("Start doesn't have error message ", () => {
    const { login, logout, token, userId, isReady, isLogin } = jest.fn();
    render(
      <AuthContext.Provider
        value={{ login, logout, token, userId, isReady, isLogin }}
      >
        <AuthPage />
      </AuthContext.Provider>
    );
    const error = screen.queryByTestId("error");
    expect(error).toBeNull();
  });

  it("Check have error message with all empty field", async () => {
    const { login, logout, token, userId, isReady, isLogin } = jest.fn();
    render(
      <AuthContext.Provider
        value={{ login, logout, token, userId, isReady, isLogin }}
      >
        <AuthPage />
      </AuthContext.Provider>
    );
    screen.debug();
    expect(screen.queryByTestId("error")).toBeNull();
    const username = screen.getByPlaceholderText("Логин");
    expect(username.value === "").toBe(true);
    const password = screen.getByPlaceholderText("Пароль");
    expect(password.value === "").toBe(true);
    const loginButton = screen.getByTestId("login-button");
    fireEvent.click(loginButton);
    const error = screen.getByText("Заполнены не все поля");
    expect(error).toBeInTheDocument();
    screen.debug();
  });

  it("Check have error message with password empty field", async () => {
    const { login, logout, token, userId, isReady, isLogin } = jest.fn();
    render(
      <AuthContext.Provider
        value={{ login, logout, token, userId, isReady, isLogin }}
      >
        <AuthPage />
      </AuthContext.Provider>
    );
    screen.debug();
    expect(screen.queryByTestId("error")).toBeNull();
    const username = screen.getByPlaceholderText("Логин");
    fireEvent.change(username, { target: { value: "123" } });
    expect(username.value === "123").toBe(true);
    const password = screen.getByPlaceholderText("Пароль");
    expect(password.value === "").toBe(true);
    const loginButton = screen.getByTestId("login-button");
    fireEvent.click(loginButton);
    const error = screen.getByText("Заполнены не все поля");
    expect(error).toBeInTheDocument();
    screen.debug();
  });

  it("Check have error message with username empty field and password have wrong symbols", async () => {
    const { login, logout, token, userId, isReady, isLogin } = jest.fn();
    render(
      <AuthContext.Provider
        value={{ login, logout, token, userId, isReady, isLogin }}
      >
        <AuthPage />
      </AuthContext.Provider>
    );
    screen.debug();
    expect(screen.queryByTestId("error")).toBeNull();
    const username = screen.getByPlaceholderText("Логин");
    expect(username.value === "").toBe(true);
    const password = screen.getByPlaceholderText("Пароль");
    fireEvent.change(password, { target: { value: "123" } });
    expect(password.value === "123").toBe(true);
    const loginButton = screen.getByTestId("login-button");
    fireEvent.click(loginButton);
    const error = screen.getByText("Заполнены не все поля");
    expect(error).toBeInTheDocument();
    screen.debug();
  });

  it("Check have error message with username empty field and password have more then 128 symbols", async () => {
    const { login, logout, token, userId, isReady, isLogin } = jest.fn();
    render(
      <AuthContext.Provider
        value={{ login, logout, token, userId, isReady, isLogin }}
      >
        <AuthPage />
      </AuthContext.Provider>
    );
    screen.debug();
    expect(screen.queryByTestId("error")).toBeNull();
    const username = screen.getByPlaceholderText("Логин");
    expect(username.value === "").toBe(true);
    const password = screen.getByPlaceholderText("Пароль");
    fireEvent.change(password, {
      target: {
        value:
          "ЙЙЙЙЙЙQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
      },
    });
    const loginButton = screen.getByTestId("login-button");
    fireEvent.click(loginButton);
    const error = screen.getByText("Заполнены не все поля");
    expect(error).toBeInTheDocument();
    screen.debug();
  });

  it("Check have error message with username empty field and password is correct", async () => {
    const { login, logout, token, userId, isReady, isLogin } = jest.fn();
    render(
      <AuthContext.Provider
        value={{ login, logout, token, userId, isReady, isLogin }}
      >
        <AuthPage />
      </AuthContext.Provider>
    );
    screen.debug();
    expect(screen.queryByTestId("error")).toBeNull();
    const username = screen.getByPlaceholderText("Логин");
    expect(username.value === "").toBe(true);
    const password = screen.getByPlaceholderText("Пароль");
    fireEvent.change(password, { target: { value: "тест" } });
    const loginButton = screen.getByTestId("login-button");
    fireEvent.click(loginButton);
    const error = screen.getByText("Заполнены не все поля");
    expect(error).toBeInTheDocument();
    screen.debug();
  });

  it("Check have error message with username wrong input symbols", async () => {
    const { login, logout, token, userId, isReady, isLogin } = jest.fn();
    render(
      <AuthContext.Provider
        value={{ login, logout, token, userId, isReady, isLogin }}
      >
        <AuthPage />
      </AuthContext.Provider>
    );
    screen.debug();
    expect(screen.queryByTestId("error")).toBeNull();
    const username = screen.getByPlaceholderText("Логин");
    fireEvent.change(username, { target: { value: "123" } });
    expect(username.value === "123").toBe(true);
    const password = screen.getByPlaceholderText("Пароль");
    fireEvent.change(password, { target: { value: "test" } });
    expect(password.value === "test").toBe(true);
    const loginButton = screen.getByTestId("login-button");
    fireEvent.click(loginButton);
    const error = screen.getByText(
      "Имя пользователя должно содержать только символы русского и английского алфавита"
    );
    expect(error).toBeInTheDocument();
    screen.debug();
  });

  it("Check have error message with username more then 128 symbols", async () => {
    const { login, logout, token, userId, isReady, isLogin } = jest.fn();
    render(
      <AuthContext.Provider
        value={{ login, logout, token, userId, isReady, isLogin }}
      >
        <AuthPage />
      </AuthContext.Provider>
    );
    screen.debug();
    expect(screen.queryByTestId("error")).toBeNull();
    const username = screen.getByPlaceholderText("Логин");
    fireEvent.change(username, {
      target: {
        value:
          "ZIОЛюlcИziIKUIEvвyИUЕоTfлQVьгИрmhWэOдДфПcюяNНNqtKшзцпОцшСоъеZIОЛюlcИziIKUIEvвyИUЕоTfлQVьгИрmhWэOдДфПcюяNНNqtKшзцпОцшСоъеZIОЛюlcИziIKUIEvвyИUЕоTfлQVьгИрmhWэOдДфПcюяNНNqtKшзцпОцшСоъе",
      },
    });
    const password = screen.getByPlaceholderText("Пароль");
    fireEvent.change(password, { target: { value: "test" } });
    expect(password.value === "test").toBe(true);
    const loginButton = screen.getByTestId("login-button");
    fireEvent.click(loginButton);
    const error = screen.getByText(
      "Имя пользователя должно быть меньше 128 символов"
    );
    expect(error).toBeInTheDocument();
    screen.debug();
  });

  it("Check have error message with username wrong input symbols but password also wrong", async () => {
    const { login, logout, token, userId, isReady, isLogin } = jest.fn();
    render(
      <AuthContext.Provider
        value={{ login, logout, token, userId, isReady, isLogin }}
      >
        <AuthPage />
      </AuthContext.Provider>
    );
    screen.debug();
    expect(screen.queryByTestId("error")).toBeNull();
    const username = screen.getByPlaceholderText("Логин");
    fireEvent.change(username, { target: { value: "123" } });
    expect(username.value === "123").toBe(true);
    const password = screen.getByPlaceholderText("Пароль");
    fireEvent.change(password, { target: { value: "123" } });
    expect(password.value === "123").toBe(true);
    const loginButton = screen.getByTestId("login-button");
    fireEvent.click(loginButton);
    const error = screen.getByText(
      "Имя пользователя должно содержать только символы русского и английского алфавита"
    );
    expect(error).toBeInTheDocument();
    screen.debug();
  });

  it("Check have error message with username more then 128 symbols but password also wrong", async () => {
    const { login, logout, token, userId, isReady, isLogin } = jest.fn();
    render(
      <AuthContext.Provider
        value={{ login, logout, token, userId, isReady, isLogin }}
      >
        <AuthPage />
      </AuthContext.Provider>
    );
    screen.debug();
    expect(screen.queryByTestId("error")).toBeNull();
    const username = screen.getByPlaceholderText("Логин");
    fireEvent.change(username, {
      target: {
        value:
          "ZIОЛюlcИziIKUIEvвyИUЕоTfлQVьгИрmhWэOдДфПcюяNНNqtKшзцпОцшСоъеZIОЛюlcИziIKUIEvвyИUЕоTfлQVьгИрmhWэOдДфПcюяNНNqtKшзцпОцшСоъеZIОЛюlcИziIKUIEvвyИUЕоTfлQVьгИрmhWэOдДфПcюяNНNqtKшзцпОцшСоъе",
      },
    });
    const password = screen.getByPlaceholderText("Пароль");
    fireEvent.change(password, { target: { value: "123" } });
    expect(password.value === "123").toBe(true);
    const loginButton = screen.getByTestId("login-button");
    fireEvent.click(loginButton);
    const error = screen.getByText(
      "Имя пользователя должно быть меньше 128 символов"
    );
    expect(error).toBeInTheDocument();
    screen.debug();
  });

  it("Check have error with correct username but password more then 128 symbols", async () => {
    const { login, logout, token, userId, isReady, isLogin } = jest.fn();
    render(
      <AuthContext.Provider
        value={{ login, logout, token, userId, isReady, isLogin }}
      >
        <AuthPage />
      </AuthContext.Provider>
    );
    screen.debug();
    expect(screen.queryByTestId("error")).toBeNull();
    const password = screen.getByPlaceholderText("Пароль");
    fireEvent.change(password, {
      target: {
        value:
          "ZIОЛюlcИziIKUIEvвyИUЕоTfлQVьгИрmhWэOдДфПcюяNНNqtKшзцпОцшСоъеZIОЛюlcИziIKUIEvвyИUЕоTfлQVьгИрmhWэOдДфПcюяNНNqtKшзцпОцшСоъеZIОЛюlcИziIKUIEvвyИUЕоTfлQVьгИрmhWэOдДфПcюяNНNqtKшзцпОцшСоъе",
      },
    });
    const username = screen.getByPlaceholderText("Логин");
    fireEvent.change(username, { target: { value: "test" } });
    expect(username.value === "test").toBe(true);
    const loginButton = screen.getByTestId("login-button");
    fireEvent.click(loginButton);
    const error = screen.getByText("Пароль должен быть меньше 128 символов");
    expect(error).toBeInTheDocument();
    screen.debug();
  });

  it("Check have error with correct username but password has wrong symbols", async () => {
    const { login, logout, token, userId, isReady, isLogin } = jest.fn();
    render(
      <AuthContext.Provider
        value={{ login, logout, token, userId, isReady, isLogin }}
      >
        <AuthPage />
      </AuthContext.Provider>
    );
    screen.debug();
    expect(screen.queryByTestId("error")).toBeNull();
    const password = screen.getByPlaceholderText("Пароль");
    fireEvent.change(password, { target: { value: "123" } });
    const username = screen.getByPlaceholderText("Логин");
    fireEvent.change(username, { target: { value: "test" } });
    expect(username.value === "test").toBe(true);
    const loginButton = screen.getByTestId("login-button");
    fireEvent.click(loginButton);
    const error = screen.getByText(
      "Пароль должен содержать только символы русского и английского алфавита"
    );
    expect(error).toBeInTheDocument();
    screen.debug();
  });
});

/**
 * TO-DO:
 *
 * Проверить axios
 *
 *
 *
 */

describe("AuthPage check axios request to render", () => {
  afterEach(() => {
    // уборка, оставшегося после предыдущего теста
    jest.clearAllMocks();
  });

  it("Should have error from server", async () => {
    const { login, logout, token, userId, isLogin } = jest.fn();
    render(
      <AuthContext.Provider value={{ login, logout, token, userId, isLogin }}>
        <AuthPage />
      </AuthContext.Provider>
    );
    screen.debug();
    expect(screen.queryByTestId("error")).toBeNull();
    const username = screen.getByPlaceholderText("Логин");
    fireEvent.change(username, {
      target: {
        value: "ZIОЛюlcИziIKUIE",
      },
    });

    //Ставим заглушку - не обращаемся к серверу напрямую, а представляем чтобы он нам выдал при ошибке
    axios.post.mockRejectedValueOnce({
      response: {
        data: {
          message: "Ошибка при авторизации.",
        },
      },
      status: 400,
    });

    const password = screen.getByPlaceholderText("Пароль");
    fireEvent.change(password, { target: { value: "SSDSdsadas" } });
    expect(password.value === "SSDSdsadas").toBe(true);
    const loginButton = screen.getByTestId("login-button");
    fireEvent.click(loginButton);
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    const error = screen.getByText("Ошибка при авторизации.");
    expect(error).toBeInTheDocument();
    screen.debug();
  });

  /*it("Should not have error from server", async () => {
    
    jest.mock('login');
    const { logout, token, userId, isLogin } = jest.fn();
    render(
      <AuthContext.Provider value={{ login, logout, token, userId, isLogin }}>
        <AuthPage />
      </AuthContext.Provider>
    );
    screen.debug();
    expect(screen.queryByTestId("error")).toBeNull();
    const username = screen.getByPlaceholderText("Логин");
    fireEvent.change(username, {
      target: {
        value: "тест",
      },
    });

    //Ставим заглушку - не обращаемся к серверу напрямую, а представляем чтобы он нам выдал при ошибке
    axios.post.mockResolvedValueOnce({
      data: {
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzYjk0ZTYzNDAxY2FmYmJmMGJlMGE4ZCIsImlhdCI6MTY3NzE1NzE3NSwiZXhwIjoxNjc3MTc3MTc1fQ.rVjnBbnQd05DK2kKe-t1sP9wKV4VIiHArCsTBAeLZxw",
        user: {
          _id: "63b94e63401cafbbf0be0a8d",
          username: "тест",
          password:
            "$2a$10$NCUepd1./JlbdPTrMDGWRuKxkf6GtNGy0oj/l2cXpn/U6cXHX846y",
          text: "Это тест",
          city: "63b9473e70bfa1abe160400f",
        },
        message: "Успешный вход в систему.",
      },
      status: 200,
    });

    const mock = jest.fn();



    const password = screen.getByPlaceholderText("Пароль");
    fireEvent.change(password, { target: { value: "тест" } });
    expect(password.value === "тест").toBe(true);
    const loginButton = screen.getByTestId("login-button");
    fireEvent.click(loginButton);
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    const error = screen.getByText("Ошибка при авторизации.");
    expect(error).toBeInTheDocument();
    screen.debug();
  });*/
});
