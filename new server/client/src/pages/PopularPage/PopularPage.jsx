import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import  AuthContext  from "../../context/AuthContext";
import Loader from "../../components/Loader/Loader";
import PostTable from "../../components/PostsTable/PostsTable";

const PopularPage = () => {
  const { userId } = useContext(AuthContext);
  const [post, setPosts] = useState([]);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    setLoader(true)
      axios({
        method: "get",
        url: "/post/popular",
        headers: {
          "x-auth-token": localStorage.getItem("auth-token"),
          "content-type": "application/json",
        },
        params: {
          id: userId,
        },
      })
        .then((response) => {
          console.log(response.data);
          setPosts(response.data.popular);
          setLoader(false);
        })
        .catch((error) => {
          setErrorMessage(error.response.data.message);
          setLoader(false);
        });
  }, []);


  if (loader) {
    return <Loader />;
  }

  if (errorMessage !== "") {
    return (
      <div className="wrapper1">
        <h1 className="center head">{errorMessage}</h1>
        <hr className="hr center" style={{ margin: "0 auto 50px auto" }} />
      </div>
    );
  }

  if (post.length === 0) {
    return (
      <div className="wrapper1">
        <h1>Нет постов</h1>
        <hr className="hr center" style={{ margin: "0 auto 50px auto" }} />
      </div>
    );
  }


  return (
    <div
      className="wrapper1"
      style={{ width: "80%", marginLeft: "auto", marginRight: "auto" }}
    >
      {post && (
        <div className="gal1">
          {post && (
            <div>
              {post.map((option) => (
                <div>
                  <div className="head center">{option.date}</div>
                  {option.posts === "Фотографий за день нет" ? (
                    <div className="head center" style={{ fontSize: "3vw" }}>
                      Фотографий за день нет
                    </div>
                  ) : (
                    <PostTable end={false} post={option.posts} />
                  )}
                  <hr className="hr" style={{ width: "50%" }} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <div className="head center">Фотографии закончились</div>
      <hr className="hr center" style={{ margin: "0 auto 50px auto" }} />
    </div>
  );
};

export default PopularPage;