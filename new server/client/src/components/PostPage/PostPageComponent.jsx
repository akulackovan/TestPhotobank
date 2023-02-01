import React, { useState, useEffect, Component, useContext } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./PostPage.scss";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

const PostPageComponent = ({ id }) => {
  const [post, setPost] = useState("");
  const [loading, setLoading] = useState(true);

  const [loadingComm, setLoadingComm] = useState(true);
  const [error, setErrorMessage] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(null);
  const { userId } = useContext(AuthContext);
  const [like, setLike] = useState();
  console.log(userId);

  //Получаем лайк от пользователя
  const getLike = () => {
    axios({
      method: "get",
      url: "/post/getLike",
      headers: {
        "content-type": "application/json",
      },
      params: {
        idUser: userId,
        idPost: id,
      },
    })
      .then((response) => {
        setLike(response.data.like);
        console.log(like);
      })
      .catch((error) => {
        setErrorMessage(error.response.data.message);
        setTimeout(() => setErrorMessage(""), 2000);
      });
  };

  //Получаем комментарии к посту
  const getComments = () => {
    axios({
      method: "get",
      url: "/post/comments",
      headers: {
        "content-type": "application/json",
      },
      params: {
        id: id,
      },
    })
      .then((response) => {
        console.log(response.data);
        if (response.data.total.length == 0) {
          setComments(null);
          setLoadingComm(false);
          return;
        }
        setComments(response.data.total);
        setLoadingComm(false);
      })
      .catch((error) => {
        setErrorMessage(error.response.data.message);
        setTimeout(() => setErrorMessage(""), 2000);
      });
  };

  //Получаем данные о посте
  useEffect(() => {
    axios({
      method: "get",
      url: "/post/post/id",
      headers: {
        "content-type": "application/json",
      },
      params: {
        id: id,
      },
    })
      .then((response) => {
        console.log(response.data.isPost);
        setPost(response.data.isPost);
        getLike();

        //!!БАГ - иногда 2 раза срабатывает
        axios({
          method: "put",
          url: "/post/addView",
          headers: {
            "content-type": "application/json",
          },
          params: {
            id: id,
          },
        })
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            setErrorMessage(error.response.data.message);
            setTimeout(() => setErrorMessage(""), 2000);
          });

        setLoading(false);
        getComments();
      })
      .catch((error) => {
        setErrorMessage(error.response.data.message);
        setTimeout(() => setErrorMessage(""), 2000);
      });
  }, []);

  //
  const changeForm = (event) => {
    if (!(comment.length <= 128)) {
      setErrorMessage("Комментарий должен быть меньше 128 символов");
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }
    setComment(event.target.value);
    console.log(comment);
  };

  const changeLike = async () => {
    try {
      await axios({
        method: "put",
        url: "/post/setLike",
        params: {
          idPost: id,
          idUser: userId,
        },
      }).then((response) => {
        setLike(response.data.like);
      });

      await axios({
        method: "get",
        url: "/post/updateLike",
        params: {
          idPost: id,
        },
      }).then((response) => {
        setPost({ ...post, likes: response.data.likes });
        console.log(response);
      });
    } catch (error) {
      console.log(error);
      setErrorMessage(error.response.data.message);
      setTimeout(() => setErrorMessage(""), 2000);
    }
  };

  const commentHandler = async () => {
    setLoadingComm(true);
    try {
      await axios({
        method: "post",
        url: "/post/comments",
        headers: {
          "content-type": "application/json",
        },
        params: {
          postId: id,
          userId: userId,
          comment: comment,
        },
      }).then((response) => {
        document.getElementById("inputs").reset();
        getComments("");
        setComment("");
      });
    } catch (error) {
      console.log(error);
      setErrorMessage(error.response.data.message);
      setTimeout(() => setErrorMessage(""), 2000);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="allPost">
      {error && <ErrorMessage msg={error} />}
      {post && (
        <div className="post">
          <div className="one">
            <div>
              <div className="user">
                <Link to={`/profile/${post.author._id}`}>
                  <h4>{post.author.username}</h4>
                </Link>
              </div>
              <div className="under">
                <div className="data">
                  {post.timestamps[8]}
                  {post.timestamps[9]}\{post.timestamps[5]}
                  {post.timestamps[6]}\{post.timestamps[2]}
                  {post.timestamps[3]}&emsp;г.{post.city.city}
                </div>
              </div>
            </div>
            <img
              className="img"
              style={{ width: "830px", height: "603px" }}
              src={`${post.image}`}
            />
            <div className="stat">
              <div>
                Просмотры: {post.views} &emsp;&emsp;&emsp;Лайки: {post.likes}
                &emsp;&emsp;&emsp; Комментарии: {post.comments.length}
              </div>
            </div>
            <div className="text">
              <h5>Описание</h5>
              <div>{post.text}</div>
            </div>
          </div>
          <div className="second">
            <div className="comment">
              {!like && (
                <button className="like" onClick={changeLike}>
                  <svg
                    width="50px"
                    height="50px"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      className="like"
                      d="M16.44 3.10156C14.63 3.10156 13.01 3.98156 12 5.33156C10.99 3.98156 9.37 3.10156 7.56 3.10156C4.49 3.10156 2 5.60156 2 8.69156C2 9.88156 2.19 10.9816 2.52 12.0016C4.1 17.0016 8.97 19.9916 11.38 20.8116C11.72 20.9316 12.28 20.9316 12.62 20.8116C15.03 19.9916 19.9 17.0016 21.48 12.0016C21.81 10.9816 22 9.88156 22 8.69156C22 5.60156 19.51 3.10156 16.44 3.10156Z"
                    />
                  </svg>
                </button>
              )}
              {like && (
                <button className="dislike" onClick={changeLike}>
                  <svg
                    width="50px"
                    height="50px"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      className="dislike"
                      d="M16.44 3.10156C14.63 3.10156 13.01 3.98156 12 5.33156C10.99 3.98156 9.37 3.10156 7.56 3.10156C4.49 3.10156 2 5.60156 2 8.69156C2 9.88156 2.19 10.9816 2.52 12.0016C4.1 17.0016 8.97 19.9916 11.38 20.8116C11.72 20.9316 12.28 20.9316 12.62 20.8116C15.03 19.9916 19.9 17.0016 21.48 12.0016C21.81 10.9816 22 9.88156 22 8.69156C22 5.60156 19.51 3.10156 16.44 3.10156Z"
                    />
                  </svg>
                </button>
              )}

              <form id="inputs">
                <textarea
                  className="textarea"
                  type="text"
                  placeholder="Комментарий"
                  name="text"
                  onChange={changeForm}
                  maxLength="128"
                />
              </form>
              <div onClick={commentHandler}>
                <button className="send">
                  <svg
                    className="svg"
                    width="50px"
                    height="50px"
                    viewBox="0 0 24 24"
                    fill="red"
                  >
                    <path
                      className="send"
                      d="M18.0693 8.50867L9.50929 4.22867C3.75929 1.34867 1.39929 3.70867 4.27929 9.45867L5.14929 11.1987C5.39929 11.7087 5.39929 12.2987 5.14929 12.8087L4.27929 14.5387C1.39929 20.2887 3.74929 22.6487 9.50929 19.7687L18.0693 15.4887C21.9093 13.5687 21.9093 10.4287 18.0693 8.50867ZM14.8393 12.7487H9.43929C9.02929 12.7487 8.68929 12.4087 8.68929 11.9987C8.68929 11.5887 9.02929 11.2487 9.43929 11.2487H14.8393C15.2493 11.2487 15.5893 11.5887 15.5893 11.9987C15.5893 12.4087 15.2493 12.7487 14.8393 12.7487Z"
                      fill="#292D32"
                    />
                  </svg>
                </button>
              </div>
              {comments == 0 && <h3>Комментариев нет</h3>}
            </div>
            {loadingComm && <Loader />}
            {comments && (
              <div className="comments">
                <ul>
                  {comments.map((item) => (
                    <li>
                      <h5>{item.user}</h5>
                      <p>{item.comment}</p>
                      <hr align="center" width="100%" size="2" color="" />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostPageComponent;
