import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "./Navbar.css";
import {
  ICON_LOGO,
  ICON_HOME,
  ICON_HASH,
  ICON_BELL,
  ICON_INBOX,
  ICON_BOOKMARK,
  ICON_LIST,
  ICON_USER,
  ICON_SETTINGS,
  ICON_FEATHER,
  ICON_LOGOUT,
} from "../../helpers/Icons";

import { logoutUser } from "../../redux/actions/userActions";
import { useDispatch, useSelector } from "react-redux";


const Navbar = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const authenticated = useSelector((state) => state.user.authenticated);
  const user = useSelector((state) => state.user.user);
  const [activeTab, setActiveTab] = useState("");

  const logout = () => {
    dispatch(logoutUser());
  };
  useEffect(() => {
    const url = history.location.pathname;
    const activeTab = (url.split("/")[1]).toLowerCase();

    (setActiveTab(activeTab))

  }, [history.location.pathname]);

  return (
    <div
      className="Nav-width"
      style={{ display: authenticated ? "flex" : "none" }}
    >
      <div className="Nav">
        <div className="Nav-Content">
          <div className="logo-wrapper">
            <ICON_LOGO
              styles={{
                fill: "rgb(29,161,242)",
                width: "47px",
                height: "30px",
              }}
            />
          </div>
          <nav className="Nav-wrapper">
            <Link
              to="/home"
              className={
                activeTab === "home" ? "Nav-link active-Nav" : "Nav-link"
              }
            >
              <div className="Nav-item-hover">
                <ICON_HOME styles={{ width: "26.25px", height: "26.25px" }} />
                <div className="Nav-item active-Nav">Home</div>
              </div>
            </Link>
            <Link
              to="/explorer"
              className={
                activeTab === "explore" ? "Nav-link active-Nav" : "Nav-link"
              }
            >
              <div className="Nav-item-hover">
                <ICON_HASH styles={{ width: "26.25px", height: "26.25px" }} />
                <div className="Nav-item">Explore</div>
              </div>
            </Link>
            <Link
              to="/notifications"
              className={
                activeTab === "notifications"
                  ? "Nav-link active-Nav"
                  : "Nav-link"
              }
            >
              <div className="Nav-item-hover">
                <ICON_BELL styles={{ width: "26.25px", height: "26.25px" }} />
                <div
                  className={
                    activeTab === "notifications"
                      ? "Nav-item active-Nav"
                      : "Nav-item"
                  }
                >
                  Notifications
                </div>
              </div>
            </Link>
            <Link
              to="/messages"
              className={
                activeTab === "messages" ? "Nav-link active-Nav" : "Nav-link"
              }
            >
              <div className="Nav-item-hover">
                <ICON_INBOX styles={{ width: "26.25px", height: "26.25px" }} />
                <div
                  className={
                    activeTab === "messages"
                      ? "Nav-item active-Nav"
                      : "Nav-item"
                  }
                >
                  Messages
                </div>
              </div>
            </Link>
            <Link
              to="/bookmarks"
              className={
                activeTab === "bookmarks" ? "Nav-link active-Nav" : "Nav-link"
              }
            >
              <div className="Nav-item-hover">
                <ICON_BOOKMARK
                  styles={{ width: "26.25px", height: "26.25px" }}
                />
                <div
                  className={
                    activeTab === "bookmarks"
                      ? "Nav-item active-Nav"
                      : "Nav-item"
                  }
                >
                  Bookmarks
                </div>
              </div>
            </Link>
            <Link
              to={`/${user?.username}/lists`}
              className={
                activeTab === "lists" ? "Nav-link active-Nav" : "Nav-link"
              }
            >
              <div className="Nav-item-hover">
                <ICON_LIST styles={{ width: "26.25px", height: "26.25px" }} />
                <div
                  className={
                    activeTab === "lists" ? "Nav-item active-Nav" : "Nav-item"
                  }
                >
                  Lists
                </div>
              </div>
            </Link>
            <Link
              to={`/profile/${user?.username}`}
              className={
                activeTab === "profile" ? "Nav-link active-Nav" : "Nav-link"
              }
            >
              <div className="Nav-item-hover">
                <ICON_USER styles={{ width: "26.25px", height: "26.25px" }} />
                <div
                  className={
                    activeTab === "profile" ? "Nav-item active-Nav" : "Nav-item"
                  }
                >
                  Profile
                </div>
              </div>
            </Link>
            <Link
              to="/settings"
              className={
                activeTab === "settings" ? "Nav-link active-Nav" : "Nav-link"
              }
            >
              <div className="Nav-item-hover">
                <ICON_SETTINGS
                  styles={{ width: "26.25px", height: "26.25px" }}
                />
                <div
                  className={
                    activeTab === "more" ? "Nav-item active-Nav" : "Nav-item"
                  }
                >
                  More
                </div>
              </div>
            </Link>
            <div className="Nav-tweet">
              <Link to="/" className="Nav-tweet-link">
                <div className="Nav-tweet-btn">
                  <span>
                    <ICON_FEATHER />
                  </span>
                </div>
              </Link>
            </div>
            {authenticated && (
              <div className="logout_link">
                <div className="logout_item" onClick={logout}>
                  <ICON_LOGOUT styles={{ width: "40px", height: "40px" }} />
                  <div className="Nav-item">Logout</div>
                </div>
              </div>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
