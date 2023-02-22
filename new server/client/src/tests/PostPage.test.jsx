import React, { Component } from "react";
import PostPageComponet from "../components/PostPage/PostPageComponent";
import PostPage from "../pages/PostPage/PostPage";
import "@testing-library/jest-dom";
import {
  cleanup,
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { act } from "react-dom/test-utils";

import MockAdapter  from "axios-mock-adapter";


jest.mock("axios");



const mockIdPost = "63ecbdbf6267e058bd9f7725";


const mockdata = {
  data: {
    isPost: {
      autor: {
        city: "63b9473e70bfa1abe160400f",
        createdAt: "2023-02-15T11:09:04.306Z",
        image: "",
        likes: [],
        username: "ЯлюблюКотов",

        _id: "63ecbd506267e058bd9f7705",
      },
      city: { _id: "63b9473e70bfa1abe160400f", city: "Москва" },
      comments: [],
      image: "",
      likes: 0,
      text: "",
      timestamps: "2023-02-15T11:10:55.860Z",
      views: 109,
    },
  },
  status: 200,
};

afterEach(() => {
  //Для очистки - если не делать, то количество выховов axios накапливается
  jest.clearAllMocks();
});

describe("PostPage component", () => {

  
  it("PostPage render", () => {
    
  const { userId } = jest.fn();
  jest.spyOn(axios, 'default').mockRejectedValue()
  axios.mockRejectedValueOnce({ response: 
    { data: { message: "Поста не существует" }, status: 400 } });
    render(
      <AuthContext.Provider value={{ userId }}>
        <PostPage match={{params: {id: 1}}}/>
        </AuthContext.Provider>)
  const postPage = screen.getByTestId("postPage")
  expect(postPage).toBeInTheDocument()
  })
})

describe("PostPage component", () => {
  it("Should get error with unknown post id", async () => {
    axios.mockRejectedValueOnce({ response: 
    { data: { message: "Поста не существует" }, status: 400 } })

    //Используем Mock-функцию
    const { userId } = jest.fn();
    //Игнорируем детали реализации
    render(
      <AuthContext.Provider value={{ userId }}>
        <PostPage match={{params: {id: 1}}}/>
      </AuthContext.Provider>)

    const loading = screen.getByTestId("loader");
    expect(loading).toBeInTheDocument();
    await expect(axios).toHaveBeenCalledTimes(1);
    await expect(axios).toHaveBeenCalledWith({
      headers: {
        "content-type": "application/json",
      },
      method: "put",
      params: {
        id: 1,
      },
      url: "/post/addView",
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const error = screen.getByText("Поста не существует");
    expect(error).toBeInTheDocument();
  });

  it("Should render post", async () => {
    //Используем Mock-функцию
    const { userId } = jest.fn();
    
    axios.mockResolvedValueOnce({status: 200})
    axios.mockRejectedValueOnce({status: 400,
    response: {
      data: {
        message: "Ошибка при добавлении просмотра"
      }
    }})

    render(
      <AuthContext.Provider value={{ userId }}>
        <PostPageComponet id={mockIdPost} />
      </AuthContext.Provider>
    );

  

    let loading = screen.getByTestId("loader");
    expect(loading).toBeInTheDocument();
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    axios.mockResolvedValueOnce(mockdata)
    axios.mockRejectedValueOnce({status: 400,
    response: {
      data: {
        message: "Поста не существует"
      }
    }})


    await expect(axios).toHaveBeenCalledTimes(2);

    loading = screen.getByTestId("loader");
    expect(loading).toBeInTheDocument();

    await new Promise(process.nextTick);


    axios.mockResolvedValueOnce({status: 200,
      response: {
        data: {
          message: "Лайк получен"
        }
      }})
    axios.mockRejectedValueOnce({status: 400,
    response: {
      data: {
        message: "Ошибка при получении статуса лайка"
      }
    }})


    await expect(axios).toHaveBeenCalledTimes(2);
    loading = screen.getByTestId("loader");
    expect(loading).toBeInTheDocument();

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    
  });
});
