import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom"
import NavBar from "./components/NavBar/NavBar";
import AuthPage from "./pages/AuthPage/AuthPage";
import PopularPage from './pages/PopularPage/PopularPage'
import RegPage from "./pages/RegPage/RegPage";

export const useRoutes = (isLogin) =>
{
    if (isLogin)
    {
        console.log(isLogin)
        return (
            <Switch>
                <Route path='/popular' exact component={PopularPage} />
            </Switch>
        )
    }
    return (
        <Switch>
            <Route exact path='/registration' component={RegPage}>
                <RegPage />
            </Route>
            <Route exact path='/auth' component={AuthPage}>
                <AuthPage />
            </Route>
        </Switch>
    )
}