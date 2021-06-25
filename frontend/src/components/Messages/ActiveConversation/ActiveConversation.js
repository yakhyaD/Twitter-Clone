import React, { Fragment, useEffect } from "react";
import "./style.css";
import { useSelector } from "react-redux";
import {
  ICON_GIF,
  ICON_IMGUPLOAD,
  ICON_SEND,
  ICON_SETTINGS,
} from "../../../utils/Icons";

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
    const sender = participants?.find(
      (participant) => participant?._id !== user?._id
    );
    const isMe = (id) => {
      return id === user?._id;
    };
    return (
      <>
        <div className="messages-header">
          <div className="left-side">
            <div className="profile">
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
            <div className="user-infos">
              <div className="name">{sender.name}</div>
              <div className="username">@{sender.username}</div>
            </div>
          </div>
          <div className="right-side">
            <ICON_SETTINGS styles={{ width: "26.25px", height: "26.25px" }} />
          </div>
        </div>
        <div className="chat-block">
          {messages?.map((message) => (
            <div
              key={message?.sender?._id}
              className={
                isMe(message.sender._id)
                  ? "message-block-fromMe"
                  : "message-block"
              }
            >
              <div
                className={
                  isMe(message.sender._id)
                    ? "sender-profile-fromMe"
                    : "sender-profile"
                }
              >
                <a href="/">
                  <img
                    style={{ borderRadius: "50%", minWidth: "49px" }}
                    width="100%"
                    height="49px"
                    src="https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg"
                    alt="profileImage"
                  />
                </a>
              </div>
              <div
                className={
                  isMe(message.sender._id) ? "message-infos-fromMe" : "message"
                }
              >
                <div className="message-content">{message.content}</div>
                <div className="message-date">24/05/21, 15:54</div>
              </div>
            </div>
          ))}
          <div className="message-block-fromMe">
            <div className="sender-profile-fromMe">
              <a href="/">
                <img
                  style={{ borderRadius: "50%", minWidth: "49px" }}
                  width="100%"
                  height="49px"
                  src="https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg"
                  alt="profileImage"
                />
              </a>
            </div>
            <div className="message-infos-fromMe">
              <div className="message-content">Content</div>
              <div className="message-date">24/05/21, 15:54</div>
            </div>
          </div>
          <div className="message-block">
            <div className="sender-profile">
              <a href="/">
                <img
                  style={{ borderRadius: "50%", minWidth: "49px" }}
                  width="100%"
                  height="49px"
                  src="https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg"
                  alt="profileImage"
                />
              </a>
            </div>
            <div className="message-infos">
              <div className="message-content">Content</div>
              <div className="message-date">24/05/21, 15:54</div>
            </div>
          </div>
        </div>
        <div className="send-input">
          <div className="icons">
            <div className="right-side">
              <ICON_IMGUPLOAD
                styles={{ width: "26.25px", height: "26.25px" }}
              />
            </div>
            <div className="right-side">
              <ICON_GIF styles={{ width: "26.25px", height: "26.25px" }} />
            </div>
          </div>
          <div className="input-field">
            <input type="text" placeholder="Start new message" />
          </div>
          <div className="btn-send">
            <ICON_SEND styles={{ width: "26.25px", height: "26.25px" }} />
          </div>
        </div>
      </>
    );
  };
  return (
    <div className="messages-wrapper">
      {!conversation ? noMessageMarkup : conversationMarkup()}
    </div>
  );
};

export default ActiveConversation;
