import RegPage from "../src/pages/RegPage/RegPage";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import { useRoutes } from "../src/routes";
import { Router, Route } from "react-router-dom";
import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import createMemoryHistory from "history/createMemoryHistory";
import axios from "axios";
import { AuthContext } from "../src/context/AuthContext";

jest.mock("axios");

afterEach(() => {
    //Очищаем моки
    jest.clearAllMocks();
});


test("Checking the interface link between the registration page and the login page", async () => {
    //Мокаем данные о городах
    axios.get.mockResolvedValue({
        data: {
            city: [
                { _id: "63b9473e70bfa1abe160400f", city: "Москва" },
                { _id: "63b94e8d70bfa1abe1604015", city: "Санкт-Петербург" },
                { _id: "63b96121b19de65ebdf4cd50", city: "Абаза\r", __v: 0 },
            ],
        },
        status: 200,
    });

    //Роутер нужен для перехода по страницам, но он принимает 2 значения готов и логин,
    //Для тестов готов должен быть всегда true, логин по необходимости (false, если нужны страницы регистрации и пользователя)
    const routes = useRoutes(false, true);

    //Создаем историю переходов
    const history = createMemoryHistory();

    history.push("/reg");

    const userId = jest.fn()

    //Рендерим
    render(
        <AuthContext.Provider value={userId}>
            <Router history={history}>{routes}</Router>
        </AuthContext.Provider>
    );


    //Проверяем путь
    expect(history.location.pathname).toBe("/reg");

    //"Ждем" обработку от axios
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
    });
    //Проверяем логин на месте?
    const username = screen.getByPlaceholderText("Логин");
    expect(username).toBeInTheDocument();

    //Пароль на месте
    const password = screen.getByPlaceholderText("Пароль");
    expect(password).toBeInTheDocument();


    //Отобразился ли Cpmbobox?
    expect(screen.getByTestId("city")).toBeInTheDocument();
    const mainField = screen.getByText("Город");
    expect(mainField).toBeInTheDocument();

    //Нажимаем на кнопку обратно
    const regButton = screen.getByText("ОБРАТНО");
    expect(regButton).toBeInTheDocument();
    fireEvent.click(regButton);

    //"Ждем" обработку от axios
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
    });

    //Проверяем путь
    expect(history.location.pathname).toBe("/auth");
    //Проверяем, что страница загрузилась через общий div
    expect(screen.getByTestId("auth"))

});
