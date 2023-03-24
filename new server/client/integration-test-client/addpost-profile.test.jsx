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

// 3 test

describe("AddPostPage", () => {
  it("Should successfully add a post and redirect to profile page", async () => {
    axios.get.mockResolvedValue({
      data: {
        city: [
          { _id: "63b9473e70bfa1abe160400f", city: "Москва" },
          { _id: "63b94e8d70bfa1abe1604015", city: "Санкт-Петербург" },
          { _id: "63b96121b19de65ebdf4cd50", city: "Абаза" },
        ],
      },
      status: 200,
    });

    const axiosPost = jest.spyOn(axios, "post").mockResolvedValue({
      data: {
        message: "Успешно созданный пост",
      },
    });

    const { userId } = jest.fn();

    // Render component
    render(
      <AuthContext.Provider value={{ userId }}>
        <Router history={history}>{routes}</Router>
      </AuthContext.Provider>
    );

    /*await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(screen.getByTestId("city")).toBeInTheDocument();
    const mainField = screen.getByText("Город");
    expect(mainField).toBeInTheDocument();
    //Нажимаем на кнопку combobox
    fireEvent.click(mainField);
    //Есть ли объекты
    const cities = screen.getAllByTestId("city-dropdownelement");
    expect(cities).toBeDefined();
    expect(cities).toHaveLength(2);
    //Нажимаем на Москву, выбираем ее
    fireEvent.click(screen.getByText("Москва"));

    fireEvent.change(screen.getByLabelText("input"), {
      target: { value: "Test post description" },
    });

    // Mock to simulate
    const file = new File(["test image content"], "test.jpg", {
      type: "image/jpeg",
    });
    const photoInput = screen.getByLabelText("photo");
    Object.defineProperty(photoInput, "files", { value: [file] });

    fireEvent.click(screen.getByText("ЗАГРУЗИТЬ ФОТО"));

    // Post data to be sent to server
    expect(axiosPost).toHaveBeenCalledWith(
        "/post/post",
        expect.objectContaining({
          photo: expect.any(File),
          city: "Москва",
          description: "Test post description",
          userId: expect.any(String),
        }),
        expect.any(Object)
      );
  
    await waitFor(() =>
      expect(screen.getByText(/Успешно созданный пост/i)).toBeInTheDocument()
    );

    // Redirection to
    await waitFor(() => expect(window.location.pathname).toEqual("/profile"));

    
    // Restore the mock
    axiosPost.mockRestore();*/
  });
});
