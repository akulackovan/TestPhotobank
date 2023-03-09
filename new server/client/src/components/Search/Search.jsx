import React, { useState, useEffect } from "react";
import axios from "axios";
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
    })
      .then((require) => {
        setLoader(false);
        console.log(require.data.user);
        setSearchValue(require.data.user);
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage(error.response.data.message);

        setLoader(false);
      });
  }, []);
  if (loader) {
    return <Loader />;
  }

  return (
    <div className="searchUser container">
      {id && (
        <div>
          {search && (
            <div className="container">
              <div className="search">
                <ul>
                  {search.map((item) => (
                    <li className="element container" data-testid="searchUser">
                      <Link to={`/profile/${item.id}`}
                        title={`Открыть профиль: ${item.username}`}
                      >
                        <h5 style={{ overflowWrap: "break-word" }}>
                          {item.username}
                        </h5>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
      {error && (
        <div>
          <h3 align="center">Ничего не найдено</h3>
        </div>
      )}
    </div>
  );
};

export default Search;
