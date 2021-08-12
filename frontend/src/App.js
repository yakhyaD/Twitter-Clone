import "./App.css";
import React, { lazy, Suspense, useEffect } from "react";
import jwtDecode from "jwt-decode";
import Navbar from "./components/Navbar/Navbar";
import Login from "./pages/Login/Login";
import Profile from "./pages/Profile/Profile";
import Signup from "./pages/Signup/Signup";
import TweetPage from "./pages/Tweet/Tweet";
//import Home from "./pages/Home/Home";
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
import { useSelector } from "react-redux";
import StartChatModal from "./components/ChatModal/StartChatModal";

const Home = lazy(() => import('./pages/Home/Home'))

const token = localStorage.getItem("FBIdToken");
if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken && decodedToken.exp * 1000 < Date.now()) {
      store.dispatch(logoutUser());
  }else{
      setAuthenticated(token);
      store.dispatch(getUserData());
  }
}


function App() {
  const flashMessage = useSelector((state) => state.UI.flashMessage);
  const startChatModal = useSelector((state) => state.UI.startChatModal)
  useEffect(() => {
    if (startChatModal) {
      document.body.style.opacity = "0.9"
      return
    }
    return document.body.style.opacity = "1"
  }, [startChatModal])
  return (
    <div>
      <Router>
        <div className="body-wrap">
          {flashMessage && <div className="flash-message" style={{backgroundColor: flashMessage?.color}}>{flashMessage.msg}</div>}
          <StartChatModal open={startChatModal} />
          <div className="header">
            <Navbar />
          </div>
          <Suspense fallback={<Spinner size={{width: "200px", height: "150px"}} />}>
          <div className="main">
            <Switch>
              <Redirect exact path="/" to="/home" />
              <Route exact path="/home" component={Home} />
              <AuthRoute path="/bookmarks" component={Booksmarks} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/signup" component={Signup} />
              <AuthRoute path="/messages" component={Conversations} />
              <AuthRoute path="/explorer" component={Home} />
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
            <AuthRoute path="/tweet/:username/:tweetId" component={Feed} />
            <AuthRoute path="/messages" component={Chat} />
            <Route path="/profile/:username" component={Feed} />
            <Route path="/explorer" component={Feed} />
          </div>
          </Suspense>
        </div>
      </Router>
    </div>
  );
}

export default App;
