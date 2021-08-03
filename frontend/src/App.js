import "./App.css";
import React, { Suspense } from "react";
import jwtDecode from "jwt-decode";
import Navbar from "./components/Navbar/Navbar";
import Login from "./pages/Login/Login";
import Profile from "./pages/Profile/Profile";
import Signup from "./pages/Signup/Signup";
import TweetPage from "./pages/Tweet/Tweet";
import Home from "./pages/Home/Home";
import AuthRoute from "./helpers/AuthRoute";
import ListPage from "./components/List/List";
import ListDetails from "./components/ListDetails/ListDetails";
import Feed from "./components/Feed/Feed";

// Import modules
import { getUserData, setAuthenticated, logoutUser } from "./redux/actions/userActions";
import {BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import store from "./redux/store";
import Booksmarks from "./pages/Booksmarks/Booksmarks";
import Conversations from "./pages/Conversations/Conversations";
import Chat from "./components/Chat/Chat";
import Spinner from "./helpers/Spinner";

//const Home = lazy(() => import('./components/Home/Home'))

const token = localStorage.getItem("FBIdToken");
if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    store.dispatch(logoutUser());
  } else {
    setAuthenticated(token);
    store.dispatch(getUserData());
  }
}

function App() {
  return (
    <div>
      <Router>
        <div className="body-wrap">
          <div className="header">
            <Navbar />
          </div>
          <Suspense fallback={<Spinner size={{width: "200px", height: "150px"}} />}>
          <div className="main">
            <Switch>
              <Redirect exact path="/" to="/home" />
              <AuthRoute exact path="/home" component={Home} />
              <AuthRoute path="/bookmarks" component={Booksmarks} />
              <AuthRoute exact path="/login" component={Login} />
              <AuthRoute exact path="/signup" component={Signup} />
              <AuthRoute path="/messages" component={Conversations} />
              <AuthRoute path="/explorer" component={Feed} />
              {/* */}
              <Route exact path="/profile/:username" component={Profile} />
              <Route exact path="/tweet/:username/:tweetId" component={TweetPage} />
              <Route exact path="/:username/lists" component={ListPage} />
              <Route exact path="/:username/lists" component={ListPage} />
              <Route exact path="/list/:listId" component={ListDetails} />
              <Route path="*" component={Home} />
            </Switch>
          </div>
          <div className="sidebar">
            <Route path="/home" component={Feed} />
            <Route path="/tweet/:username/:tweetId" component={Feed} />
            <Route path="/messages" component={Chat} />
          </div>
          </Suspense>
        </div>
      </Router>
    </div>
  );
}

export default App;
