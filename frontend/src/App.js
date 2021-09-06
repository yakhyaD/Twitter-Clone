import React, { lazy, Suspense } from "react";
import "./App.css";
import Login from "./pages/Login/Login";
import Profile from "./pages/Profile/Profile";
import Signup from "./pages/Signup/Signup";
import TweetPage from "./pages/Tweet/Tweet";
import AuthRoute from "./helpers/AuthRoute";
import ListPage from "./components/List/List";
import ListDetails from "./components/ListDetails/ListDetails";
import Booksmarks from "./pages/Booksmarks/Booksmarks";
import Conversations from "./pages/Conversations/Conversations";
import Chat from "./components/Chat/Chat";
import Spinner from "./helpers/Spinner";
import StartChatModal from "./components/ChatModal/StartChatModal";
import FlashMessage from './components/FlashMessage/FlashMessage';
import Navbar from './components/Navbar/Navbar';

// Import modules
import { getUserData, setAuthenticated, logoutUser } from "./redux/actions/userActions";
import {BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import store from "./redux/store";
import jwtDecode from "jwt-decode";

const Home = lazy(() => import('./pages/Home/Home'))
const Feed = lazy(() => import("./components/Feed/Feed"));

//check if token is valid or expired
const token = localStorage.getItem("FBIdToken");
if (token) {
  const decodedToken = jwtDecode(token);
  console.log(decodedToken.exp, Date.now() / 1000);
  if (decodedToken && decodedToken.exp * 1000 < Date.now()) {
      store.dispatch(logoutUser());
  }else{
      setAuthenticated(token);
      store.dispatch(getUserData());
  }
}


const defaultContainer = () => {
  return (
    <div className="body-wrap">
      <FlashMessage  />
      <StartChatModal />
      <Suspense fallback={<Spinner size={{ width: "20px", height: "20px" }} />}>
        <div className="header">
          <Navbar />
        </div>
      </Suspense>
      <Suspense fallback={<Spinner size={{ width: "20px", height: "20px" }} />}>
        <div className="main">
          <Switch>
            <Redirect exact path="/" to="/home" />
            <Route exact path="/home" component={Home} />
            <AuthRoute path="/bookmarks" component={Booksmarks} />
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
      </Suspense>
      <Suspense fallback={<Spinner size={{ width: "200px", height: "150px" }} />}>
        <div className="sidebar">
          <Route path="/home" component={Feed} />
          <Route path="/tweet/:username/:tweetId" component={Feed} />
          <Route path="/messages" component={Chat} />
          <Route path="/profile/:username" component={Feed} />
          <Route path="/explorer" component={Feed} />
        </div>
      </Suspense>
    </div>
  )

}
function App() {
  return (
    <div>
      <Router>
        <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
            <Route  component={defaultContainer} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
