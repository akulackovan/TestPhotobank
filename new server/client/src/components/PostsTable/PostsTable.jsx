import React from "react";
import "./PostTable.scss";
import { Link } from "react-router-dom";

const PostTable = ({ post, end = true }) => {
  return (
    <div className="wrapper">
      {post && (
        <div className="gal">
          <div className="canter">
            <ul>
              {post.map((option) => (
                <li class="gallery">
                  <Link to={`/post/${option._id}`} title="Открыть пост">
                    <img
                      style={{ width: 300, height: 223 }}
                      href={"/post/" + option._id}
                      src={option.image}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            {!post && <h2 className="h2">Нет постов</h2>}
            {post && end && <h2 className="head">Фотографии закончились</h2>}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostTable;
