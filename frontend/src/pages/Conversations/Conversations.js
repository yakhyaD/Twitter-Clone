import React, { useEffect } from "react";
import "./style.css";

import { useDispatch, useSelector } from "react-redux";
import { getConversations, getConversation } from "../../redux/actions/chatActions";
import {ICON_ARROWBACK, ICON_NEWMSG, ICON_SEARCH, ICON_SETTINGS } from "../../helpers/Icons";
import Spinner from "../../helpers/Spinner";
import { startChat } from "../../redux/actions/uiActions";

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
  const newConversation = () => {
    dispatch(startChat())
  }

  const cardMarkup = (conversation) => {
    const sender = conversation?.participants?.find(
      (participant) => participant._id !== user._id
    );
    const length = conversation.messages.length ? conversation.messages.length -1 : 0
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
              {conversation.messages.length ? conversation.messages[length].content : ""}
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
          <div className="icon" onClick={() => newConversation()}>
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
        <div className="chat-search-icon">
          <ICON_SEARCH styles={{ width: "26.25px", height: "26.25px" }} />
        </div>
        <input
          type="text"
          placeholder="search for people and groups"
          className="search-input"
        />
      </div>
      <div className="chat-list">
        {loading ? (
          <Spinner size={{width: "30px", height: "30px"}} />
        ) : conversations?.length   ? (
          conversations?.map((conversation) => cardMarkup(conversation))
        ) : (
          <h3>There is no conversations</h3>
        )}
      </div>
    </div>
  );
};

export default Conversations;
