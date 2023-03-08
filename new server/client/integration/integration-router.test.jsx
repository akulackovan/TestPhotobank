import RegPage from "../src/pages/RegPage/RegPage";
import App from "../src/App";
import {useAuth} from '../src/hooks/auth.hook'
import {
  cleanup,
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import * as hooks from '../src/hooks/auth.hook';
import { Switch, Route, Redirect,  } from "react-router-dom";
import { MemoryRouter } from "react-router";
import {useRoutes} from '../src/routes'
import { BrowserRouter as Router } from "react-router-dom"


import PopularPage from "../src/pages/PopularPage/PopularPage"
import SubscribePage from "../src/pages/SubscribePage/SubscribePage"
import SettingsPage from "../src/pages/SettingsPage/SettingPage";
import ProfilePage from "../src/pages/ProfilePage/ProfilePage";


//мок страниц, тк нам неважно, что именно на них будет
//важно только, что совершен переход
jest.mock("../src/pages/PopularPage/PopularPage");
jest.mock("../src/pages/SubscribePage/SubscribePage");
jest.mock("../src/pages/SettingsPage/SettingPage");
jest.mock("../src/pages/SearchPage/SearchPage");
jest.mock("../src/pages/ProfilePage/ProfilePage");



//2 сценарий - проверка переключения кнопок NavBar - оказываемся на замоканных страницах
//Должен меняться url
test("Check redirect on NavBar", async () => {

  //Мок страниц, тк нам для теста неважно, что на них находится
  PopularPage.mockImplementation(() => <div>PopularPage</div>);
  SubscribePage.mockImplementation(() => <div>SubscribePage</div>);
  SettingsPage.mockImplementation(() => <div>SettingsPage</div>);
  ProfilePage.mockImplementation(() => <div>ProfilePage</div>);


  const routes = useRoutes(true, true)

  render(
    <MemoryRouter initialEntries={["/"]}>
            <Router>
            { routes }
            </Router>
    </MemoryRouter>)

  //Проверка на NavBar
  const nav = screen.getByTestId("nav");
  expect(nav).toBeInTheDocument();

  const popular = screen.getByText("PopularPage");
  expect(popular).toBeInTheDocument();
  expect(global.window.location.href).toContain('http://localhost/popular') 

  fireEvent.click(screen.getByText("Подписки"))
  expect(screen.getByText("SubscribePage")).toBeInTheDocument();
  expect(global.window.location.href).toContain('http://localhost/subsc') 


  await fireEvent.click(screen.getByText("Профиль"))
  expect(screen.getByText("ProfilePage")).toBeInTheDocument();
  expect(global.window.location.href).toContain('http://localhost/profile') 


  await fireEvent.click(screen.getByText("Настройки"))
  expect(screen.getByText("SettingsPage")).toBeInTheDocument();
  expect(global.window.location.href).toContain('http://localhost/settings') 

})


//4 сценарий
/*test("Test reg page with busy login", async () => {
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
  render(<RegPage />);
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
  const username = screen.getByPlaceholderText("Логин");
  expect(username).toBeInTheDocument();
  const password = screen.getByPlaceholderText("Пароль");
  expect(password).toBeInTheDocument();

  expect(screen.getByTestId("city")).toBeInTheDocument();
  const regButton = screen.getByText("ЗАРЕГИСТРИРОВАТЬСЯ");
  expect(regButton).toBeInTheDocument();

  const mainField = screen.getByText("Город");
  expect(mainField).toBeInTheDocument();
  fireEvent.click(mainField);
  const cities = screen.getAllByTestId("city-dropdownelement");
  expect(cities).toBeDefined();
  expect(cities).toHaveLength(3);
  fireEvent.change(username, { target: { value: "тест" } });
  fireEvent.change(password, { target: { value: "тест" } });
  fireEvent.click(screen.getByText("Москва"));
});*/
