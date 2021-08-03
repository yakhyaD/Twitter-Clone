import React from "react";
import { ICON_HEART, ICON_HEARTFULL } from "./Icons";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { likeTweet, unlikeTweet } from "../redux/actions/dataActions";

const LikeButton = ({ tweetId }) => {
  const user = useSelector((state) => state.user.user);
  const authenticated = useSelector((state) => state.user.authenticated);
  const dispatch = useDispatch();

  const favTweet = (id) => {
    isLiked() ? dispatch(unlikeTweet(id)) : dispatch(likeTweet(id));
  };
  const isLiked = () => {
    if (user && user.likes.find((id) => id === tweetId)) {
      return true;
    }
    return false;
  };

  return (
    <>
      {!authenticated ? (
        <Link to="/login">
          <ICON_HEART
            styles={{
              fill: "rgb(101, 119, 134)",
              width: "18.75px",
              height: "18.75px",
            }}
          />
        </Link>
      ) : (
        <div onClick={() => favTweet(tweetId)} className="card-icon heart-icon">
          {isLiked() ? (
            <ICON_HEARTFULL styles={{ fill: "rgb(224, 36, 94)" }} />
          ) : (
            <ICON_HEART />
          )}
        </div>
      )}
    </>
  );
};

export default LikeButton;
