import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import "./feed.css";
import {
  getFollowSuggestion,
  getTrendings,
  searchUser,
  searchTrend,
} from "../../redux/actions/userActions";
import { ICON_SEARCH, ICON_SETTINGS, ICON_CLOSE } from "../../utils/Icons";
import Loader from "../Loader/Loader";
import { useHistory } from "react-router-dom";
import { useState } from "react";

const Feed = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((state) => state.user.user);
  const authenticated = useSelector((state) => state.user.authenticated);
  const userResults = useSelector((state) => state.user.searchUserResult);
  const trendResults = useSelector((state) => state.user.searchTrendResult);
  const loading = useSelector((state) => state.user.loading);
  const [openSearchBar, setOpenSearchBar] = useState(false);

  const suggestionsFollowers = useSelector(
    (state) => state.user.suggestionsFollowers
  );
  const loadongSuggestions = useSelector(
    (state) => state.user.loadongSuggestions
  );
  const trends = useSelector((state) => state.user.trends);
  const loadingTrend = useSelector((state) => state.user.loadingTrend);
  useEffect(() => {
    if (authenticated) {
      dispatch(getFollowSuggestion(user.username));
    }
    return;
  }, [dispatch, user, authenticated]);

  useEffect(() => {
    dispatch(getTrendings());
  }, [dispatch]);

  const handleSearch = (e) => {
    const query = e.target.value;
    if (query.trim() === "") {
      setOpenSearchBar(false);
      return;
    }
    setOpenSearchBar(true);
    if (query.startsWith("@")) {
      dispatch(searchUser(query.split("@")[1]));
    }
    dispatch(searchTrend(query));
  };
  return (
    <div
      className="feed-wrapper"
      style={{ display: authenticated ? "flex" : "none" }}
    >
      <div className="search-bar-section">
        <div className="search-input">
          <div>
            <div className={openSearchBar ? "search-icon-open" : "search-icon"}>
              <ICON_SEARCH styles={{ width: "26.25px", height: "26.25px" }} />
            </div>
            <input type="text" placeholder="Search" onChange={handleSearch} />
          </div>
          <div
            className="search-results"
            style={{ display: openSearchBar ? "flex" : "none" }}
          >
            <div className="trend-results">
              {trendResults
                ? trendResults.map((trend, index) => (
                    <div key={index}>{trend.body}</div>
                  ))
                : "No result"}
            </div>
            {userResults &&
              userResults.map((user) => (
                <div key={user._id} className="result-item">
                  <div className="item-user-profile">
                    <a href="/">
                      <img
                        style={{ borderRadius: "50%", minWidth: "49px" }}
                        width="100%"
                        height="49px"
                        src={user.profileImg}
                        alt="profileImage"
                      />
                    </a>
                  </div>
                  <div className="item-infos">
                    <div className="item-name">{user.name}</div>
                    <div className="item-details">{user.username}</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      {!loadingTrend ? (
        <div className="trend-section">
          <div className="trend-header">
            <h2>Trend for you</h2>
            <div className="more-icon">
              <ICON_SETTINGS styles={{ width: "26.25px", height: "26.25px" }} />
            </div>
          </div>
          <div className="trending-list">
            <div className="trending-list-item">
              {trends
                ? trends.map((trend, index) => (
                    <div key={index} className="list-item-card">
                      <div className="item-infos">
                        <span>Trending</span>
                        <h3>{trend.content}</h3>
                        <p>{trend.count} tweet(s)</p>
                      </div>
                      <div className="more-icon">
                        <ICON_SETTINGS
                          styles={{ width: "26.25px", height: "26.25px" }}
                        />
                      </div>
                    </div>
                  ))
                : "No more trends"}
              <div className="item-more-infos">Show more</div>
            </div>
          </div>
        </div>
      ) : (
        <Loader />
      )}
      <div className="suggestion-followers-section">
        {!loadongSuggestions ? (
          <>
            <div className="suggestion-header">Topic to follow</div>
            <div className="followers-group">
              {suggestionsFollowers
                ? suggestionsFollowers?.map((user) => (
                    <div key={user?._id} className="followers-item">
                      <div
                        className="item-user"
                        onClick={() =>
                          history.push(`/profile/${user?.username}`)
                        }
                      >
                        <div className="item-user-profile">
                          <a href={`/profile/${user.username}`}>
                            <img
                              style={{ borderRadius: "50%", minWidth: "49px" }}
                              width="100%"
                              height="49px"
                              src={user.profileImg}
                              alt="profileImage"
                            />
                          </a>
                        </div>
                        <div className="item-infos">
                          <div className="item-name">{user?.name}</div>
                          <div className="item-details">@{user?.username}</div>
                        </div>
                      </div>
                      <div className="item-buttons">
                        <div className="follow-btn">Follow</div>
                        <div className="ignore-btn">
                          <ICON_CLOSE
                            styles={{ width: "26.25px", height: "26.25px" }}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                : "No suggestions"}
            </div>
            <div className="item-more-infos">Show more</div>
          </>
        ) : (
          <Loader />
        )}
      </div>
      <div className="suggestion-list-section">
        <div className="suggestion-header">Topic to follow</div>
        <div className="list-group">
          <div className="list-item">
            <div className="item-infos">
              <div className="item-name">List Name</div>
              <div className="item-details">Details</div>
            </div>
            <div className="item-buttons">
              <div className="follow-btn">Follow</div>
              <div className="ignore-btn">
                <ICON_CLOSE styles={{ width: "26.25px", height: "26.25px" }} />
              </div>
            </div>
          </div>
          <div className="list-item">
            <div className="item-infos">
              <div className="item-name">List Name</div>
              <div className="item-details">Details</div>
            </div>
            <div className="item-buttons">
              <div className="follow-btn">Follow</div>
              <div className="ignore-btn">
                <ICON_CLOSE styles={{ width: "26.25px", height: "26.25px" }} />
              </div>
            </div>
          </div>
          <div className="list-item">
            <div className="item-infos">
              <div className="item-name">List Name</div>
              <div className="item-details">Details</div>
            </div>
            <div className="item-buttons">
              <div className="follow-btn">Follow</div>
              <div className="ignore-btn">
                <ICON_CLOSE styles={{ width: "26.25px", height: "26.25px" }} />
              </div>
            </div>
          </div>
          <div className="list-item">
            <div className="item-infos">
              <div className="item-name">List Name</div>
              <div className="item-details">Details</div>
            </div>
            <div className="item-buttons">
              <div className="follow-btn">Follow</div>
              <div className="ignore-btn">
                <ICON_CLOSE styles={{ width: "26.25px", height: "26.25px" }} />
              </div>
            </div>
          </div>
          <div className="list-item">
            <div className="item-infos">
              <div className="item-name">List Name</div>
              <div className="item-details">Details</div>
            </div>
            <div className="item-buttons">
              <div className="follow-btn">Follow</div>
              <div className="ignore-btn">
                <ICON_CLOSE styles={{ width: "26.25px", height: "26.25px" }} />
              </div>
            </div>
          </div>
        </div>
        <div className="item-more-infos">Show more</div>
      </div>
    </div>
  );
};

export default Feed;
