import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import AddPostPage from "./pages/AddPostPage/AddPostPage";
import AuthPage from "./pages/AuthPage/AuthPage";
import PopularPage from "./pages/PopularPage/PopularPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import RegPage from "./pages/RegPage/RegPage";
import SettingsPage from "./pages/SettingsPage/SettingPage";
import SubscribePage from "./pages/SubscribePage/SubscribePage";
import PostPage from "./pages/PostPage/PostPage";
import SearchPage from "./pages/SearchPage/SearchPage";
import AnotherUserPage from "./pages/AnotherUserPage/AnotherUserPage";
import Loader from "./components/Loader/Loader";

export const useRoutes = (isLogin, isReady) => {
  console.log(isLogin);

  if (isReady) {
    if (isLogin) {
      return (
        <div className="app">
          <NavBar />
          <Switch>
            <Route exact path="/popular" component={PopularPage} />
            <Route exact path="/settings" component={SettingsPage} />
            <Route exact path="/profile" component={ProfilePage} />
            <Route exact path="/post/" component={AddPostPage} />
            <Route exact path="/subsc" component={SubscribePage} />
            <Route exact path="/post/:id" component={PostPage} />
            <Route exact path="/profile/:id" component={AnotherUserPage} />
            <Route exact path="/search/:id" component={SearchPage} />
            <Route exact path="/search/" component={SearchPage} />
            <Redirect to="/popular" />
          </Switch>
        </div>
      );
    }

    if (!isLogin) {
      return (
        <div className="app-1">
          <Switch>
            <Route exact path="/reg" component={RegPage} />
            <Route exact path="/auth" component={AuthPage} />
            <Redirect to="/auth" />
          </Switch>
        </div>
      );
    }
  } else {
    return <Loader />;
  }
};
