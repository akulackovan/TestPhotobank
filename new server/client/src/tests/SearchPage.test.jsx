import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from "@testing-library/react";
import SearchPage from "../pages/SearchPage/SearchPage";
import React from "react";
import "@testing-library/jest-dom";
import axios from "axios";
import { act } from "react-dom/test-utils";
import { Router, Link } from "react-router-dom";

jest.mock("axios");

afterEach(() => {
  jest.clearAllMocks();
});

describe("SearchPage component", () => {
  it("Should have users ", async () => {
    axios.mockResolvedValue({data: {
        user: [{ id: "63d82644b88c7334ac1ac6aa", username: "test1" },
        { id: "63c6c37e88660db445d37378", username: "testovaya" }],
      },
      status: 200,})
      render(
        <SearchPage match={{ params: { id: "test" } }} />);

    let loading = screen.getByTestId("loader");
    expect(loading).toBeInTheDocument();
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    
    let user = screen.getByText("test1");
    expect(user).toBeInTheDocument();
    let searchUser = screen.getAllByTestId("searchUser");
    expect(searchUser).toBeDefined();
    expect(searchUser).toHaveLength(2)
    expect(screen.getByText('test1').closest('a')).toHaveAttribute('href', '/profile/63d82644b88c7334ac1ac6aa')
  });

  it("Should print error when id is empty ", async () => {
    axios.mockRejectedValueOnce({response: {data: {
        message: "Запрос для поиска пустой",
      }},
      status: 400,})
      render(
        <SearchPage match={{ params: { id: "" } }} />);

    let loading = screen.getByTestId("loader");
    expect(loading).toBeInTheDocument();
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    let user = screen.getByText("Ничего не найдено");
    expect(user).toBeInTheDocument();
  });


  it("Should not have users ", async () => {
    axios.mockRejectedValueOnce({response: {data: {
        message: "Ничего не найдено",
      }},
      status: 400,})
      render(
        <SearchPage match={{ params: { id: "1234" } }} />);

    let loading = screen.getByTestId("loader");
    expect(loading).toBeInTheDocument();
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    let user = screen.getByText("Ничего не найдено");
    expect(user).toBeInTheDocument();
  });



});
