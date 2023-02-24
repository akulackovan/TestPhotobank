import {
  cleanup,
  render,
  screen,
  fireEvent,
  waitFor, act,
} from "@testing-library/react";

import React from "react";
import "@testing-library/jest-dom";
import axios from "axios";


import {AuthContext} from "../context/AuthContext";
import SettingsPage from "../pages/SettingsPage/SettingPage";
import userEvent from "@testing-library/user-event";


jest.mock("axios");

const mockCityItem = {
  data: {
    city: [
      { _id: "63b9473e70bfa1abe160400f", city: "Москва" },
      { _id: "63b94e8d70bfa1abe1604015", city: "Санкт-Петербург" },
      { _id: "63b96121b19de65ebdf4cd50", city: "Абаза\r", __v: 0 },
    ],
  },
  status: 200,
};

beforeEach(() => {
  axios.get.mockResolvedValue(mockCityItem);

  const {login, logout, token, userId, isReady, isLogin} = jest.fn();
  render(
    <AuthContext.Provider
      value={{login, logout, token, userId, isReady, isLogin}}
    >
      <SettingsPage/>
    </AuthContext.Provider>
  );
});
afterEach(() => {
  jest.clearAllMocks();
});


describe("SettingsPage component", () => {
  it("Checking the filling of SettingsPage components", () => {
    const username = screen.getByPlaceholderText("Логин");
    expect(username).toBeInTheDocument();
    const oldPassword = screen.getByPlaceholderText("Cтарый пароль");
    expect(oldPassword).toBeInTheDocument();
    const newPassword = screen.getByPlaceholderText("Новый пароль");
    expect(newPassword).toBeInTheDocument();
    const repeatPassword = screen.getByPlaceholderText("Подтверждение нового пароля");
    expect(repeatPassword).toBeInTheDocument();
    const desc = screen.getByPlaceholderText("Описание пользователя");
    expect(desc).toBeInTheDocument();
    const mainField = screen.getByText("Город");
    expect(mainField).toBeInTheDocument();
    const cityInput = screen.queryByTestId("city-input");
    expect(cityInput).toBeDefined();
    const city = screen.getByTestId("button");
    expect(city).toBeInTheDocument();
    const saveButton = screen.getByText("СОХРАНИТЬ");
    expect(saveButton).toBeInTheDocument();
    const exitButton = screen.getByText("ВЫЙТИ ИЗ АККАУНТА");
    expect(exitButton).toBeInTheDocument();
    fireEvent.click(mainField);
    const cities = screen.getAllByTestId("city-dropdownelement");
    expect(cities).toBeDefined();
    expect(cities).toHaveLength(3);
    const ltheme = screen.getByTestId("light-button");
    expect(ltheme).toBeDefined();
    const dtheme = screen.getByTestId("dark-button");
    expect(dtheme).toBeDefined()
  })
})

describe("SettingsPage Message", () => {
  it("Checking all empty fields", async () => {
    screen.debug();
    expect(screen.queryByTestId("error")).toBeNull();
    const saveButton = screen.getByText("СОХРАНИТЬ");
    expect(saveButton).toBeInTheDocument()
    axios.post.mockRejectedValueOnce({
      response: {
        data: {
          message: "Настройки изменены",
        },
      },
      status: 201,
    });
    fireEvent.click(saveButton)

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    const msg = screen.queryByText("Настройки изменены");

    expect(msg).toBeInTheDocument()
    screen.debug();
  })

  it("Checking changing login", async () => {
    screen.debug();
    expect(screen.queryByTestId("error")).toBeNull();
    const username = screen.getByPlaceholderText("Логин");
    fireEvent.change(username, {target: {value: "qwe"}});
    const saveButton = screen.getByText("СОХРАНИТЬ");
    expect(saveButton).toBeInTheDocument()
    axios.post.mockRejectedValueOnce({
      response: {
        data: {
          message: "Настройки изменены",
        },
      },
      status: 201,
    });
    fireEvent.click(saveButton)

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    const msg = screen.queryByText("Настройки изменены");

    expect(msg).toBeInTheDocument()
    screen.debug();
  })

  it("Checking changing to light theme", async () => {
    screen.debug();
    expect(screen.queryByTestId("error")).toBeNull();
    const ltheme = screen.getByTestId("light-button");
    fireEvent.click(ltheme)
    const saveButton = screen.getByText("СОХРАНИТЬ");
    expect(saveButton).toBeInTheDocument()
    axios.post.mockRejectedValueOnce({
      response: {
        data: {
          message: "Настройки изменены",
        },
      },
      status: 201,
    });
    fireEvent.click(saveButton)

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    const msg = screen.queryByText("Настройки изменены");

    expect(msg).toBeInTheDocument()
    screen.debug();
  })

  it("Checking changing to dark theme", async () => {
    screen.debug();
    expect(screen.queryByTestId("error")).toBeNull();
    const rtheme = screen.getByTestId("dark-button");
    fireEvent.click(rtheme)
    const saveButton = screen.getByText("СОХРАНИТЬ");
    expect(saveButton).toBeInTheDocument()
    axios.post.mockRejectedValueOnce({
      response: {
        data: {
          message: "Настройки изменены",
        },
      },
      status: 201,
    });
    fireEvent.click(saveButton)

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    const msg = screen.queryByText("Настройки изменены");

    expect(msg).toBeInTheDocument()
    screen.debug();
  })

  it("Checking description more than 512 symbols", async () => {
    const validDescription = "fff"

    screen.debug();
    expect(screen.queryByTestId("error")).toBeNull();
    const oldPassword = screen.getByPlaceholderText("Описание пользователя");
    expect(oldPassword).toBeInTheDocument();
    fireEvent.change(oldPassword, {target: {value: validDescription}});
    const saveButton = screen.getByText("СОХРАНИТЬ");
    expect(saveButton).toBeInTheDocument()
    axios.post.mockRejectedValueOnce({
      response: {
        data: {
          message: "Настройки изменены",
        },
      },
      status: 201,
    });
    fireEvent.click(saveButton)

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    const msg = screen.queryByText("Настройки изменены");

    expect(msg).toBeInTheDocument()
    screen.debug();
  })

  it("Checking the empty upload", async () => {
    global.URL.createObjectURL = jest.fn();
    const file = new File(["(⌐□_□)"], "chucknorris.png", { type: "image/png" })
    const photoInput = screen.queryByTestId("input");
    await act(async () => {
      await waitFor(() => {
        userEvent.upload(photoInput, file);
      });
    });
    let image = screen.queryByTestId("input");
    // check if the file is there
    expect(image.files[0].name).toBe("chucknorris.png");
    expect(image.files.length).toBe(1);

    const saveButton = screen.getByText("СОХРАНИТЬ");
    axios.post.mockRejectedValueOnce({
      response: {
        data: {
          message: "Настройки изменены",
        },
      },
      status: 201,
    });
    fireEvent.click(saveButton)

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    const msg = screen.queryByText("Настройки изменены");

    expect(msg).toBeInTheDocument()
  })
})

describe("SettingsPage Error Message", () => {
  it("Checking login with nums", async () => {
    screen.debug();
    expect(screen.queryByTestId("error")).toBeNull();
    const username = screen.getByPlaceholderText("Логин");
    expect(username).toBeInTheDocument();
    fireEvent.change(username, {target: {value: "12"}});
    const saveButton = screen.getByText("СОХРАНИТЬ");
    expect(saveButton).toBeInTheDocument()
    fireEvent.click(saveButton)
    const msg = screen.queryByText("Имя пользователя должно содержать только символы русского и английского алфавита");

    expect(msg).toBeInTheDocument()
    screen.debug();
  })

  it("Checking login more than 128 symbols", async () => {
    const moreThe128 = "fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"

    screen.debug();
    expect(screen.queryByTestId("error")).toBeNull();
    const username = screen.getByPlaceholderText("Логин");
    expect(username).toBeInTheDocument();
    fireEvent.change(username, {target: {value: moreThe128}});
    const saveButton = screen.getByText("СОХРАНИТЬ");
    expect(saveButton).toBeInTheDocument()
    fireEvent.click(saveButton)
    const msg = screen.queryByText("Имя пользователя должно быть меньше 128 символов");

    expect(msg).toBeInTheDocument()
    screen.debug();
  })

  it("Checking without old password", async () => {
    screen.debug();
    expect(screen.queryByTestId("error")).toBeNull();
    const newPassword = screen.getByPlaceholderText("Новый пароль");
    expect(newPassword).toBeInTheDocument();
    fireEvent.change(newPassword, {target: {value: "qwerty"}});
    const saveButton = screen.getByText("СОХРАНИТЬ");
    expect(saveButton).toBeInTheDocument()
    fireEvent.click(saveButton)
    const msg = screen.queryByText("Не введен старый пароль");

    expect(msg).toBeInTheDocument()
    screen.debug();
  })

  it("Checking without new password", async () => {
    screen.debug();
    expect(screen.queryByTestId("error")).toBeNull();
    const oldPassword = screen.getByPlaceholderText("Cтарый пароль");
    expect(oldPassword).toBeInTheDocument();
    fireEvent.change(oldPassword, {target: {value: "qwerty"}});
    const saveButton = screen.getByText("СОХРАНИТЬ");
    expect(saveButton).toBeInTheDocument()
    fireEvent.click(saveButton)
    const msg = screen.queryByText("Не введен новый пароль");

    expect(msg).toBeInTheDocument()
    screen.debug();
  })

  it("Checking without repeat password", async () => {
    screen.debug();
    expect(screen.queryByTestId("error")).toBeNull();
    const oldPassword = screen.getByPlaceholderText("Cтарый пароль");
    expect(oldPassword).toBeInTheDocument();
    fireEvent.change(oldPassword, {target: {value: "qwerty"}});
    const newPassword = screen.getByPlaceholderText("Новый пароль");
    expect(newPassword).toBeInTheDocument();
    fireEvent.change(newPassword, {target: {value: "qwerty"}});
    const saveButton = screen.getByText("СОХРАНИТЬ");
    expect(saveButton).toBeInTheDocument()
    fireEvent.click(saveButton)
    const msg = screen.queryByText("Подтверждение пароля не введено");

    expect(msg).toBeInTheDocument()
    screen.debug();
  })

  it("Checking password with nums", async () => {
    screen.debug();
    expect(screen.queryByTestId("error")).toBeNull();
    const oldPassword = screen.getByPlaceholderText("Cтарый пароль");
    expect(oldPassword).toBeInTheDocument();
    fireEvent.change(oldPassword, {target: {value: "qwerty"}});
    const newPassword = screen.getByPlaceholderText("Новый пароль");
    expect(newPassword).toBeInTheDocument();
    fireEvent.change(newPassword, {target: {value: "123"}});
    const repeatPassword = screen.getByPlaceholderText("Подтверждение нового пароля");
    expect(repeatPassword).toBeInTheDocument();
    fireEvent.change(repeatPassword, {target: {value: "123"}});
    const saveButton = screen.getByText("СОХРАНИТЬ");
    expect(saveButton).toBeInTheDocument()
    fireEvent.click(saveButton)
    const msg = screen.queryByText("Пароль должен содержать только символы русского и английского алфавита");

    expect(msg).toBeInTheDocument()
    screen.debug();
  })

  it("Checking password more than 128 symbols", async () => {
    const moreThe128 = "fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
    screen.debug();
    expect(screen.queryByTestId("error")).toBeNull();
    const oldPassword = screen.getByPlaceholderText("Cтарый пароль");
    expect(oldPassword).toBeInTheDocument();
    fireEvent.change(oldPassword, {target: {value: "qwerty"}});
    const newPassword = screen.getByPlaceholderText("Новый пароль");
    expect(newPassword).toBeInTheDocument();
    fireEvent.change(newPassword, {target: {value: moreThe128}});
    const repeatPassword = screen.getByPlaceholderText("Подтверждение нового пароля");
    expect(repeatPassword).toBeInTheDocument();
    fireEvent.change(repeatPassword, {target: {value: moreThe128}});
    const saveButton = screen.getByText("СОХРАНИТЬ");
    expect(saveButton).toBeInTheDocument()
    fireEvent.click(saveButton)
    const msg = screen.queryByText("Пароль должен быть меньше 128 символов");

    expect(msg).toBeInTheDocument()
    screen.debug();
  })

  it("Checking unmatching passwords", async () => {
    screen.debug();
    expect(screen.queryByTestId("error")).toBeNull();
    const oldPassword = screen.getByPlaceholderText("Cтарый пароль");
    expect(oldPassword).toBeInTheDocument();
    fireEvent.change(oldPassword, {target: {value: "qwerty"}});
    const newPassword = screen.getByPlaceholderText("Новый пароль");
    expect(newPassword).toBeInTheDocument();
    fireEvent.change(newPassword, {target: {value: "qwerty"}});
    const repeatPassword = screen.getByPlaceholderText("Подтверждение нового пароля");
    expect(repeatPassword).toBeInTheDocument();
    fireEvent.change(repeatPassword, {target: {value: "qwerty1"}});
    const saveButton = screen.getByText("СОХРАНИТЬ");
    expect(saveButton).toBeInTheDocument()
    fireEvent.click(saveButton)
    const msg = screen.queryByText("Пароли не совпадают");

    expect(msg).toBeInTheDocument()
    screen.debug();
  })

  it("Checking description more than 512 symbols", async () => {
    const moreThe512 = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"

    screen.debug();
    expect(screen.queryByTestId("error")).toBeNull();
    const oldPassword = screen.getByPlaceholderText("Описание пользователя");
    expect(oldPassword).toBeInTheDocument();
    fireEvent.change(oldPassword, {target: {value: moreThe512}});
    const saveButton = screen.getByText("СОХРАНИТЬ");
    expect(saveButton).toBeInTheDocument()
    fireEvent.click(saveButton)
    const msg = screen.queryByText("Описание должно быть меньше 512 символов");

    expect(msg).toBeInTheDocument()
    screen.debug();
  })
})