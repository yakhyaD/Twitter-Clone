import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { getBookmarks } from "../../redux/actions/userActions";
import TweetCard from "../../components/TweetCard/TweetCard";
import Loader from "../../components/Loader/Loader";
import "./style.css";
import { ICON_ARROWBACK } from "../../helpers/Icons";

const Booksmarks = () => {
  const user = useSelector((state) => state.user.user);
  const loading = useSelector((state) => state.user.loading);
  const bookmarks = useSelector((state) => state.user.bookmarks);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getBookmarks(user?.username));
  }, [dispatch, user]);
  return (
    <div className="tweet-wrapper">
      {loading ? (
        <div className="loader">
          <Loader />
        </div>
      ) : (
        <>
          <div className="header">
            <div
              onClick={() => window.history.back()}
              className="header-back-wrapper"
            >
              <ICON_ARROWBACK />
            </div>
            <div className="header-text">
              <div className="header-title">Booksmarks</div>
              <div className="header-name">@{user?.username}</div>
            </div>
          </div>
          <div className="tweet-wrap">
            {bookmarks?.map((tweet) => (
              <TweetCard tweet={tweet} key={tweet._id} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Booksmarks;
