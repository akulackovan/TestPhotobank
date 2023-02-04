import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./ProfilePage.scss";
import { AnotherPage } from "../../components/AnotherPage/AnotherPage";

const ProfilePage = () => {
  const { userId } = useContext(AuthContext);

  return (
    <div className="anotherPage">
      <AnotherPage id={userId} />
    </div>
  );
};

export default ProfilePage;
