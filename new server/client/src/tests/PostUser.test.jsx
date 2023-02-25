import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from "@testing-library/react";
import PostUser from "../components/PostUser/PostUser";
import React from "react";
import "@testing-library/jest-dom";
import axios from "axios";
import { act } from "react-dom/test-utils";
import {MemoryRouter} from "react-router-dom";

var cityValue;
jest.mock("axios");
const mockPostItem = {
  data: {
    city: [
      { _id: "63b9473e70bfa1abe160400f", city: "Москва" },
      { _id: "63b94e8d70bfa1abe1604015", city: "Санкт-Петербург" },
      { _id: "63b96121b19de65ebdf4cd50", city: "Абаза\r", __v: 0 },
    ],
  },
  status: 200,
};

beforeEach(() => {});

afterEach(() => {
  //Для очистки - если не делать, то количество выховов axios накапливается
  jest.clearAllMocks();
});

describe("PostUser component", () => {
  it("Should get rejected value", async () => {
    axios.mockRejectedValueOnce({
      response: {
        data: {
          message: "Ошибка при получении пользователя.",
        },
      },
      status: 400,
    });
    render(<PostUser id={123} />);

    const loading = screen.getByText("Загрузка постов...");
    expect(loading).toBeInTheDocument();

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    const error = screen.getByText("Нет постов");
    expect(error).toBeInTheDocument();
  });


  it("Should get resolved value", async () => {
    axios.mockResolvedValueOnce({
        data: {isPost: 
            [{_id: "1", image: "https://example.com/image1.jpg",},
            {_id: "2", image: "https://example.com/image2.jpg",},
            {_id: "3", image: "https://example.com/image3.jpg",},
        ],
    }
    });
    render(<MemoryRouter><PostUser id={123} /></MemoryRouter>);

    const loading = screen.getByText("Загрузка постов...");
    expect(loading).toBeInTheDocument();

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    
    expect(screen.getAllByRole("link").length).toBe(3);
  });
});
