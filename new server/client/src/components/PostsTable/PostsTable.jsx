import React from "react";
import "./PostTable.scss";
import { Link } from "react-router-dom";

const PostTable = ({ post, end = true, disabled=false }) => {
  if (disabled == true){
    disabled = 'none'
  }
  return (
    <div className="wrapper">
      {post && (
        <div className="gal">
          <div className="canter">
            <ul>
              {post.map((option) => (
                  <li className="gallery" key={option.id}>
                  <Link to={`/post/${option._id}`}  title="Открыть пост" style={{pointerEvents: {disabled}}}>
                    <img
                      style={{ width: 300, height: 223 }}
                      href={"/post/" + option._id}
                      src={option.image}
                      data-testid={`post-${option.id}`}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            {!post && <h2 className="h2" data-testid="no-posts-message">Нет постов</h2>}
            {post && end && <h2 className="head">Фотографии закончились</h2>}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostTable;