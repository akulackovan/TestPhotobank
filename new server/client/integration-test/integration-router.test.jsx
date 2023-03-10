import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
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
test("2: Check redirect on NavBar", async () => {

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
