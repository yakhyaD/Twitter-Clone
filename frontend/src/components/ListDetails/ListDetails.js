import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getListDetails, followList } from "../../redux/actions/dataActions";

// import icons and stuff
import "./listdetails.css";
import { ICON_ARROWBACK, ICON_SHARE, ICON_SETTINGS } from "../../helpers/Icons";
import TweetCard from "../TweetCard/TweetCard";

const ListDetails = () => {
  const { listId } = useParams();
  const dispatch = useDispatch();
  const list = useSelector((state) => state.data.list);
  const user = useSelector((state) => state.user.user);
  const authenticated = useSelector((state) => state.user.authenticated);
  const [followed, setFollow] = useState(false);

  useEffect(() => {
    dispatch(getListDetails(listId));
  }, [dispatch, listId]);

  useEffect(() => {
    if (list && list.users.includes(user?._id)) {
      setFollow(true);
      return;
    }
    setFollow(false);
  }, [list, user]);

  const handleFollow = () => {
    dispatch(followList(user.username, listId, user._id));
  };
  return (
    <div className="list-wrapper">
      <div className="list-header-wrapper">
        <div className="list-header-left">
          <div
            onClick={() => window.history.back()}
            className="header-back-wrapper"
          >
            <ICON_ARROWBACK />
          </div>
          <div className="list-header-text">
            <div className="list-header-title">Lists</div>
            <div className="list-header-name">@username</div>
          </div>
        </div>
        <div className="list-header-right">
          <div className="list-header-add">
            <ICON_SHARE styles={{ width: "28px", height: "28px" }} />
          </div>
          <div className="list-header-more">
            <ICON_SETTINGS styles={{ width: "28px", height: "28px" }} />
          </div>
        </div>
      </div>
      <div className="list-banner-wrapper">
        <img
          src="https://pbs-o.twimg.com/media/EXZ3BXhUwAEFNBE?format=png&name=small"
          alt="banner"
        />
      </div>
      <div className="list-info-wrapper">
        <div className="list-info-title">List Title</div>
        <div className="list-info-description">
          lorem ipsum dolor sit amet, consectetur adip.lorem ipsum dolor sit
          amet.
        </div>
        <div className="list-info-author">
          <a href="/">Name</a> @username
        </div>
        <div className="list-info-member">
          {/* <span><strong>{list?.users.length} </strong>members</span> */}
          <span>
            <strong>{list?.users.length} </strong>followers
          </span>
        </div>
        {authenticated && (
          <div
            className={
              followed ? "list-info-button-active" : "list-info-button"
            }
            onClick={handleFollow}
          >
            <span>{followed ? "Following" : "Follow"}</span>
          </div>
        )}
      </div>
      <div className="list-tweets-wrapper">
        {list?.tweets.map((tweet) => (
          <TweetCard key={tweet._id} tweet={tweet} />
        ))}
      </div>
    </div>
  );
};

export default ListDetails;
