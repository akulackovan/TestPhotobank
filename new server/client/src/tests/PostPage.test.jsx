import React from "react";
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
      text: "",
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
};

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
      params: {
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
      params: {
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
    await expect(axios).toHaveBeenCalledTimes(3);
  });

  it("Shoud print error message from get post comment", async () => {
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
    axios.mockResolvedValueOnce({
      data: { like: false, message: "Успешно" },
      status: 200,
    });
    loading = screen.getByTestId("loader");
    expect(loading).toBeInTheDocument();

    //4
    axios.mockRejectedValueOnce({
      response: {
        data: { message: "Ошибка при получении комментариев" },
        status: 400,
      },
    });
    loading = screen.getByTestId("loader");
    expect(loading).toBeInTheDocument();
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    loading = screen.getByText("Ошибка при получении комментариев");
    expect(loading).toBeInTheDocument();

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
      params: {
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
    await expect(axios).toHaveBeenCalledTimes(4);
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
      params: {
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
    await expect(axios).toHaveBeenCalledTimes(3);
  });

  it("Shoud get all for post", async () => {
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
    axios.mockResolvedValueOnce({
      data: {
        isPost: {
          _id: "63c8416ddd700fb050db2515",
          image: "",
          text: "Test",
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
    });
    let error = screen.queryByText("Ошибка при получении поста");
    expect(error).not.toBeInTheDocument();
    loading = screen.getByTestId("loader");
    expect(loading).toBeInTheDocument();
    //3
    axios.mockResolvedValueOnce({
      data: { like: false, message: "Успешно" },
      status: 200,
    });
    loading = screen.getByTestId("loader");
    expect(loading).toBeInTheDocument();

    //4
    axios.mockResolvedValueOnce({
      data: { total: [] },
      status: 200,
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
      params: {
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
    expect(screen.getByTestId("author")).toBeInTheDocument()
    expect(screen.getByTestId("date")).toBeInTheDocument()
    expect(screen.getByTestId("city")).toBeInTheDocument()
    expect(screen.getByTestId("img")).toBeInTheDocument()
    expect(screen.getByTestId("comments")).toBeInTheDocument()
    expect(screen.getByTestId("commentButton")).toBeInTheDocument()
    expect(screen.getByTestId("commentInput")).toBeInTheDocument()
    expect(screen.getByTestId("likeButton")).toBeInTheDocument()
    expect(screen.getByTestId("numComments")).toBeInTheDocument()
    expect(screen.getByTestId("text")).toBeInTheDocument()
    expect(screen.getByTestId("numlike")).toBeInTheDocument()
    expect(screen.getByTestId("view")).toBeInTheDocument()
    await expect(axios).toHaveBeenCalledTimes(4);
  });
});

describe("PostPage comments render", () => {
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
    axios.mockResolvedValueOnce({
      data: { like: false, message: "Успешно" },
      status: 200,
    });
    loading = screen.getByTestId("loader");
    expect(loading).toBeInTheDocument();

    //4
    axios.mockResolvedValueOnce({
      data: { total: [] },
      status: 200,
    });
    loading = screen.getByTestId("loader");
    expect(loading).toBeInTheDocument();
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(screen.queryByTestId("comment")).not.toBeInTheDocument();
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
    axios.mockResolvedValueOnce({
      data: { like: false, message: "Успешно" },
      status: 200,
    });
    loading = screen.getByTestId("loader");
    expect(loading).toBeInTheDocument();

    //4
    axios.mockResolvedValueOnce({
      data: {
        total: [
          {
            user: "тест",
            comment: "123",
          },
          {
            user: "тест",
            comment: "222",
          },
        ],
      },
      status: 200,
    });
    loading = screen.getByTestId("loader");
    expect(loading).toBeInTheDocument();
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    const comments = screen.getAllByTestId("comment");
    expect(comments).toBeDefined();
    expect(comments).toHaveLength(2);
    await expect(axios).toHaveBeenCalledTimes(4);
  });
});

describe("PostPage comments write", () => {

  beforeEach(async () => {
    const { userId } = jest.fn();
    screen.debug();

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
    axios.mockResolvedValueOnce({
      data: { like: false, message: "Успешно" },
      status: 200,
    });
    loading = screen.getByTestId("loader");
    expect(loading).toBeInTheDocument();

    //4
    axios.mockResolvedValueOnce({
      data: {
        total: [
          {
            user: "тест",
            comment: "123",
          },
          {
            user: "тест",
            comment: "222",
          },
        ],
      },
      status: 200,
    });
    loading = screen.getByTestId("loader");
    expect(loading).toBeInTheDocument();
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  });

  it("Shoud print error message with 129 length comments", async () => {
    var comment = "";
    while (comment.length < 129) comment += "A";
    expect(comment).toHaveLength(129);
    const commentInput = screen.getByTestId("commentInput");
    fireEvent.change(commentInput, { target: { value: comment } });
    fireEvent.click(screen.getByText("ОПУБЛИКОВАТЬ"));
    expect(screen.getByText("Комментарий должен содержать не более 128 символов"));
    screen.debug();
  });

  it("Shoud print error message with 0 length comments", async () => {
    var comment = "";
    expect(comment).toHaveLength(0);
    const commentInput = screen.getByTestId("commentInput");
    fireEvent.change(commentInput, { target: { value: comment } });
    fireEvent.click(screen.getByText("ОПУБЛИКОВАТЬ"));
    expect(screen.getByText("Комментарий не должен быть пустым"));
    screen.debug();
  });

  it("Shoud add with 1 length comments", async () => {
    var comment = "1";
    expect(comment).toHaveLength(1);
    const commentInput = screen.getByTestId("commentInput");
    fireEvent.change(commentInput, { target: { value: comment } });
    axios.mockResolvedValueOnce({
      data: { newComment: { user: "test", comment: comment } },
      status: 200,
    });
    fireEvent.click(screen.getByText("ОПУБЛИКОВАТЬ"));
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(screen.getByText("test"));

    screen.debug();
  });

  

  it("Shoud add comment with 127 length comments", async () => {
    var comment = "";
    while (comment.length < 127) comment += "A";
    expect(comment).toHaveLength(127);
    let comments = screen.getAllByTestId("comment");
    const length = comments.length;
    expect(comments).toHaveLength(2);
    const commentInput = screen.getByTestId("commentInput");
    fireEvent.change(commentInput, { target: { value: comment } });
    axios.mockResolvedValueOnce({
      data: { newComment: { user: "test", comment: comment } },
      status: 200,
    });
    fireEvent.click(screen.getByText("ОПУБЛИКОВАТЬ"));
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(screen.getByText("test"));
    comments = screen.getAllByTestId("comment");
    expect(comments).toHaveLength(length + 1);
    screen.debug();
  });

  it("Shoud add comment with 128 length comments", async () => {
    var comment = "";
    while (comment.length < 128) comment += "A";
    expect(comment).toHaveLength(128);
    let comments = screen.getAllByTestId("comment");
    const length = comments.length;
    expect(comments).toHaveLength(2);
    const commentInput = screen.getByTestId("commentInput");
    fireEvent.change(commentInput, { target: { value: comment } });
    axios.mockResolvedValueOnce({
      data: { newComment: { user: "test", comment: comment } },
      status: 200,
    });
    fireEvent.click(screen.getByText("ОПУБЛИКОВАТЬ"));
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(screen.getByText("test"));
    comments = screen.getAllByTestId("comment");
    expect(comments).toHaveLength(length + 1);
    screen.debug();
  });

  it("Shoud print error from axios comments", async () => {
    var comment = "123";
    const commentInput = screen.getByTestId("commentInput");
    fireEvent.change(commentInput, { target: { value: comment } });
    axios.mockRejectedValueOnce({
      response: { data: { message: "Ошибка при добавлении комментария" } },
    });
    fireEvent.click(screen.getByText("ОПУБЛИКОВАТЬ"));
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(screen.getByText("Ошибка при добавлении комментария"));
    screen.debug();
  });
});


describe("PostPage comments write", () => {

  it("Shoud print error message with 0 comments", async () => {
    const { userId } = jest.fn();
    screen.debug();

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
    axios.mockResolvedValueOnce({
      data: { like: false, message: "Успешно" },
      status: 200,
    });
    loading = screen.getByTestId("loader");
    expect(loading).toBeInTheDocument();

    //4
    axios.mockResolvedValueOnce({
      data: {
        total: [],
      },
      status: 200,
    });
    loading = screen.getByTestId("loader");
    expect(loading).toBeInTheDocument();
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    var comment = "1";
    expect(comment).toHaveLength(1);
    let comments = screen.queryAllByTestId("comment");
    const length = comments.length;
    expect(comments).toHaveLength(0);
    const commentInput = screen.getByTestId("commentInput");
    fireEvent.change(commentInput, { target: { value: comment } });
    axios.mockResolvedValueOnce({
      data: { newComment: { user: "test", comment: comment } },
      status: 200,
    });
    fireEvent.click(screen.getByText("ОПУБЛИКОВАТЬ"));
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(screen.getByText("test"));
    comments = screen.getAllByTestId("comment");
    expect(comments).toHaveLength(length + 1);
    screen.debug();
  });
})

describe("PostPage like", () => {
  beforeEach(async () => {});

  it("Shoud print error message from change like", async () => {
    const { userId } = jest.fn();
    screen.debug();

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
    axios.mockResolvedValueOnce({
      data: { like: false, message: "Успешно" },
      status: 200,
    });
    loading = screen.getByTestId("loader");
    expect(loading).toBeInTheDocument();

    //4
    axios.mockResolvedValueOnce({
      data: {
        total: [
          {
            user: "тест",
            comment: "123",
          },
          {
            user: "тест",
            comment: "222",
          },
        ],
      },
      status: 200,
    });
    loading = screen.getByTestId("loader");
    expect(loading).toBeInTheDocument();
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    axios.mockRejectedValueOnce({
      response: { data: { message: "Ошибка при получении статуса лайка" } },
    });
    fireEvent.click(screen.getByTestId("like"));
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(
      screen.getByText("Ошибка при получении статуса лайка")
    ).toBeInTheDocument();
    screen.debug();
    expect(axios).toHaveBeenCalledTimes(5);
  });

  it("Shoud add like from change like, start without like", async () => {
    const { userId } = jest.fn();
    screen.debug();

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
    axios.mockResolvedValueOnce({
      data: { like: false, message: "Успешно" },
      status: 200,
    });
    loading = screen.getByTestId("loader");
    expect(loading).toBeInTheDocument();

    //4
    axios.mockResolvedValueOnce({
      data: {
        total: [
          {
            user: "тест",
            comment: "123",
          },
          {
            user: "тест",
            comment: "222",
          },
        ],
      },
      status: 200,
    });
    loading = screen.getByTestId("loader");
    expect(loading).toBeInTheDocument();
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    let numlike = screen.getByTestId("numlike");
    expect(numlike).toBeInTheDocument();
    expect(screen.getByTestId("numlike")).toHaveTextContent("1");
    expect(screen.getByTestId("like")).toBeInTheDocument();
    axios.mockResolvedValueOnce({
      data: { like: true },
    });
    fireEvent.click(screen.getByTestId("like"));
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    numlike = screen.getByTestId("numlike");
    expect(numlike).toBeInTheDocument();
    expect(screen.getByTestId("numlike")).toHaveTextContent("2");
    expect(screen.getByTestId("unlike")).toBeInTheDocument();
    expect(axios).toHaveBeenCalledTimes(5);
    screen.debug();
  });

  it("Shoud add like from change like, start with like", async () => {
    const { userId } = jest.fn();
    screen.debug();

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
    axios.mockResolvedValueOnce({
      data: { like: true, message: "Успешно" },
      status: 200,
    });
    loading = screen.getByTestId("loader");
    expect(loading).toBeInTheDocument();

    //4
    axios.mockResolvedValueOnce({
      data: {
        total: [
          {
            user: "тест",
            comment: "123",
          },
          {
            user: "тест",
            comment: "222",
          },
        ],
      },
      status: 200,
    });
    loading = screen.getByTestId("loader");
    expect(loading).toBeInTheDocument();
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    let numlike = screen.getByTestId("numlike");
    expect(numlike).toBeInTheDocument();
    expect(screen.getByTestId("numlike")).toHaveTextContent("1");
    expect(screen.getByTestId("unlike")).toBeInTheDocument();
    axios.mockResolvedValueOnce({
      data: { like: false },
    });
    fireEvent.click(screen.getByTestId("unlike"));
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    numlike = screen.getByTestId("numlike");
    expect(numlike).toBeInTheDocument();
    expect(screen.getByTestId("numlike")).toHaveTextContent("0");
    expect(screen.getByTestId("like")).toBeInTheDocument();
    screen.debug();
    expect(axios).toHaveBeenCalledTimes(5);
  });
});
