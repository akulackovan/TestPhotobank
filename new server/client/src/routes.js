import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom"
import NavBar from "./components/NavBar/NavBar";
import AuthPage from "./pages/AuthPage/AuthPage";
import PopularPage from './pages/PopularPage/PopularPage'
import RegPage from "./pages/RegPage/RegPage";
import SettingsPage from "./pages/SettingsPage/SettingPage";

export const useRoutes = (isLogin) =>
{
    
    if (isLogin)
    {
        return (
            <div className="app">
                    <NavBar />
                    <Router >
                        <Switch>
                            <Route exact path='/popular' component={PopularPage} />
                            <Route exact path='/settings' component={SettingsPage} />
                        </Switch>
                    </Router>
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