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

jest.mock("axios");

const idPost = "63ecbdbf6267e058bd9f7725";

const data = {
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
  it("Should get error with unknown post id", async () => {
    axios.mockRejectedValueOnce({ response: 
    { data: { message: "Поста не существует" }, status: 400 } });

    //Используем Mock-функцию
    const { userId } = jest.fn();
    //Игнорируем детали реализации
    render(
      <AuthContext.Provider value={{ userId }}>
        <PostPageComponet id={55555} />
      </AuthContext.Provider>
    );

    const loading = screen.getByTestId("loader");
    expect(loading).toBeInTheDocument();
    await expect(axios).toHaveBeenCalledTimes(1);
    await expect(axios).toHaveBeenCalledWith({
      headers: {
        "content-type": "application/json",
      },
      method: "put",
      params: {
        id: 55555,
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

    axios.mockResolvedValueOnce({data: {message: "Успешно"}, status: 200})
    axios.mockRejectedValueOnce({ response: 
      { data: { message: "Поста не существует" }, status: 400 } });

    render(
      <AuthContext.Provider value={{ userId }}>
        <PostPageComponet id={idPost} />
      </AuthContext.Provider>
    );

    const loading = screen.getByTestId("loader");
    expect(loading).toBeInTheDocument();
    await expect(axios).toHaveBeenCalledTimes(1);
    await expect(axios).toHaveBeenCalledWith({
      headers: {
        "content-type": "application/json",
      },
      method: "put",
      params: {
        id: idPost,
      },
      url: "/post/addView",
    });


    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });


    let f = axios.mockResolvedValueOnce(data)
    
    await expect(axios).toHaveBeenCalledTimes(2);
    await expect(axios).toHaveBeenCalledWith({
      headers: {
        "content-type": "application/json",
      },
      method: "get",
      params: {
        id: idPost,
      },
      url: "/post/post/id",
    });

    let p = async () => await f();
    let results = await Promise.allSettled([p()]);


    f = axios.mockResolvedValueOnce({status: 200})
    
    await expect(axios).toHaveBeenCalledTimes(3);

    /*await expect(axios).toHaveBeenCalledWith({
      headers: {
        "content-type": "application/json",
      },
      method: "get",
      params: {
        id: idPost,
      },
      url: "/post/post/d",
    });
    p = async () => await f();
    await Promise.allSettled([p()]);


    const username = screen.getByText("ЯлюблюКотов");
    expect(username).toBeInTheDocument();*/
  });
});
