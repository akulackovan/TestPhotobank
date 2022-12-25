import React from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import "./App.scss";
import RegPage from "./pages/RegPage/RegPage"
import AuthPage from "./pages/AuthPage/AuthPage"
import NavBar from "./components/NavBar/NavBar"

function App() {
  return (<Router>
      <div className="App">
        <Switch>
          <Route exact path='/registration' component={RegPage}>
            <RegPage />
          </Route>
          <Route exact path='/auth' component={AuthPage}>
            <AuthPage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;