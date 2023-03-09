import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import "./PostPage.scss";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

const PostPageComponent = ({ id }) => {
  const [post, setPost] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingComm, setLoadingComm] = useState(true);
  const [error, setErrorMessage] = useState("");
  const [postError, setPostError] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState({
    length: 0,
  });
  const { userId } = useContext(AuthContext);
  const [like, setLike] = useState();
  const [loadLike, setLoadLike] = useState(false)
  const [countLike, setCountLike] = useState();
  console.log(userId);

  //Добавить просмотр + данные о посте
  useEffect(() => {
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
        console.log(response);
        getPost();
      })
      .catch((error) => {
        console.log(error);
        setPostError(error.response.data.message);
        setLoading(false);
      });
  }, []);

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
          setComments({ length: 0 });
          setLoadingComm(false);
          return;
        }
        setComments(response.data.total);
        setLoadingComm(false);
      })
      .catch((error) => {
        setLoading(false);
        setErrorMessage(error.response.data.message);
        setTimeout(() => setErrorMessage(""), 2000);
      });
  };

  const getPost = () => {
    axios({
      method: "get",
      url: "/post/post/id",
      headers: {
        "content-type": "application/json",
      },
      params: {
        id: id,
        user: userId,
      },
    })
      .then((response) => {
        console.log(response.data.isPost);
        setPost(response.data.isPost);
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
          .then((responseLike) => {
            setLike(responseLike.data.like);
            if (responseLike.data.like) {
              setCountLike(response.data.isPost.likes);
            } else {
              setCountLike(response.data.isPost.likes + 1);
            }
            
            getComments();
            
        
        setLoading(false);
          })
          .catch((error) => {
            setLoading(false);
            setPostError(error.response.data.message);

            return;
          });
      })
      .catch((error) => {
        setLoading(false);
        setPostError(error.response.data.message);
      });
    console.log("Like" + like);
  };

  const changeForm = (event) => {
    setComment(event.target.value);
    console.log(comment);
  };

  const changeLike = () => {
    setLoadLike(true)
    axios({
      method: "put",
      url: "/post/setLike",
      params: {
        idPost: id,
        idUser: userId,
      },
    })
      .then((response) => {
        setLike(response.data.like);
        console.log(countLike);
        if (response.data.like) {
          setPost({ ...post, likes: countLike });
        } else {
          setPost({ ...post, likes: countLike - 1 });
        }
        setLoadLike(false)
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage(error.response.data.message);
        setTimeout(() => setErrorMessage(""), 2000);
        setLoading(false);
        setLoadLike(false)
      });
  };

  const commentHandler = () => {
    
    
    var str = document.getElementById("textarea").value;
    console.log(str);
    if (!(str.length <= 128)) {
      setErrorMessage("Комментарий должен содержать не более 128 символов");
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }
    if (str.length == 0) {
      setErrorMessage("Комментарий не должен быть пустым");
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }
    setLoadingComm(true);
    axios({
      url: "/post/comments",
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      params: {
        postId: id,
        userId: userId,
        comment: str,
      },
    })
      .then((response) => {
        document.getElementById("inputs").reset();
        if (comments.length == 0) {
          setComments([{ user: response.data.newComment.user, comment: str }]);
        } else {
          setComments([
            { user: response.data.newComment.user, comment: str },
            ...comments,
          ]);
        }
        setComment("");
        console.log(response);
        setLoadingComm(false);
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage(error.response.data.message);
        setTimeout(() => setErrorMessage(""), 2000);
      });
  };

  if (loading) {
    return <Loader />;
  }

  if (postError) {
    return <ErrorMessage msg={postError} />;
  }

  return (
    <div className="allPost">
      {error && <ErrorMessage msg={error} />}
      {post && (
        <div className="post">
          <div className="one">
            <div className="container">
              <div>
                <Link to={`/profile/${post.author._id}`}
                  title={`Автор: ${post.author.username}`}
                >
                  <h4 className="head" data-testid="author" style={{overflowWrap: 'break-word', fontSize: 'min(3vw, 30px)'}}>
                    {post.author.username}
                  </h4>
                </Link>
              </div>
              <div className="under">
                <div className="date" data-testid="date">
                  {post.timestamps[8]}
                  {post.timestamps[9]}\{post.timestamps[5]}
                  {post.timestamps[6]}\{post.timestamps[2]}
                  {post.timestamps[3]}
                </div>
                <div className="city" data-testid="city">
                  г.{post.city.city}
                </div>
              </div>
            </div>
            <img className="img" data-testid="img" src={`${post.image}`} />
            <div className="stat">
              <ul>
                <li className="icon li">
                  <svg viewBox="0 0 16 16">
                    <path d="M8 5.5A2.59 2.59 0 0 0 5.33 8 2.59 2.59 0 0 0 8 10.5 2.59 2.59 0 0 0 10.67 8 2.59 2.59 0 0 0 8 5.5zm0 3.75A1.35 1.35 0 0 1 6.58 8 1.35 1.35 0 0 1 8 6.75 1.35 1.35 0 0 1 9.42 8 1.35 1.35 0 0 1 8 9.25z" />
                    <path d="M8 2.5A8.11 8.11 0 0 0 0 8a8.11 8.11 0 0 0 8 5.5A8.11 8.11 0 0 0 16 8a8.11 8.11 0 0 0-8-5.5zm5.4 7.5A6.91 6.91 0 0 1 8 12.25 6.91 6.91 0 0 1 2.6 10a7.2 7.2 0 0 1-1.27-2A7.2 7.2 0 0 1 2.6 6 6.91 6.91 0 0 1 8 3.75 6.91 6.91 0 0 1 13.4 6a7.2 7.2 0 0 1 1.27 2 7.2 7.2 0 0 1-1.27 2z" />
                  </svg>

                  <div className="num" data-testid="view">
                    {post.views}
                  </div>
                </li>
                <li className="icon li">
                  <svg viewBox="0 0 32 32">
                    <path
                      d="M21.886 5.115c3.521 0 6.376 2.855 6.376 6.376 0 1.809-0.754 3.439-1.964 4.6l-10.297 10.349-10.484-10.536c-1.1-1.146-1.778-2.699-1.778-4.413 0-3.522 2.855-6.376 6.376-6.376 2.652 0 4.925 1.62 5.886 3.924 0.961-2.304 3.234-3.924 5.886-3.924zM21.886 4.049c-2.345 0-4.499 1.089-5.886 2.884-1.386-1.795-3.54-2.884-5.886-2.884-4.104 0-7.442 3.339-7.442 7.442 0 1.928 0.737 3.758 2.075 5.152l11.253 11.309 11.053-11.108c1.46-1.402 2.275-3.308 2.275-5.352 0-4.104-3.339-7.442-7.442-7.442v0z"
                      fill="#000000"
                    ></path>
                  </svg>
                  <div className="num" data-testid="numlike">
                    {loadLike ? "..." : `${post.likes}`}
                  </div>
                </li>
                <li className="icon li">
                  <svg viewBox="0 0 24 24">
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M3 10.4C3 8.15979 3 7.03969 3.43597 6.18404C3.81947 5.43139 4.43139 4.81947 5.18404 4.43597C6.03969 4 7.15979 4 9.4 4H14.6C16.8402 4 17.9603 4 18.816 4.43597C19.5686 4.81947 20.1805 5.43139 20.564 6.18404C21 7.03969 21 8.15979 21 10.4V11.6C21 13.8402 21 14.9603 20.564 15.816C20.1805 16.5686 19.5686 17.1805 18.816 17.564C17.9603 18 16.8402 18 14.6 18H7.41421C7.149 18 6.89464 18.1054 6.70711 18.2929L4.70711 20.2929C4.07714 20.9229 3 20.4767 3 19.5858V18V13V10.4ZM9 8C8.44772 8 8 8.44772 8 9C8 9.55228 8.44772 10 9 10H15C15.5523 10 16 9.55228 16 9C16 8.44772 15.5523 8 15 8H9ZM9 12C8.44772 12 8 12.4477 8 13C8 13.5523 8.44772 14 9 14H12C12.5523 14 13 13.5523 13 13C13 12.4477 12.5523 12 12 12H9Z"
                      fill="#222222"
                    />
                  </svg>

                  <div className="num" data-testid="numComments">
                    {comments.length}
                  </div>
                </li>
              </ul>
            </div>
            <div className="container">
              <div className="head">Описание</div>
              {!post.text && (
                <div className="discription" data-testid="text">
                  {`\n`}
                </div>
              )}
              <div className="discription" data-testid="text">
                {post.text}
              </div>
            </div>
          </div>
          <div className="second">
            <div className="comment">
              {!like && (
                <button
                  className="like icon"
                  title="Лайк"
                  onClick={changeLike}
                  id="like"
                  data-testid="likeButton"
                >
                  <svg
                    width="50px"
                    height="50px"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      data-testid="like"
                      className="like"
                      d="M16.44 3.10156C14.63 3.10156 13.01 3.98156 12 5.33156C10.99 3.98156 9.37 3.10156 7.56 3.10156C4.49 3.10156 2 5.60156 2 8.69156C2 9.88156 2.19 10.9816 2.52 12.0016C4.1 17.0016 8.97 19.9916 11.38 20.8116C11.72 20.9316 12.28 20.9316 12.62 20.8116C15.03 19.9916 19.9 17.0016 21.48 12.0016C21.81 10.9816 22 9.88156 22 8.69156C22 5.60156 19.51 3.10156 16.44 3.10156Z"
                    />
                  </svg>
                </button>
              )}
              {like && (
                <button
                  className="dislike icon"
                  title="Лайк"
                  onClick={changeLike}
                  id="unlike"
                  data-testid="likeButton"
                >
                  <svg
                    width="50px"
                    height="50px"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      data-testid="unlike"
                      className="dislike icon"
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
                  data-testid="commentInput"
                  onChange={changeForm}
                  id="textarea"
                  disabled={loadingComm}
                />
              </form>
              <div onClick={commentHandler}>
                <button
                  className="button"
                  data-testid="commentButton"
                  title="Отправить"
                  id="send"
                  disabled={loadingComm}
                >
                  ОПУБЛИКОВАТЬ
                </button>
                
              </div>
            </div>
            <div className="listComments">
              <hr className="hr" />
              <div className="head" data-testid="comments">
                Комментарии
              </div>
              {loadingComm && (
                <h5>Загрузка комментариев...</h5>
              )}
              {!loadingComm && comments.length == 0 && (
                <div>
                  <div><br/></div>
                  <hr className="hr" />
                </div>
              )}
              {!loadingComm && comments.length != 0 && (
                <div className="comments">
                  <ul>
                    {comments.map((item) => (
                      <div>
                        <li className="container" data-testid="comment">
                          <h5 className="userCom head" style={{fontSize: "22px"}}>{item.user}</h5>
                          <p>{item.comment}</p>
                        </li>
                        <hr className="hr" />
                      </div>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostPageComponent;
