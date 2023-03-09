//https://codylillyw.medium.com/testing-mern-stack-websites-3a4d3aa9bbbd
//

import RegPage from "../src/pages/RegPage/RegPage";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import * as ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";

let container;

beforeEach(async () => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(async () => {
  document.body.removeChild(container);
  container = null;
});

//4 сценарий
test("Test reg page with busy login", async () => {
  act(() => {
    ReactDOM.createRoot(container).render(
      <MemoryRouter>
        <RegPage />
      </MemoryRouter>
    );
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
  /*const cities = screen.getAllByTestId("city-dropdownelement");
  expect(cities).toBeDefined();
  expect(cities).toHaveLength(3);
  fireEvent.change(username, { target: { value: "тест" } });
  fireEvent.change(password, { target: { value: "тест" } });
  fireEvent.click(screen.getByText("Москва"));*/
});

