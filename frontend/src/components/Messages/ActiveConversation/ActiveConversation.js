import React, { Fragment, useEffect } from "react";
import "./style.css";
import { useSelector } from "react-redux";

const ActiveConversation = () => {
  const conversation = useSelector((state) => state.chat.conversation);
  const user = useSelector((state) => state.user.user);
  const noMessageMarkup = (
    <div className="none-selected">
      <h2>You don't have a message selected</h2>
      <p>Choose one fro your existing messages, or start a new one.</p>
      <div className="newMessage-btn">New Message</div>
    </div>
  );
  const conversationMarkup = () => {
    const { participants, messages } = conversation;
    const sender = participants.find(
      (participant) => participant._id !== user._id
    );
    return (
      <>
        <div className="header">
          <div className="left-side">
            <div className="profile">Profile Image</div>
            <div className="user-infos">
              <div className="name">Name</div>
              <div className="username">@username</div>
            </div>
          </div>
          <div className="right-side">details icons</div>
        </div>
      </>
    );
  };
  return (
    <div className="messages-wrapper">
      {!conversation ? noMessageMarkup : "Conversation"}
    </div>
  );
};

export default ActiveConversation;
