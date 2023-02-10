import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react";
import CityCombobox from "../components/CityCombobox/CityCombobox";
import React from "react";
import "@testing-library/jest-dom";
import axios from "axios";



describe("CityCombobox component",  () => {
  it("Checking the filling of CityCombobox components",async () => {
    render(<CityCombobox />);
    const mainField = screen.getByText("Город");
    expect(mainField).toBeInTheDocument();
    const cityInput = screen.queryByTestId("city-input");
    expect(cityInput).toBeDefined();
    const cities = screen.queryByTestId("city-dropdownelement");
    expect(cities).toBeDefined();
  });

  /*it("Checking the filling of CityCombobox components if click on combobox", async () => {
    render(<CityCombobox />);
    const mainField = screen.getByText("Город");
    expect(mainField).toBeInTheDocument();
    fireEvent.click(mainField);
    const cityInput = screen.queryByTestId("city-input");
    expect(cityInput).toBeInTheDocument();
    const cities = screen.queryAllByTestId("city-dropdownelement");
    expect(cities).toBeDefined();
  });*/
});

/** Нужна проверка Axios
 * Количество элементов
 * Выбор элемента
 * Поиск хороший
 * Поиск плохой
 */