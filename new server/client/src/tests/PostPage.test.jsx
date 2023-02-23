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

afterEach(() => {
  //Для очистки - если не делать, то количество выховов axios накапливается
  cleanup;
  jest.clearAllMocks();
});

const postDataMock = {
  data: {
    isPost: {
      _id: "63c8416ddd700fb050db2515",
      image: "",
      text: "Это тестовый пост",
      views: 250,
      likes: 1,
      city: {
        city: "Москва",
      },
      author: {
        _id: "63b94e63401cafbbf0be0a8d",
        username: "тест",
      },
      timestamps: "2022-12-11T21:00:00.000Z",
    },
  },
  status: 200,
}

describe("PostPage component start render", () => {
  it("Shoud print error message from add view", async () => {
    const { userId } = jest.fn();
    axios.mockRejectedValueOnce({
      response: {
        data: { message: "Ошибка при добавлении просмотра" },
        status: 400,
      },
    });
    render(
      <AuthContext.Provider value={{ userId }}>
        <PostPage match={{ params: { id: 1 } }} />
      </AuthContext.Provider>
    );
    const postPage = screen.getByTestId("postPage");
    expect(postPage).toBeInTheDocument();
    const loading = screen.getByTestId("loader");
    expect(loading).toBeInTheDocument();
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    
    await expect(axios).toHaveBeenCalledTimes(1);
    const error = screen.getByText("Ошибка при добавлении просмотра");
    expect(error).toBeInTheDocument();
  });

  it("Shoud print error message from get post by id", async () => {
    const { userId } = jest.fn();

    axios.mockResolvedValueOnce({
      data: { message: "Успешно" },
      status: 200,
    });

    render(
      <AuthContext.Provider value={{ userId }}>
        <PostPage match={{ params: { id: "63c8416ddd700fb050db2515" } }} />
      </AuthContext.Provider>
    );
    const postPage = screen.getByTestId("postPage");
    expect(postPage).toBeInTheDocument();
    let loading = screen.getByTestId("loader");
    expect(loading).toBeInTheDocument();
    axios.mockRejectedValueOnce({
      response: {
        data: { message: "Ошибка при получении поста" },
        status: 400,
      },
    });
    
    loading = screen.getByTestId("loader");
    expect(loading).toBeInTheDocument();
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    await expect(axios).toHaveBeenCalledWith({
      headers: {
        "content-type": "application/json",
      },
      method: "put",
      params: {
        id: "63c8416ddd700fb050db2515",
      },
      url: "/post/addView",
    });
    await expect(axios).toHaveBeenCalledWith({
      headers: {
        "content-type": "application/json",
      },
      method: "get",
      params:  {
             id: "63c8416ddd700fb050db2515",
             user: undefined,
           },
      url: "/post/post/id",
    });
    await expect(axios).toHaveBeenCalledTimes(2);

    const error = screen.getByText("Ошибка при получении поста");
    expect(error).toBeInTheDocument();
  });

  it("Shoud print error message from get post like", async () => {
    const { userId } = jest.fn();

    axios.mockResolvedValueOnce({
      data: { message: "Успешно" },
      status: 200,
    });

    render(
      <AuthContext.Provider value={{ userId }}>
        <PostPage match={{ params: { id: "63c8416ddd700fb050db2515" } }} />
      </AuthContext.Provider>
    );
    //1
    const postPage = screen.getByTestId("postPage");
    expect(postPage).toBeInTheDocument();
    let loading = screen.getByTestId("loader");
    expect(loading).toBeInTheDocument();
    //2
    axios.mockResolvedValueOnce(postDataMock);
    let error = screen.queryByText("Ошибка при получении поста");
    expect(error).not.toBeInTheDocument();
    loading = screen.getByTestId("loader");
    expect(loading).toBeInTheDocument();
    //3
    axios.mockRejectedValueOnce({
      response: {
        data: { message: "Ошибка при получении статуса лайка" },
        status: 400,
      },
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    
    error = screen.getByText("Ошибка при получении статуса лайка");
    expect(error).toBeInTheDocument();
    await expect(axios).toHaveBeenCalledWith({
      headers: {
        "content-type": "application/json",
      },
      method: "put",
      params: {
        id: "63c8416ddd700fb050db2515",
      },
      url: "/post/addView",
    });
    await expect(axios).toHaveBeenCalledWith({
      headers: {
        "content-type": "application/json",
      },
      method: "get",
      params:  {
             id: "63c8416ddd700fb050db2515",
             user: undefined,
           },
      url: "/post/post/id",
    });
    await expect(axios).toHaveBeenCalledWith({
      method: "get",
      url: "/post/getLike",
      headers: {
        "content-type": "application/json",
      },
      params: {
        idUser: undefined,
        idPost: "63c8416ddd700fb050db2515",
      },
    });
    await expect(axios.get).not.toHaveBeenCalledWith();

  });

  it("Shoud print error message from get post comments", async () => {
    const { userId } = jest.fn();

    axios.mockResolvedValueOnce({
      data: { message: "Успешно" },
      status: 200,
    });

    render(
      <AuthContext.Provider value={{ userId }}>
        <PostPage match={{ params: { id: "63c8416ddd700fb050db2515" } }} />
      </AuthContext.Provider>
    );
    //1
    const postPage = screen.getByTestId("postPage");
    expect(postPage).toBeInTheDocument();
    let loading = screen.getByTestId("loader");
    expect(loading).toBeInTheDocument();
    //2
    axios.mockResolvedValueOnce(postDataMock);
    axios.mockRejectedValueOnce({
      response: {
        data: { message: "Ошибка при получении поста" },
        status: 400,
      },
    });
    let error = screen.queryByText("Ошибка при получении поста");
    expect(error).not.toBeInTheDocument();
    loading = screen.getByTestId("loader");
    expect(loading).toBeInTheDocument();
    //3
    axios.mockResolvedValueOnce({
      response: {
        data: { like: true },
        status: 200,
      },
    });

    axios.mockRejectedValueOnce({
      response: {
        data: { message: "Ошибка при получении" },
        status: 400,
      },
    });
    
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    await expect(axios).toHaveBeenCalledWith({
      headers: {
        "content-type": "application/json",
      },
      method: "put",
      params: {
        id: "63c8416ddd700fb050db2515",
      },
      url: "/post/addView",
    });
    await expect(axios).toHaveBeenCalledWith({
      headers: {
        "content-type": "application/json",
      },
      method: "get",
      params:  {
             id: "63c8416ddd700fb050db2515",
             user: undefined,
           },
      url: "/post/post/id",
    });
    await expect(axios).toHaveBeenCalledWith({
      method: "get",
      url: "/post/getLike",
      headers: {
        "content-type": "application/json",
      },
      params: {
        idUser: undefined,
        idPost: "63c8416ddd700fb050db2515",
      },
    });
    await expect(axios).not.toHaveBeenCalledWith({
      method: "get",
      url: "/post/comments",
      headers: {
        "content-type": "application/json",
      },
      params: {
        idPost: "63c8416ddd700fb050db2515",
      },
    });
    error = screen.getByText("Ошибка при получении");
    expect(error).toBeInTheDocument();
  });




  /*it("Shoud print error message from get comments", async () => {
    const { userId } = jest.fn();

    axios.mockResolvedValueOnce({
      data: { message: "Успешно" },
      status: 200,
    });

    render(
      <AuthContext.Provider value={{ userId }}>
        <PostPage match={{ params: { id: "63c8416ddd700fb050db2515" } }} />
      </AuthContext.Provider>
    );
    //1
    const postPage = screen.getByTestId("postPage");
    expect(postPage).toBeInTheDocument();
    let loading = screen.getByTestId("loader");
    expect(loading).toBeInTheDocument();
    //2
    axios.mockResolvedValueOnce(postDataMock);
    axios.mockRejectedValueOnce({
      response: {
        data: { message: "Ошибка при получении поста" },
        status: 400,
      },
    });
    loading = screen.getByTestId("loader");
    expect(loading).toBeInTheDocument();
    //3
    axios.mockResolvedValueOnce({
        data: { like: true},
        status: 200,
    });
    axios.mockRejectedValueOnce({
      response: {
        data: { message: "Ошибка при получении лайка" },
        status: 400,
      },
    });

    //4
    loading = screen.getByText("Загрузка комментариев");
    expect(loading).toBeInTheDocument();
    

    axios.mockRejectedValue({
      response: {
        data: { message: "Ошибка при получении комментариев к посту" },
        status: 400,
      },
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });


    await expect(axios).toHaveBeenCalledWith({
      headers: {
        "content-type": "application/json",
      },
      method: "put",
      params: {
        id: "63c8416ddd700fb050db2515",
      },
      url: "/post/addView",
    });
    await expect(axios).toHaveBeenCalledWith({
      headers: {
        "content-type": "application/json",
      },
      method: "get",
      params:  {
             id: "63c8416ddd700fb050db2515",
             user: undefined,
           },
      url: "/post/post/id",
    });
    await expect(axios).toHaveBeenCalledWith({
      method: "get",
      url: "/post/comments",
      headers: {
        "content-type": "application/json",
      },
      params: {
        id: "63c8416ddd700fb050db2515",
      },
    });


    const error = screen.getByText("Ошибка при получении комментариев к посту");
    expect(error).toBeInTheDocument();


    
  });
   */
});
