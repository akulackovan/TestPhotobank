import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "../Loader/Loader";
import "./Search.scss";

const Search = ({ id }) => {
  const [loader, setLoader] = useState(true);
  const [error, setErrorMessage] = useState(null);
  const [search, setSearchValue] = useState(null);

  useEffect(() => {
      axios({
        method: "get",
        url: "/auth/search",
        headers: {
          "content-type": "application/json",
        },
        params: {
          name: id,
        },
      }).then((require) => {
        setLoader(false);
        console.log(require.data.user);
        if (require.data.user.length == 0) {
          setErrorMessage("Ничего не найдено");
          return;
        }
        setSearchValue(require.data.user);
      }).catch ((error) => {
      console.log(error);
      setErrorMessage(error.response.data.message);
      
      setLoader(false);
    })
  }, []);
  if (loader) {
    return <Loader />;
  }

  return (


    <div className="searchUser container">
      { id && <div>
        <h2 className="head">По запросу "{id}" найдено:</h2>
      {search && (
        <div className="container">
          <hr className="hr" />
          <div className="search">
            <ul>
              {search.map((item) => (
                <li className="element container">
                  <Link
                    to={`/profile/${item._id}`}
                    title={`Открыть профиль: ${item.username}`}
                  >
                    <h5>{item.username}</h5>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      </div>
              }
      {error && <h3 align="center">{error}</h3>}
    </div>
    
  );
};

export default Search;
