import React from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import "./App.scss";
import RegPage from "./pages/RegPage/RegPage"
import AuthPage from "./pages/AuthPage/AuthPage"
import NavBar from "./components/NavBar/NavBar"
import {useRoutes} from './routes'
import {AuthContext} from './context/AuthContext'
import {useAuth} from './hooks/auth.hook'

function App() {
  const {login, logout, token, userId, isReady} = useAuth()
  const isLogin = !!token
  
  const routes = useRoutes(isLogin)
  return (
  <AuthContext.Provider value={login, logout, userId, isReady, isLogin}>
  <Router>
      <div className="App">
        { routes }
      </div>
    </Router>
  </AuthContext.Provider>
  );
}

export default App;