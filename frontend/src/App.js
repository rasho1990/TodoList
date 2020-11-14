import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';
import Main from '././././shared/components/Navigation/Main'
import TodoList from './user/pages/TodoList';
import UserProfile from './user/pages/UserProfile';
import Footer from '././shared/components/FormElements/Footer'
import Home from './user/pages/Home';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';
const App = () => {
  const { token, login, logout, userId } = useAuth();
  let routes;
  if (token) {
    routes = (
      <Switch>
        <Route path="/home" exact>
          <Main />
          <Home />
          <Footer />
        </Route>
        <Route path="/todolist" exact>
          <Main />
          <TodoList />
          <Footer />
        </Route>
        <Route path="/userprofile" exact>
          <Main />
          <UserProfile />
          <Footer />
        </Route>
        <Redirect to="/home" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/">
          <Main />
          <Home />
          <Footer />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  }
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout
      }}
    >
      <Router>
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};
export default App;
