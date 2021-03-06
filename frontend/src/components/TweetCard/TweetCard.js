import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useState } from "react";
import { ICON_DELETE, ICON_REPLY, ICON_RETWEET, ICON_SHARE } from "../../helpers/Icons";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import "./tweetCard.css";
import "../../pages/Home/home.css";
import LikeButton from "../../helpers/likeButton";
import { deleteTweet, addBookmarks } from "../../redux/actions/dataActions";
import CommentModal from "../CommentModal/CommentModal";

const TweetCard = ({ tweet }) => {
  dayjs.extend(relativeTime);
  const authenticated = useSelector((state) => state.user.authenticated);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const history = useHistory();

  const toggleModal = () => {
    if (!authenticated) {
      return history.push("/");
    }

    setOpen((prev) => !prev);
  };
  const handleDelete = (id) => {
    if (!window.confirm("Do you want to delete this tweet ?")) {
      return;
    }
    setTimeout(() => {
      dispatch(deleteTweet(id));
    }, 500);
  };
  const addToBooksmarks = (id) => {
    dispatch(addBookmarks(id));
  };
  return (
    <div className="Tweet_card_wrapper">
      {tweet?.parent && (
        <p className="is_reply">Reply to @{tweet.parent.username}</p>
      )}
      <div className="Tweet_card">
        <div className="card_content_wrapper">
          <div className="card_content_header">
            <div className="card_user_ProfileImage">
              <a href={`/profile/${tweet?.user.username}`}>
                <img
                  style={{ borderRadius: "50%", minWidth: "49px" }}
                  width="100%"
                  height="49px"
                  src={tweet?.user.profileImg ?? tweet?.user.profileImage}
                  alt="profileImage"
                />
              </a>
            </div>
            <div className="card_header_details">
              <div className="card_header_deltails_left">
                <span className="card_header_user">{tweet?.user.name}</span>
                <span className="card_header_username">
                  @{tweet?.user.username}
                </span>
                <span className="card_header_date">
                  {dayjs(tweet?.createdAt).fromNow()}
                </span>
              </div>
              {user?._id === tweet?.user?._id && (
                <div
                  className="card_header_details_right"
                  onClick={() => handleDelete(tweet?._id)}
                >
                  <ICON_DELETE />
                </div>
              )}
            </div>
            <div className="card_content_header_more"></div>
          </div>
          <div
            onClick={() =>
              history.push(`/tweet/${tweet?.user.username}/${tweet?._id}`)
            }
            className="card_content_infos"
          >
            {tweet?.body}
          </div>
          <div className="card_content_image">
            {tweet?.image.length > 0 &&
              tweet.image.map((image) => (
                <div key={image} className="card_image_link">
                  <img src={image} alt="imageContent" />
                </div>
              ))}
          </div>
          <div className="card_buttons_wrapper">
            <div className="card_button_wrap reply_wrap">
              <div className="card_icon reply_icon" onClick={toggleModal}>
                <ICON_REPLY
                  styles={{
                    fill: "rgb(101, 119, 134)",
                    width: "18.75px",
                    height: "18.75px",
                  }}
                />
              </div>
              <div className="card_icon_value">{tweet?.replies.length}</div>
            </div>
            <div className="card_button_wrap retweet_wrap">
              <div className="card_icon retweet_icon">
                <ICON_RETWEET
                  styles={{
                    fill: "rgb(101, 119, 134)",
                    width: "18.75px",
                    height: "18.75px",
                  }}
                />
              </div>
              <div className="card_icon_value">{tweet?.retweets.length}</div>
            </div>
            <div className="card_button_wrap heart_wrap">
              <LikeButton tweetId={tweet?._id} />
              <div className="card_icon_value">
                {tweet?.likes.length > 0 ? tweet?.likes.length : ""}
              </div>
            </div>
            <div className="card_button_wrap">
              <div
                className="card_icon share_icon"
                onClick={() => addToBooksmarks(tweet._id)}
              >
                <ICON_SHARE
                  styles={{
                    fill: "rgb(101, 119, 134)",
                    width: "18.75px",
                    height: "18.75px",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {authenticated && (
        <CommentModal toggleModal={toggleModal} tweet={tweet} open={open} />
      )}
    </div>
  );
};
export default TweetCard;
