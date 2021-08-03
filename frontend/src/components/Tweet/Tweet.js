import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router";

import "./tweet.css";
import { ICON_ARROWBACK, ICON_DELETE,  ICON_REPLY, ICON_RETWEET, ICON_SHARE, } from "../../utils/Icons";
import {getOneTweet, likeTweet, deleteTweet, } from "../../redux/actions/dataActions";
import Loader from "../Loader/Loader";
import LikeButton from "../../utils/likeButton";
import CommentModal from "../CommentModal/CommentModal";

const TweetPage = () => {
  dayjs.extend(relativeTime);
  const { tweetId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const tweet = useSelector((state) => state.data.tweet);
  const loading = useSelector((state) => state.UI.loading);
  const authenticated = useSelector((state) => state.user.authenticated);
  const [open, setOpen] = useState(false);


  useEffect(() => {
    dispatch(getOneTweet(tweetId));
  }, [dispatch, tweetId]);

  const favTweet = (id) => {
    dispatch(likeTweet(id));
  };

  const toggleModal = () => {
    if (!authenticated) {
      return history.push("/");
    }
    setOpen((prev) => !prev);
  };
  const handleDelete = (id) => {
    if (window.confirm("Do you want to delete this tweet ?")) {
      dispatch(deleteTweet(id));
      history.push("/");
    }
    return;
  };

  // const tweetMarkup =
  //   tweet && Object.keys(tweet).length > 0 ? (

  //   ) : (
  //     <div className="loader">
  //       <Loader />
  //     </div>
  //   );
  return (
    <div className="wrapper">
       {tweet && Object.keys(tweet).length > 0 ? (<>
          <div className="tweet-header-wrapper">
            <div className="profile-header-back">
              <div
                onClick={() => window.history.back()}
                className="header-back-wrapper"
              >
                <ICON_ARROWBACK />
              </div>
            </div>
            <div className="tweet-header-content"> Tweet </div>
          </div>
          <div className="tweet-body-wrapper">
            <div className="tweet-header-content">
              <div className="header-left">
                <div className="tweet-user-pic">
                  <a href={`/profile/${tweet.user.username}`}>
                    <img
                      style={{ borderRadius: "50%", minWidth: "49px" }}
                      width="100%"
                      height="49px"
                      src={tweet.user.profileImg}
                      alt="profileImage"
                    />
                  </a>
                </div>
                <div className="tweet-user-wrap">
                  <div className="tweet-user-name">{tweet.user.name}</div>
                  <div className="tweet-username">@{tweet.user.username}</div>
                </div>
              </div>
              <div className="header-right">
                <div
                  className="card-icon delete-icon"
                  onClick={() => handleDelete(tweet._id)}
                >
                  <ICON_DELETE />
                </div>
              </div>
            </div>
            <div className="tweet-content">{tweet.body}</div>
            <div className="tweet-date">{dayjs(tweet?.createdAt).fromNow()}</div>
            <div className="tweet-stats">
              {tweet.retweets.length > 0 && (
                <div className="int-num">{tweet.retweets.length}</div>
              )}
              {tweet.retweets.length > 0 && (
                <div className="int-text"> Retweets </div>
              )}
              {tweet.likes.length > 0 && (
                <div className="int-num">{tweet.likes.length}</div>
              )}
              {tweet.likes.length > 0 && <div className="int-text"> Likes </div>}
            </div>
            <div className="tweet-interactions">
              <div className="tweet-int-icon" onClick={toggleModal}>
                <div className="card-icon reply-icon">
                  {" "}
                  <ICON_REPLY />{" "}
                </div>
              </div>
              <div className="tweet-int-icon">
                <div className="card-icon retweet-icon">
                  {" "}
                  <ICON_RETWEET />{" "}
                </div>
              </div>
              <div className="tweet-int-icon">
                <LikeButton tweetId={tweet._id} />
              </div>
              <div className="tweet-int-icon">
                <div className="card-icon share-icon">
                  {" "}
                  <ICON_SHARE />{" "}
                </div>
              </div>
            </div>
          </div>
          {tweet.replies.length > 0 ? (
            tweet.replies.map((reply) => (
              <div key={reply._id} className="tweet-replies-wrapper">
                <div className="reply-user-pic">
                  <a href="profile">
                    <img
                      style={{ borderRadius: "50%", minWidth: "49px" }}
                      width="100%"
                      height="49px"
                      src={reply.user.profileImg}
                      alt="profileImage"
                    />
                  </a>
                </div>
                <div className="reply-tweet-body">
                  <div>
                    <span className="tweet-user-name">{reply.user.name}</span>
                    <span className="reply-header-username">
                      @{reply.user.username}
                    </span>
                    <span className="reply-header-dot">·</span>
                    <span className="reply-header-date">{dayjs(reply.createdAt).fromNow()}</span>
                  </div>
                  <div className="tweet-owner">
                    <span className="reply-tweet-username">Replying to</span>
                    <span className="main-tweet-user">
                      @{reply.user.username}
                    </span>
                  </div>
                  <div className="reply-tweet-content">{reply.body}</div>
                  <div className="media-section">
                      {reply.image.length > 0 && reply.image.map((image, imageIdx) => (
                        <div key={imageIdx} className="img-container" >
                            <img src={image} alt="media" className={tweet.replies.length > 1 ?  "media-multiple" : "media"} />
                        </div>
                      ))}
                    </div>
                  <div className="reply-tweet-interactions">
                    <div className="reply-int-icon" onClick={toggleModal}>
                      <div className="card-icon reply-int reply-icon">
                        {" "}
                        <ICON_REPLY />{" "}
                      </div>
                      <div
                        onClick={() => favTweet(reply._id)}
                        className="card-icon-value"
                      >
                        {reply.replies.length === 0 ? "" : reply.replies.length}
                      </div>
                    </div>
                    <div className="reply-int-icon retweet-int">
                      <div className="card-icon reply-int retweet-icon">
                        {" "}
                        <ICON_RETWEET />{" "}
                      </div>
                      <div className="card-icon-value">
                        {reply.retweets.length === 0
                          ? ""
                          : reply.retweets.length}
                      </div>
                    </div>
                    <div className="reply-int-icon heart-int">
                      <LikeButton tweetId={reply._id} />
                      <div className="card-icon-value">
                        {reply.likes.length === 0 ? "" : reply.likes.length}
                      </div>
                    </div>
                    <div className="reply-int-icon">
                      <div className="card-icon reply-int share-icon">
                        {" "}
                        <ICON_SHARE />{" "}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-replies">There is no comment</div>
          )}
        </>) : (
          <div className="loader">
            <Loader />
          </div>
        )
      }
      {authenticated && !loading && (
        <CommentModal
          toggleModal={toggleModal}
          tweet={tweet}
          open={open}
        />
       )}
    </div>
  )
};

export default TweetPage;
