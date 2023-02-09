import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import AuthPage from "../pages/AuthPage/AuthPage";
import React from "react";
import "@testing-library/jest-dom";

import { AuthContext } from "../context/AuthContext";

/*test("Shoud be login", () => {
    const login = jest.fn()
    const {getByText} = render(
      <AuthContext.Provider
        value={{ login }}    >
        <AuthPage />
      </AuthContext.Provider>
    );
    const submitButton = getByText('ВОЙТИ');
    fireEvent.click(submitButton);
  expect(login).toHaveBeenCalledTimes(1)
  });*/

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
    it("Check doesn't have error message", () => {
        const { login, logout, token, userId, isReady, isLogin } = jest.fn();
        render(
          <AuthContext.Provider
            value={{ login, logout, token, userId, isReady, isLogin }}
          >
            <AuthPage />
          </AuthContext.Provider>
        );
        const loginButton = screen.getByTestId("login-button")
        //тк изначально нет, то query
        const error = screen.queryByTestId("error")
        expect(error).toBeNull()
      });
    
      it("Check have error message with all empty field", async() => {
        const { login, logout, token, userId, isReady, isLogin } = jest.fn();
        render(
          <AuthContext.Provider
            value={{ login, logout, token, userId, isReady, isLogin }}
          >
            <AuthPage />
          </AuthContext.Provider>
        );
        screen.debug()
        expect(screen.queryByTestId("error")).toBeNull()
        const username = screen.getByPlaceholderText("Логин")
        expect(username.value === "").toBe(true);
        const password = screen.getByPlaceholderText("Пароль")
        expect(password.value === "").toBe(true);
        const loginButton = screen.getByTestId("login-button")
        fireEvent.click(loginButton)
        const error = screen.getByText("Заполнены не все поля")
        expect(error).toBeInTheDocument()
        screen.debug()
      });


      it("Check have error message with password empty field", async() => {
        const { login, logout, token, userId, isReady, isLogin } = jest.fn();
        render(
          <AuthContext.Provider
            value={{ login, logout, token, userId, isReady, isLogin }}
          >
            <AuthPage />
          </AuthContext.Provider>
        );
        screen.debug()
        expect(screen.queryByTestId("error")).toBeNull()
        const username = screen.getByPlaceholderText("Логин")
        fireEvent.change(username, { target: { value: "123" } });
        expect(username.value === "123").toBe(true);
        const password = screen.getByPlaceholderText("Пароль")
        expect(password.value === "").toBe(true);
        const loginButton = screen.getByTestId("login-button")
        fireEvent.click(loginButton)
        const error = screen.getByText("Заполнены не все поля")
        expect(error).toBeInTheDocument()
        screen.debug()
      });

      it("Check have error message with username empty field", async() => {
        const { login, logout, token, userId, isReady, isLogin } = jest.fn();
        render(
          <AuthContext.Provider
            value={{ login, logout, token, userId, isReady, isLogin }}
          >
            <AuthPage />
          </AuthContext.Provider>
        );
        screen.debug()
        expect(screen.queryByTestId("error")).toBeNull()
        const username = screen.getByPlaceholderText("Логин")
        expect(username.value === "").toBe(true);
        const password = screen.getByPlaceholderText("Пароль")
        fireEvent.change(password, { target: { value: "123" } });
        expect(password.value === "123").toBe(true);
        const loginButton = screen.getByTestId("login-button")
        fireEvent.click(loginButton)
        const error = screen.getByText("Заполнены не все поля")
        expect(error).toBeInTheDocument()
        screen.debug()
      });


      it("Check have error message with username wrong input symbols", async() => {
        const { login, logout, token, userId, isReady, isLogin } = jest.fn();
        render(
          <AuthContext.Provider
            value={{ login, logout, token, userId, isReady, isLogin }}
          >
            <AuthPage />
          </AuthContext.Provider>
        );
        screen.debug()
        expect(screen.queryByTestId("error")).toBeNull()
        const username = screen.getByPlaceholderText("Логин")
        fireEvent.change(username, { target: { value: "123" } });
        expect(username.value === "123").toBe(true);
        const password = screen.getByPlaceholderText("Пароль")
        fireEvent.change(password, { target: { value: "test" } });
        expect(password.value === "test").toBe(true);
        const loginButton = screen.getByTestId("login-button")
        fireEvent.click(loginButton)
        const error = screen.getByText("Имя пользователя должно содержать только символы русского и английского алфавита")
        expect(error).toBeInTheDocument()
        screen.debug()
      });


      it("Check have error message with username more then 128 symbols", async() => {
        const { login, logout, token, userId, isReady, isLogin } = jest.fn();
        render(
          <AuthContext.Provider
            value={{ login, logout, token, userId, isReady, isLogin }}
          >
            <AuthPage />
          </AuthContext.Provider>
        );
        screen.debug()
        expect(screen.queryByTestId("error")).toBeNull()
        const username = screen.getByPlaceholderText("Логин")
        fireEvent.change(username, { target: { value: "ZIОЛюlcИziIKUIEvвyИUЕоTfлQVьгИрmhWэOдДфПcюяNНNqtKшзцпОцшСоъеZIОЛюlcИziIKUIEvвyИUЕоTfлQVьгИрmhWэOдДфПcюяNНNqtKшзцпОцшСоъеZIОЛюlcИziIKUIEvвyИUЕоTfлQVьгИрmhWэOдДфПcюяNНNqtKшзцпОцшСоъе" } });
        const password = screen.getByPlaceholderText("Пароль")
        fireEvent.change(password, { target: { value: "test" } });
        expect(password.value === "test").toBe(true);
        const loginButton = screen.getByTestId("login-button")
        fireEvent.click(loginButton)
        const error = screen.getByText("Имя пользователя должно быть меньше 128 символов")
        expect(error).toBeInTheDocument()
        screen.debug()
      });
})

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

    const username = screen.getByPlaceholderText("Логин")
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
