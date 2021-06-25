import React from "react";
import jwtDecode from "jwt-decode";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Login from "./components/Login/Login";
import Profile from "./components/Profile/Profile";
import Signup from "./components/Signup/Signup";
import TweetPage from "./components/Tweet/Tweet";
import Home from "./components/Home/Home";
import AuthRoute from "./utils/AuthRoute";
import ListPage from "./components/List/List";
import ListDetails from "./components/ListDetails/ListDetails";
import Feed from "./components/Feed/Feed";

// Import modules
import {
  getUserData,
  setAuthenticated,
  logoutUser,
} from "./redux/actions/userActions";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import store from "./redux/store";
import Booksmarks from "./components/Booksmarks/Booksmarks";
import Conversations from "./components/Messages/Conversations/Conversations";
import ActiveConversation from "./components/Messages/ActiveConversation/ActiveConversation";

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
          {token ? (
            <>
              <div className="header">
                <Navbar />
              </div>
              <div className="main">
                <Switch>
                  <Redirect exact path="/" to="/home" />
                  <Route exact path="/home" component={Home} />
                  <Route exact path="/profile/:username" component={Profile} />
                  <Route
                    exact
                    path="/tweet/:username/:tweetId"
                    component={TweetPage}
                  />
                  <Route exact path="/:username/lists" component={ListPage} />
                  <Route exact path="/:username/lists" component={ListPage} />
                  <Route exact path="/list/:listId" component={ListDetails} />
                  <AuthRoute path="/bookmarks" component={Booksmarks} />
                  <Route path="/messages" component={Conversations} />
                  <Route path="*" component={Home} />
                </Switch>
              </div>
              <div className="sidebar">
                <Route path="/home" component={Feed} />
                <Route path="/messages" component={ActiveConversation} />
              </div>
            </>
          ) : (
            <>
              <AuthRoute exact path="/login" component={Login} />
              <AuthRoute exact path="/signup" component={Signup} />
            </>
          )}
        </div>
      </Router>
    </div>
  );
}

export default App;
