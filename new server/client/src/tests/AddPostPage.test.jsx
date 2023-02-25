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
  import AddPostPage from "../pages/AddPostPage/AddPostPage";
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
        <AddPostPage/>
      </AuthContext.Provider>
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  
  describe("AddPostPage component", () => {
    it("Checking the filling of AddPostPage components", () => {
      const desc = screen.getByPlaceholderText("Описание");
      expect(desc).toBeInTheDocument();
      const photoInput = screen.queryByTestId("input");
      expect(photoInput).toBeDefined();
      const cityInput = screen.queryByTestId("button");
      expect(cityInput).toBeDefined();
      const mainField = screen.getByText("Город");
      expect(mainField).toBeInTheDocument();
      fireEvent.click(mainField)
      const cities = screen.getAllByTestId("city-dropdownelement");
      expect(cities).toBeDefined();
      expect(cities).toHaveLength(3);
      const saveButton = screen.getByText("ЗАГРУЗИТЬ ФОТО");
      expect(saveButton).toBeInTheDocument();
    })
  })
  
  describe("AddPostPage Error message", () => {
    let file;
  
    beforeEach(() => {
      file = new File(["(⌐□_□)"], "chucknorris.png", { type: "image/png" });
    });
    it("Checking the empty upload", () => {
      const saveButton = screen.getByText("ЗАГРУЗИТЬ ФОТО");
      fireEvent.click(saveButton)
      const msg = screen.getByText("Необходимо добавить фото");
      expect(msg).toBeInTheDocument()
    })
    it("Checking the empty upload", async () => {
      global.URL.createObjectURL = jest.fn();
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
  
      const saveButton = screen.getByText("ЗАГРУЗИТЬ ФОТО");
      fireEvent.click(saveButton)
      const msg = screen.getByText("Необходимо добавить фото");
      expect(msg).toBeInTheDocument()
    })
  })