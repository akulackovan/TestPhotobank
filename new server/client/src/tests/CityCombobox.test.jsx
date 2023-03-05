import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor
} from "@testing-library/react";
import CityCombobox from "../components/CityCombobox/CityCombobox";
import React from "react";
import "@testing-library/jest-dom";
import axios from "axios";
import { act } from 'react-dom/test-utils';

var cityValue;
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

  render(<CityCombobox onChange={(value) => {cityValue=value}}/>);
});

afterEach(() => {
  //Для очистки - если не делать, то количество выховов axios накапливается
  jest.clearAllMocks();
});

describe("CityCombobox component", () => {

  it("Should have components", async () => {
    const mainField = screen.getByText("Город");
    expect(mainField).toBeInTheDocument();
    fireEvent.click(mainField);
    const cityInput = screen.queryByTestId("city-input");
    expect(cityInput).toBeInTheDocument();
    fireEvent.change(cityInput, { target: { value: "" } });
    await expect(axios.get).toHaveBeenCalledWith("/city/getallcity");
    await expect(axios.get).toHaveBeenCalledTimes(1);
    //Это для того, чтобы сначала был axios, а потом города
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    const cities = screen.getAllByTestId("city-dropdownelement");
    expect(cities).toBeDefined();
    //На заглушке 3 города
    expect(cities).toHaveLength(3);
  });
});


describe("CityCombobox component: search sity", () => {

  it("Should filter city with lowercase", async () => {
    const mainField = screen.getByText("Город");
    expect(mainField).toBeInTheDocument();
    fireEvent.click(mainField);
    const cityInput = screen.queryByTestId("city-input");
    expect(cityInput).toBeInTheDocument();
    fireEvent.change(cityInput, { target: { value: "" } });
    await expect(axios.get).toHaveBeenCalledWith("/city/getallcity");
    await expect(axios.get).toHaveBeenCalledTimes(1);
    //Это для того, чтобы сначала был axios, а потом города
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    const cities = screen.getAllByTestId("city-dropdownelement");
    expect(cities).toBeDefined();
    //На заглушке 3 города
    expect(cities).toHaveLength(3);

    
    expect(screen.getByText("Москва")).toBeDefined();
    fireEvent.change(cityInput, { target: { value: "москва" } });
    const findCities = screen.getAllByTestId("city-dropdownelement");
    expect(findCities).toBeDefined();
    expect(findCities).toHaveLength(1);
    expect(screen.getByText("Москва")).toBeDefined();
  });

  it("Should filter city with uppercase", async () => {
    const mainField = screen.getByText("Город");
    expect(mainField).toBeInTheDocument();
    fireEvent.click(mainField);
    const cityInput = screen.queryByTestId("city-input");
    expect(cityInput).toBeInTheDocument();
    fireEvent.change(cityInput, { target: { value: "" } });
    await expect(axios.get).toHaveBeenCalledWith("/city/getallcity");
    await expect(axios.get).toHaveBeenCalledTimes(1);
    //Это для того, чтобы сначала был axios, а потом города
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    const cities = screen.getAllByTestId("city-dropdownelement");
    expect(cities).toBeDefined();
    //На заглушке 3 города
    expect(cities).toHaveLength(3);

    
    expect(screen.getByText("Москва")).toBeDefined();
    fireEvent.change(cityInput, { target: { value: "МОСКВА" } });
    const findCities = screen.getAllByTestId("city-dropdownelement");
    expect(findCities).toBeDefined();
    expect(findCities).toHaveLength(1);
    expect(screen.getByText("Москва")).toBeDefined();
  });

  it("Should filter city with uppercase and lowercase", async () => {
    const mainField = screen.getByText("Город");
    expect(mainField).toBeInTheDocument();
    fireEvent.click(mainField);
    const cityInput = screen.queryByTestId("city-input");
    expect(cityInput).toBeInTheDocument();
    fireEvent.change(cityInput, { target: { value: "" } });
    await expect(axios.get).toHaveBeenCalledWith("/city/getallcity");
    await expect(axios.get).toHaveBeenCalledTimes(1);
    //Это для того, чтобы сначала был axios, а потом города
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    const cities = screen.getAllByTestId("city-dropdownelement");
    expect(cities).toBeDefined();
    //На заглушке 3 города
    expect(cities).toHaveLength(3);

    
    expect(screen.getByText("Москва")).toBeDefined();
    fireEvent.change(cityInput, { target: { value: "МОсКВа" } });
    const findCities = screen.getAllByTestId("city-dropdownelement");
    expect(findCities).toBeDefined();
    expect(findCities).toHaveLength(1);
    expect(screen.getByText("Москва")).toBeDefined();
  });


  it("Should filter city with first symbol", async () => {
    const mainField = screen.getByText("Город");
    expect(mainField).toBeInTheDocument();
    fireEvent.click(mainField);
    const cityInput = screen.queryByTestId("city-input");
    expect(cityInput).toBeInTheDocument();
    fireEvent.change(cityInput, { target: { value: "" } });
    await expect(axios.get).toHaveBeenCalledWith("/city/getallcity");
    await expect(axios.get).toHaveBeenCalledTimes(1);
    //Это для того, чтобы сначала был axios, а потом города
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    const cities = screen.getAllByTestId("city-dropdownelement");
    expect(cities).toBeDefined();
    //На заглушке 3 города
    expect(cities).toHaveLength(3);

    
    expect(screen.getByText("Москва")).toBeDefined();
    fireEvent.change(cityInput, { target: { value: "М" } });
    const findCities = screen.getAllByTestId("city-dropdownelement");
    expect(findCities).toBeDefined();
    expect(findCities).toHaveLength(1);
    expect(screen.getByText("Москва")).toBeDefined();
  });


  it("Should not find city", async () => {
    const mainField = screen.getByText("Город");
    expect(mainField).toBeInTheDocument();
    fireEvent.click(mainField);
    const cityInput = screen.queryByTestId("city-input");
    expect(cityInput).toBeInTheDocument();
    fireEvent.change(cityInput, { target: { value: "" } });
    await expect(axios.get).toHaveBeenCalledWith("/city/getallcity");
    await expect(axios.get).toHaveBeenCalledTimes(1);
    //Это для того, чтобы сначала был axios, а потом города
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    const cities = screen.getAllByTestId("city-dropdownelement");
    expect(cities).toBeDefined();
    //На заглушке 3 города
    expect(cities).toHaveLength(3);

    
    expect(screen.getByText("Москва")).toBeDefined();
    fireEvent.change(cityInput, { target: { value: "Ghds" } });
    const findCities = screen.queryAllByTestId("city-dropdownelement");
    expect(findCities).toHaveLength(0);
  });

});


describe("CityCombobox component: search sity", () => {

  it("Should choose city", async () => {
    const mainField = screen.getByText("Город");
    expect(mainField).toBeInTheDocument();
    fireEvent.click(mainField);
    const cityInput = screen.queryByTestId("city-input");
    expect(cityInput).toBeInTheDocument();
    fireEvent.change(cityInput, { target: { value: "" } });
    await expect(axios.get).toHaveBeenCalledWith("/city/getallcity");
    await expect(axios.get).toHaveBeenCalledTimes(1);
    //Это для того, чтобы сначала был axios, а потом города
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    const cities = screen.getAllByTestId("city-dropdownelement");
    expect(cities).toBeDefined();
    //На заглушке 3 города
    expect(cities).toHaveLength(3);

    
    expect(screen.getByText("Москва")).toBeDefined();
    fireEvent.change(cityInput, { target: { value: "москва" } });
    const findCities = screen.getAllByTestId("city-dropdownelement");
    expect(findCities).toBeDefined();
    expect(findCities).toHaveLength(1);
    const city = screen.getByText("Москва");

    fireEvent.click(city);
    let allCity = screen.getAllByText("Москва");
    expect(allCity).toHaveLength(1);
    fireEvent.click(mainField);
    
    allCity = screen.getAllByText("Москва");
    expect(allCity).toHaveLength(2);

    expect(cityValue).toBe("63b9473e70bfa1abe160400f")
  });


});

