import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PostTable.scss";
import { Link } from "react-router-dom";
import Loader from "../Loader/Loader";

const PostTable = ({ id }) => {
  const [post, setPost] = useState(null);
  const [errorMessage, setErrorMessage] = React.useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      axios({
        method: "get",
        url: "/post/getMe",
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

          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setErrorMessage(error.response.data.message);

          setLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  if (loading) {
    return <div className="head">Загрузка постов...</div>;
  }

  if (errorMessage != "") {
    return (
      <div className="wrapper">
        <h1>Нет постов</h1>
      </div>
    );
  }

  return (
    <div className="wrapper">
      {post && (
        <div className="gal">
          <div className="gallery">
            <ul>
              {post.map((option) => (
                <Link to={`/post/${option._id}`}>
                  <li>
                    <img
                      style={{ width: 300, height: 223 }}
                      href={"/post/" + option._id}
                      src={option.image}
                    />
                  </li>
                </Link>
              ))}
            </ul>
          </div>
          <div>
            {!post && <h2 className="h2">Нет постов</h2>}
            {post && <h2 className="h2">Фотографии закончились</h2>}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostTable;
