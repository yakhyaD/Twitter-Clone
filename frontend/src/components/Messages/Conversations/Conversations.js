import React, { useEffect } from "react";
import "./style.css";

import { useDispatch, useSelector } from "react-redux";
import {
  getConversations,
  getConversation,
} from "../../../redux/actions/chatActions";
import {
  ICON_ARROWBACK,
  ICON_NEWMSG,
  ICON_SEARCH,
  ICON_SETTINGS,
} from "../../../utils/Icons";

const Conversations = () => {
  const dispatch = useDispatch();
  const conversations = useSelector((state) => state.chat.conversations);
  const loading = useSelector((state) => state.chat.loading);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    dispatch(getConversations());
  }, [dispatch]);

  const selectConversation = (conversation) => {
    dispatch(getConversation(conversation));
  };

  const cardMarkup = (conversation) => {
    const sender = conversation.participants.find(
      (participant) => participant._id !== user._id
    );
    return (
      <div
        key={conversation._id}
        className="list-item"
        onClick={() => selectConversation(conversation)}
      >
        <div className="left-side">
          <div className="user-profile">
            <a href="/">
              <img
                style={{ borderRadius: "50%", minWidth: "49px" }}
                width="100%"
                height="49px"
                src={sender.profileImg}
                alt="profileImage"
              />
            </a>
          </div>
          <div className="chat-details">
            <div className="user-name">
              {sender.name}&#160;
              <span>@{sender.username}</span>
            </div>
            <div className="last-message">
              {conversation.messages[0].content}
            </div>
          </div>
        </div>
        <div className="message-date">1 jours</div>
      </div>
    );
  };
  return (
    <div className="chat-wrapper">
      <div className="chat-header">
        <div className="header-title">Messages</div>
        <div className="header-icons">
          <div className="icon">
            <ICON_SETTINGS styles={{ width: "26.25px", height: "26.25px" }} />
          </div>
          <div className="icon">
            <ICON_NEWMSG styles={{ width: "26.25px", height: "26.25px" }} />
          </div>
        </div>
      </div>
      <div className="chat-requests">
        <div>Message requests</div>
        <div className="arrow">&gt;</div>
      </div>
      <div className="search-bar">
        <div className="icon-arrowback">
          <ICON_ARROWBACK styles={{ width: "26.25px", height: "26.25px" }} />
        </div>
        <div className="search-icon">
          <ICON_SEARCH styles={{ width: "26.25px", height: "26.25px" }} />
        </div>
        <input
          type="text"
          placeholder="search for people and groups"
          className="search-input"
        />
      </div>
      <div className="chat-list">
        {!loading
          ? conversations?.map((conversation) => cardMarkup(conversation))
          : "Loading..."}
      </div>
    </div>
  );
};

export default Conversations;
