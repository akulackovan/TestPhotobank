import {
  cleanup,
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import AuthPage from "../pages/AuthPage/AuthPage";
import React from "react";
import "@testing-library/jest-dom";
import axios from "axios";
import mockAxios from "jest-mock-axios";

import { AuthContext } from "../context/AuthContext";

describe("AuthPage component", () => {
  it("Checking the filling of AuthPage components", () => {
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
    fireEvent.change(password, { target: { value: "ЙЙЙЙЙЙQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF" } });
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

describe("AuthPage Fields check behavior", () => {
  it("Check input username field", () => {
    const { login, logout, token, userId, isReady, isLogin } = jest.fn();
    render(
      <AuthContext.Provider
        value={{ login, logout, token, userId, isReady, isLogin }}
      >
        <AuthPage />
      </AuthContext.Provider>
    );

    const username = screen.getByPlaceholderText("Логин");
    expect(username.value === "").toBe(true);
    fireEvent.change(username, { target: { value: "123" } });
    expect(username.value === "123").toBe(true);
  });

  it("Check input password field", () => {
    const { login, logout, token, userId, isReady, isLogin } = jest.fn();
    render(
      <AuthContext.Provider
        value={{ login, logout, token, userId, isReady, isLogin }}
      >
        <AuthPage />
      </AuthContext.Provider>
    );
    const password = screen.getByPlaceholderText("Пароль");
    expect(password.value === "").toBe(true);
    fireEvent.change(password, { target: { value: "123" } });
    expect(password.value === "123").toBe(true);
  });

  it("Check input password field and changes form", () => {
    const { login, logout, token, userId, isReady, isLogin } = jest.fn();
    render(
      <AuthContext.Provider
        value={{ login, logout, token, userId, isReady, isLogin }}
      >
        <AuthPage />
      </AuthContext.Provider>
    );
    const password = screen.getByPlaceholderText("Пароль");
    fireEvent.change(password, { target: { value: "123" } });
    expect(password.value === "123").toBe(true);
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

/*describe("AuthPage check login", () => {
  afterEach(() => {
    // уборка, оставшегося после предыдущего теста
    mockAxios.reset();
  });

  it("UppercaseProxy should get data from the server and convert it to UPPERCASE", async () => {
    let catchFn = jest.fn(),
      thenFn = jest.fn();

    const { login, logout, token, userId, isReady, isLogin } = jest.fn();
    render(
      <AuthContext.Provider
        value={{ login, logout, token, userId, isReady, isLogin }}
      >
        <AuthPage />
      </AuthContext.Provider>
    );
    screen.debug();
    const password = screen.getByPlaceholderText("Пароль");
    fireEvent.change(password, {
      target: { value: "ZIОЛюlcИziIKUIEvвyИUЕоTfлQVьгИрmhWэOдДф" },
    });
    const username = screen.getByPlaceholderText("Логин");
    fireEvent.change(username, {
      target: { value: "ZIОЛюlcИziIKUIEvвyИUЕоTfлQVьгИрmhWэOдДф" },
    });
    const loginButton = screen.getByTestId("login-button");
    expect(axios.post).toHaveBeenCalledTimes(0);
    fireEvent.click(loginButton);
    await waitFor(() => {
      /*const error = screen.getByText(
        "Такого пользователя не существует"
      );
      expect(error).toBeInTheDocument();
    expect(axios.post).toHaveBeenCalledTimes(1);
    },{timeout: 4000})
    screen.debug();
  });

  /*let response;

  beforeEach(() => {
    response = {
      data: [],
      status: 400
    }
});
  
  it("Axios' get has been called with the correct URL", async () => {
    const { login, logout, token, userId, isReady, isLogin } = jest.fn();
    render(
      <AuthContext.Provider
        value={{ login, logout, token, userId, isReady, isLogin }}
      >
        <AuthPage />
      </AuthContext.Provider>
    );
    screen.debug();
    const password = screen.getByPlaceholderText("Пароль");
    fireEvent.change(password, { target: { value: "ZIОЛюlcИziIKUIEvвyИUЕоTfлQVьгИрmhWэOдДф" } });
    const username = screen.getByPlaceholderText("Логин");
    fireEvent.change(username, { target: { value: "ZIОЛюlcИziIKUIEvвyИUЕоTfлQVьгИрmhWэOдДф" } });
    const loginButton = screen.getByTestId("login-button");
    fireEvent.click(loginButton);
    let response = {
      data: { 
        message
: 
"Такого пользователя не существует"
      },
      status: 404
    };
    axios.post.mockResolvedValue(response)
    expect(response.data.message).toBeInTheDocument();

    screen.debug();
  });
});*/
