import React, { useEffect, useState, useRef } from "react";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import {
  ICON_GIF,
  ICON_IMGUPLOAD,
  ICON_SEND,
  ICON_SETTINGS,
} from "../../../utils/Icons";
import { useHistory } from "react-router";
import { sendMessage } from "../../../redux/actions/chatActions";
import { token } from "../../../redux/actions/userActions";

const ENDPOINT = "http://localhost:5000";

const ActiveConversation = () => {
  const conversation = useSelector((state) => state.chat.conversation);
  const history = useHistory();
  const dispatch = useDispatch();
  const messageBody = useRef();
  const [chat, setChat] = useState([]);
  const [room, setRoom] = useState(null);
  const [text, setText] = useState("");
  const [socket, setSocket] = useState(null);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    let newScoket = io(ENDPOINT, { query: { token: token() } });
    setSocket(newScoket);
    return () => newScoket.close();
  }, []);

  useEffect(() => {
    if (conversation) {
      setChat((messages) => [...messages, ...conversation.messages]);
    }
  }, [conversation]);

  useEffect(() => {
    if (conversation) {
      getChat(conversation._id);
    }
    if (room) {
      socket.emit("leaveRoom", room);
      return () => socket.off();
    }
  }, [history.location.pathname]);

  const addMessageToConversation = (message) => {
    console.log(message);
    setChat((messages) => [...messages, message]);
    dispatch(sendMessage(message));
  };

  const sendMsg = () => {
    if (text.length > 0) {
      let id =
        conversation?.participants[0] !== user?._id
          ? conversation.participants[0]._id
          : conversation.participants[1]._id;
      socket.emit("chat", { room: room, id, content: text });
      //setChat((chat) => [...chat, { room: room, id, content: text }]);
    }
  };

  useEffect(() => {
    if (socket == null) return;

    socket?.emit("subscribe", room);

    socket?.on("output", (message) => addMessageToConversation(message));

    console.log(chat);

    return () => socket?.off("output");
  }, [chat, socket]);

  const getChat = (id) => {
    if (room) {
      socket?.emit("leaveRoom", room);
    }
    socket?.emit("subscribe", id);
    setRoom(id);
  };
  //const startConversation = (params) => setChat(params);

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      sendMsg();
    }
  };

  const noMessageMarkup = (
    <div className="none-selected">
      <h2>You don't have a message selected</h2>
      <p>Choose one fro your existing messages, or start a new one.</p>
      <div
        className="newMessage-btn"
        //onClick={() => startConversation(conversation)}
      >
        New Message
      </div>
    </div>
  );
  const conversationMarkup = () => {
    const { participants } = conversation;
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
          {chat?.map((message) => (
            <div
              key={message?._id}
              className={
                isMe(message?.sender?._id)
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
            <input
              onChange={(e) => setText(e.target.value)}
              type="text"
              placeholder="Start new message"
            />
          </div>
          <div className="btn-send" onClick={sendMsg} onKeyDown={handleKeyDown}>
            <ICON_SEND styles={{ width: "26.25px", height: "26.25px" }} />
          </div>
        </div>
      </>
    );
  };
  return (
    <div className="messages-wrapper" ref={messageBody}>
      {conversation ? conversationMarkup() : noMessageMarkup}
    </div>
  );
};

export default ActiveConversation;
