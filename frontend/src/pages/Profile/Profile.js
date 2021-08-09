import React, { useState, useEffect, Fragment } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Loader from "../../components/Loader/Loader";
import "./profile.css";
import { ICON_ARROWBACK, ICON_MARKDOWN, ICON_DATE } from "../../helpers/Icons";
import { getUserProfile, followUser } from "../../redux/actions/userActions";
import TweetCard from "../../components/TweetCard/TweetCard";
import EditProfile from "../EditProfile/EditProfile";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("Tweets");
  const { username } = useParams();
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.user.profile);
  const user = useSelector((state) => state.user.user);
  const authenticated = useSelector((state) => state.user.authenticated);
  const loading = useSelector((state) => state.user.loading);

  const [open, setOpen] = useState(false);

  const changeTab = (tab) => {
    setActiveTab(tab);
  };

  const isMyProfile = () => {
    return user._id === profile?._id;
  };

  const isFollowing = () => {
    return user.following.includes(profile?._id) ? true : false;
  };

  const handleFollow = () => {
    dispatch(followUser(profile._id));
  };

  const toggleModal = () => {
    if (!isMyProfile()) {
      return;
    }

    setOpen((prev) => !prev);
  };

  useEffect(() => {
    dispatch(getUserProfile(username));
  }, [dispatch, username]);

  return (
    <Fragment>
      {!loading ? (
        <div className="profile-wrapper">
          <div className="profile-header-wrapper">
            <div className="profile-header-back">
              <div
                onClick={() => window.history.back()}
                className="header-back-wrapper"
              >
                <ICON_ARROWBACK />
              </div>
            </div>
            <div className="profile-header-content">
              <div className="profile-header-name">{profile?.name}</div>
              <div className="profile-header-tweets">
                {profile?.tweets.length} Tweets
              </div>
            </div>
          </div>
          <div className="profile-banner-wrapper">
            <img src={profile?.banner} alt="banner" />
          </div>
          <div className="profile-details-wrapper">
            <div className="profile-options">
              <div className="profile-image-wrapper">
                <img src={profile?.profileImg ?? profile?.profileImage} alt="profileImage" />
              </div>
              {authenticated ? (
                isMyProfile() ? (
                  <div className="profile-edit-button" onClick={toggleModal}>
                    <span>Edit profile</span>
                  </div>
                ) : (
                  <div
                    onClick={handleFollow}
                    className={
                      isFollowing()
                        ? "profile-edit-button-active"
                        : "profile-edit-button"
                    }
                  >
                    <span>{isFollowing() ? "Following" : "Follow"}</span>
                  </div>
                )
              ) : null}
            </div>
            <div className="profile-details-box">
              <div className="profile-name">{profile?.name}</div>
              <div className="profile-username">@{profile?.username}</div>
              <div className="profile-bio">{profile?.description}</div>
              <div className="profile-info-box">
                <ICON_MARKDOWN />
                <div className="profile-location">{profile?.location}</div>
                <ICON_DATE />
                <div className="profile-date"> Joined April 2012 </div>
              </div>
            </div>
            <div className="profile-social-box">
              <div className="follow-num"> {profile?.following.length} </div>
              <div className="follow-text"> Following </div>
              <div className="follow-num"> {profile?.followers.length} </div>
              <div className="follow-text"> Followers </div>
            </div>
          </div>
          <div className="profile-nav-menu">
            <div
              onClick={() => changeTab("Tweets")}
              className={
                activeTab === "Tweets"
                  ? `profile-nav-item activeTab`
                  : `profile-nav-item`
              }
            >
              Tweets
            </div>
            <div
              onClick={() => changeTab("Media")}
              className={
                activeTab === "Media"
                  ? `profile-nav-item activeTab`
                  : `profile-nav-item`
              }
            >
              Media
            </div>
            <div
              onClick={() => changeTab("Likes")}
              className={
                activeTab === "Likes"
                  ? `profile-nav-item activeTab`
                  : `profile-nav-item`
              }
            >
              Likes
            </div>
          </div>
          <div className="tweets">
            {activeTab === "Tweets"
              ? profile?.tweets.map((tweet) => (
                  <TweetCard tweet={tweet} key={tweet?._id} />
                ))
              : activeTab === "Likes"
              ? profile?.likes?.map((tweet) => (
                  <TweetCard tweet={tweet} key={tweet?._id} />
                ))
              : "Medias"}
          </div>
        </div>
      ) : (
        <div className="profile_loader">
          <Loader />
        </div>
      )}
      {profile && (
        <EditProfile profile={profile} open={open} toggleModal={toggleModal} />
      )}
    </Fragment>
  );
};

export default Profile;
