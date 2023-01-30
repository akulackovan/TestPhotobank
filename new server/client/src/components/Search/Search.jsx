import React, { useState, useEffect, Component, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "../Loader/Loader";

const Search = ({ id }) => {
  const [loader, setLoader] = useState(true);
  const [error, setErrorMessage] = useState(null);
  const [search, setSearchValue] = useState(null);

  useEffect(() => {
    try {
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
          console.log("Ybxtuj");
          setErrorMessage("Ничего не найдено");
          return;
        }
        setSearchValue(require.data.user);
      });
    } catch (error) {
      console.log(error);
      setErrorMessage(error.response.data.message);
    }
  }, []);
  if (loader) {
    return <Loader />;
  }

  return (
    <div className="searchUser">
      {error && <h3 align="center">{error}</h3>}
      {search && (
        <div>
          <h2>Результаты поиска:</h2>
          <hr align="center" width="80%" size="2" color="" />
          <div className="search">
            <ul>
              {search.map((item) => (
                <li className="element">
                  <Link to={`/profile/${item._id}`}>
                    <h4>{item.username}</h4>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
