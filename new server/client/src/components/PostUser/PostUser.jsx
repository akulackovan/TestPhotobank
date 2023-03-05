import React, { useState, useEffect } from "react";
import axios from "axios";
import PostTable from "../PostsTable/PostsTable";

const PostUser = ({ id, disabled=false }) => {
  const [post, setPost] = useState(null);
  const [errorMessage, setErrorMessage] = React.useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  return <PostTable post={post} disabled={disabled}/>;
};

export default PostUser;
