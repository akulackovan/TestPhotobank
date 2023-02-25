import React from "react"
import { BrowserRouter as Router } from "react-router-dom"
import "./App.scss";
import {useRoutes} from './routes'
import AuthContext from './context/AuthContext'
import {useAuth} from './hooks/auth.hook'
import {useTheme} from './hooks/use.theme'

function App() {

  const {login, logout, token, userId, isReady } = useAuth()
  const isLogin  = !!token
  const routes = useRoutes(isLogin, isReady)
  const { theme, setTheme } = useTheme()


  return (
    <AuthContext.Provider value= {{login, logout, token, userId, isLogin, isReady}}>
      <div className="app">
        <Router  forceRefresh={true}>
            { routes }
        </Router>
      </div>
    </AuthContext.Provider>
  );
}

export default App;