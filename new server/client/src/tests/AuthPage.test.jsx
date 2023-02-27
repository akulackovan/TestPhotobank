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
  it("Should the filling of AuthPage components", () => {
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
  it("Should Start doesn't have error message ", () => {
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

  //1
  it("Should have error message with all empty field", async () => {
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

  //6
  it("Should have error message with password empty field", async () => {
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

  //3
  it("Should have error message with username empty field and password have wrong symbols", async () => {
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

  //2
  it("Should have error message with username empty field and password have more then 128 symbols", async () => {
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

  //4
  it("Should have error message with username empty field and password is correct", async () => {
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

  //14
  it("Should have error message with username wrong input symbols", async () => {
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
      "Логин должен содержать только символы русского и английского алфавита"
    );
    expect(error).toBeInTheDocument();
    screen.debug();
  });

  //9
  it("Should have error message with username more then 128 symbols", async () => {
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
      "Логин должен содержать до 128 символов"
    );
    expect(error).toBeInTheDocument();
    screen.debug();
  });

  //13
  it("Should have error message with username wrong input symbols but password also wrong", async () => {
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
      "Логин должен содержать только символы русского и английского алфавита"
    );
    expect(error).toBeInTheDocument();
    screen.debug();
  });

  //8
  it("Should have error message with username more then 128 symbols but password also wrong", async () => {
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
      "Логин должен содержать до 128 символов"
    );
    expect(error).toBeInTheDocument();
    screen.debug();
  });

  //
  it("Should have error with correct username but password more then 128 symbols", async () => {
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
    const error = screen.getByText("Пароль должен содержать до 128 символов");
    expect(error).toBeInTheDocument();
    screen.debug();
  });

  //18
  it("Should have error with correct username but password has wrong symbols", async () => {
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

  //5
  it("Should have error with empty username but password has wrong symbols and length", async () => {
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
    fireEvent.change(password, { target: { value: "123reeeeeeeeeee232rdsgggggdgggggggggggggggggggggggggddddddddddddddddddddddddddddddddddddddddddssssssssssssssss" } });
    const username = screen.getByPlaceholderText("Логин");
    fireEvent.change(username, { target: { value: "" } });
    expect(username.value === "").toBe(true);
    const loginButton = screen.getByTestId("login-button");
    fireEvent.click(loginButton);
    const error = screen.getByText(
      "Заполнены не все поля"
    );
    expect(error).toBeInTheDocument();
    screen.debug();
  });

    //7
    it("Should have error with empty username but password has wrong symbols and length", async () => {
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
      fireEvent.change(password, { target: { value: "роооооооооооооооооооооооооооооооооооооооооооооооrdsgggggdgggggggggggggggggggggggggddddddddddddddddddddddddddddddddddddddddddssssssssssssssss" } });
      const username = screen.getByPlaceholderText("Логин");
      fireEvent.change(username, { target: { value: "ооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооо" } });
      const loginButton = screen.getByTestId("login-button");
      fireEvent.click(loginButton);
      const error = screen.getByText(
        "Логин должен содержать до 128 символов"
      );
      expect(error).toBeInTheDocument();
      screen.debug();
    });

        //10
        it("Should have error with 128 lenght username but password has wrong length", async () => {
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
          fireEvent.change(password, { target: { value: "роооооооооооооооооооооооооооооооооооооооооооооооrdsgggggdgggggggggggggggggggggggggddddddddddddddddddddddddddddddddddddddddddssssssssssssssss" } });
          const username = screen.getByPlaceholderText("Логин");
          fireEvent.change(username, { target: { value: "ооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооо" } });
          const loginButton = screen.getByTestId("login-button");
          fireEvent.click(loginButton);
          const error = screen.getByText(
            "Логин должен содержать до 128 символов"
          );
          expect(error).toBeInTheDocument();
          screen.debug();
        });

        //11
        it("Should have error with uncorrect symbols username but password is empty", async () => {
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
          fireEvent.change(password, { target: { value: "" } });
          const username = screen.getByPlaceholderText("Логин");
          fireEvent.change(username, { target: { value: "122" } });
          const loginButton = screen.getByTestId("login-button");
          fireEvent.click(loginButton);
          const error = screen.getByText(
            "Заполнены не все поля");
          expect(error).toBeInTheDocument();
          screen.debug();
        });

         //12
         it("Should have error with uncorrect symbols username but password has wrong lenght", async () => {
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
          fireEvent.change(password, { target: { value: "ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss" } });
          const username = screen.getByPlaceholderText("Логин");
          fireEvent.change(username, { target: { value: "122" } });
          const loginButton = screen.getByTestId("login-button");
          fireEvent.click(loginButton);
          const error = screen.getByText(
            "Логин должен содержать только символы русского и английского алфавита"
            );
          expect(error).toBeInTheDocument();
          screen.debug();
        });

        //15
        it("Should have error with uncorrect symbols username but password has wrong lenght and symbols", async () => {
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
          fireEvent.change(password, { target: { value: "sssssssssswe34343ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss" } });
          const username = screen.getByPlaceholderText("Логин");
          fireEvent.change(username, { target: { value: "122" } });
          const loginButton = screen.getByTestId("login-button");
          fireEvent.click(loginButton);
          const error = screen.getByText(
            "Логин должен содержать только символы русского и английского алфавита"
            );
          expect(error).toBeInTheDocument();
          screen.debug();
        });


        //16
        it("Should have error with correct username but password is empty", async () => {
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
          fireEvent.change(password, { target: { value: "" } });
          const username = screen.getByPlaceholderText("Логин");
          fireEvent.change(username, { target: { value: "122" } });
          const loginButton = screen.getByTestId("login-button");
          fireEvent.click(loginButton);
          const error = screen.getByText(
            "Заполнены не все поля");
          expect(error).toBeInTheDocument();
          screen.debug();
        });


        //20
        it("Should have error with correct username but password has wrong lenght and symbols", async () => {
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
          fireEvent.change(password, { target: { value: "выыыыы2444444444444444ооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооо" } });
          const username = screen.getByPlaceholderText("Логин");
          fireEvent.change(username, { target: { value: "test" } });
          const loginButton = screen.getByTestId("login-button");
          fireEvent.click(loginButton);
          const error = screen.getByText(
            "Пароль должен содержать только символы русского и английского алфавита"
      );
          expect(error).toBeInTheDocument();
          screen.debug();
        });

        //21
        it("Should have error with uncorrect username but password is empty", async () => {
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
          fireEvent.change(password, { target: { value: "" } });
          const username = screen.getByPlaceholderText("Логин");
          fireEvent.change(username, { target: { value: "выыыыы2444444444444444ооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооо" } });
          const loginButton = screen.getByTestId("login-button");
          fireEvent.click(loginButton);
          const error = screen.getByText(
            "Заполнены не все поля"
      );
          expect(error).toBeInTheDocument();
          screen.debug();
        });

        //22
        it("Should have error with uncorrect username but password has wrong length", async () => {
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
          fireEvent.change(password, { target: { value: "ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss" } });
          const username = screen.getByPlaceholderText("Логин");
          fireEvent.change(username, { target: { value: "выыыыы2444444444444444ооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооо" } });
          const loginButton = screen.getByTestId("login-button");
          fireEvent.click(loginButton);
          const error = screen.getByText(
            "Логин должен содержать только символы русского и английского алфавита"
      
      );
          expect(error).toBeInTheDocument();
          screen.debug();
        });

        //23
        it("Should have error with uncorrect username but password has wrong symbols", async () => {
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
          fireEvent.change(password, { target: { value: "12121" } });
          const username = screen.getByPlaceholderText("Логин");
          fireEvent.change(username, { target: { value: "выыыыы2444444444444444ооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооо" } });
          const loginButton = screen.getByTestId("login-button");
          fireEvent.click(loginButton);
          const error = screen.getByText(
            "Логин должен содержать только символы русского и английского алфавита"
      
      );
          expect(error).toBeInTheDocument();
          screen.debug();
        });

        //24
        it("Should have error with uncorrect username but password is correct", async () => {
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
          fireEvent.change(password, { target: { value: "test" } });
          const username = screen.getByPlaceholderText("Логин");
          fireEvent.change(username, { target: { value: "выыыыы2444444444444444ооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооо" } });
          const loginButton = screen.getByTestId("login-button");
          fireEvent.click(loginButton);
          const error = screen.getByText(
            "Логин должен содержать только символы русского и английского алфавита"
      
      );
          expect(error).toBeInTheDocument();
          screen.debug();
        });

        //25
        it("Should have error with uncorrect username but password is uncorrect", async () => {
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
          fireEvent.change(password, { target: { value: "выыыыы2444444444444444ооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооо" } });
          const username = screen.getByPlaceholderText("Логин");
          fireEvent.change(username, { target: { value: "выыыыы2444444444444444ооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооооо" } });
          const loginButton = screen.getByTestId("login-button");
          fireEvent.click(loginButton);
          const error = screen.getByText(
            "Логин должен содержать только символы русского и английского алфавита"
      
      );
          expect(error).toBeInTheDocument();
          screen.debug();
        });
});

describe("AuthPage Should axios request to render", () => {
  afterEach(() => {
    // уборка, оставшегося после предыдущего теста
    jest.clearAllMocks();
  });

  //19
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

  
describe("AuthPage username lenght", () => {
  let username, password, regButton, mainField,cities ;

   const ok = "test"

  beforeEach(() => {
    
    axios.post.mockRejectedValueOnce({
      response: {
        data: {
          message: "Ошибка при авторизации",
        },
      },
      status: 400,
    });
    const { login, logout, token, userId, isLogin } = jest.fn();
    render(
      <AuthContext.Provider value={{ login, logout, token, userId, isLogin }}>
        <AuthPage />
      </AuthContext.Provider>
    );
    username = screen.getByPlaceholderText("Логин");
    expect(username).toBeInTheDocument();
     password = screen.getByPlaceholderText("Пароль");
    expect(password).toBeInTheDocument();
     regButton = screen.getByText("ВОЙТИ");
    expect(regButton).toBeInTheDocument();
    fireEvent.change(password, { target: { value: ok } });
    
  });

    it("Should print error with empty username ", async () => {
      fireEvent.change(username, { target: { value: "" } });
      fireEvent.click(regButton);
      expect(screen.getByText("Заполнены не все поля")).toBeInTheDocument();
    });

    it("Should not print error with 1 lenght username ", async () => {
      fireEvent.change(username, { target: { value: "a" } });
      fireEvent.click(regButton);
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
      expect(screen.getByText("Ошибка при авторизации")).toBeInTheDocument();
    });

    it("Should not print error with 127 lenght username ", async () => {
      var user = "";
    while (user.length < 127) user += "A";
      fireEvent.change(username, { target: { value: user } });
      fireEvent.click(regButton);
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
      expect(screen.getByText("Ошибка при авторизации")).toBeInTheDocument();
    });

    it("Should not print error with 128 lenght username ", async () => {
      var user = "";
    while (user.length < 128) user += "A";
      fireEvent.change(username, { target: { value: user } });
      fireEvent.click(regButton);
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
      expect(screen.getByText("Ошибка при авторизации")).toBeInTheDocument();
    });

    it("Should  print error with 129 lenght username ", async () => {
      var user = "";
    while (user.length < 129) user += "A";
      fireEvent.change(username, { target: { value: user } });
      fireEvent.click(regButton);
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
      expect(screen.getByText("Логин должен содержать до 128 символов")).toBeInTheDocument();
    });
});

describe("AuthPage password lenght", () => {
  let username, password, regButton, mainField,cities ;

   const ok = "test"

  beforeEach(() => {
    axios.post.mockRejectedValueOnce({
      response: {
        data: {
          message: "Ошибка при авторизации",
        },
      },
      status: 400,
    });
    const { login, logout, token, userId, isLogin } = jest.fn();
    render(
      <AuthContext.Provider value={{ login, logout, token, userId, isLogin }}>
        <AuthPage />
      </AuthContext.Provider>
    );
     username = screen.getByPlaceholderText("Логин");
    expect(username).toBeInTheDocument();
     password = screen.getByPlaceholderText("Пароль");
    expect(password).toBeInTheDocument();
     regButton = screen.getByText("ВОЙТИ");
    expect(regButton).toBeInTheDocument();
    fireEvent.change(username, { target: { value: ok } });
    
  });


    it("Should print error with empty username ", async () => {
      fireEvent.change(password, { target: { value: "" } });
      fireEvent.click(regButton);
      expect(screen.getByText("Заполнены не все поля")).toBeInTheDocument();
    });


    it("Should not print error with 1 lenght username ", async () => {
      fireEvent.change(password, { target: { value: "a" } });
      fireEvent.click(regButton);
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
      expect(screen.getByText("Ошибка при авторизации")).toBeInTheDocument();
    });

    it("Should not print error with 127 lenght username ", async () => {
      var user = "";
    while (user.length < 127) user += "A";
      fireEvent.change(password, { target: { value: user } });
      fireEvent.click(regButton);
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
      expect(screen.getByText("Ошибка при авторизации")).toBeInTheDocument();
    });

    it("Should not print error with 128 lenght username ", async () => {
      var user = "";
    while (user.length < 128) user += "A";
      fireEvent.change(password, { target: { value: user } });
      fireEvent.click(regButton);
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
      expect(screen.getByText("Ошибка при авторизации")).toBeInTheDocument();
    });

    it("Should  print error with 129 lenght username ", async () => {
      var user = "";
    while (user.length < 129) user += "A";
      fireEvent.change(password, { target: { value: user } });
      fireEvent.click(regButton);
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
      expect(screen.getByText("Пароль должен содержать до 128 символов")).toBeInTheDocument();
    });
});



 /* it("Should not have error from server", async () => {
    
    jest.mock('login');
    const { logout, token, userId, isLogin } = jest.fn();
    const login = function (a, b) {};
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
          "token",
        user: {
          _id: "63b94e63401cafbbf0be0a8d",
          username: "тест"
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
