import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom"
import CityCombobox from "./components/CityCombobox/CityCombobox";
import NavBar from "./components/NavBar/NavBar";
import AddPostPage from "./pages/AddPostPage/AddPostPage";
import AuthPage from "./pages/AuthPage/AuthPage";
import PopularPage from './pages/PopularPage/PopularPage'
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import RegPage from "./pages/RegPage/RegPage";
import SettingsPage from "./pages/SettingsPage/SettingPage";
import SubscribePage from "./pages/SubscribePage/PopularPage";

export const useRoutes = (isLogin) =>
{
    if (isLogin)
    {
        return (
            <div className="app">
                    <NavBar />
                        <Switch>
                            <Route exact path='/popular' component={PopularPage} />
                            <Route exact path='/settings' component={SettingsPage} />
                            <Route exact path='/profile' component={ProfilePage} />
                            <Route exact path='/addpost' component={AddPostPage} />
                            <Route exact path='/subsc' component={SubscribePage} />
                            
                            <Route exact path='/city' component={CityCombobox} />
                        </Switch>
            </div>
        )
    }
    return (
        <Switch>
            <Route exact path='/reg' component={RegPage} />
            <Route exact path='/auth' component={AuthPage} />
        </Switch>
    )
}