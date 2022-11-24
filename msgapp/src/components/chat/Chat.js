import React, { useEffect, useState } from "react";
import { user } from "../Join/Join.js";
import socketIO from "socket.io-client";
import sendbtn from "../../images/sendbtn.png";
import "./chat.css";
import Message from "../messages/Message";
import ReactScrollToBottom from "react-scroll-to-bottom";
import sentMusic from "../../music/sent.mp3";
import receiveMusic from "../../music/receive.mp3";

const ENDPOINT = "https://chatappbackend.onrender.com/";
let socket;

const Chat = () => {
  const [userid, setId] = useState("");
  const [messages, setMessage] = useState([]);

  // Musics
  const audioSent = new Audio(sentMusic);
  const audioReceive = new Audio(receiveMusic);

  // send message to to server when button is clicked
  const send = () => {
    audioSent.play();
    const message = document.getElementById("chat-input").value;
    socket.emit("message", { message, userid });
    document.getElementById("chat-input").value = null;
  };

  useEffect(() => {
    socket = socketIO(ENDPOINT, { transports: ["websocket"] });
    socket.on("connect", () => {
      alert("You Connect");
      setId(socket.id);
    });

    // when user joined
    socket.emit("joined", { user });

    // user receive message
    socket.on("welcome", (data) => {
      audioReceive.play();
      setMessage([...messages, data]);
      console.log(messages);
    });

    return () => {
      socket.off();
    };
  }, []);

  useEffect(() => {
    socket.on("sendMsg", (data) => {
      //audioReceive.play();
      setMessage([...messages, data]);
    });
    return () => {
      socket.off();
    };
  }, [messages]);

  return (
    <div className="chat-page">
      <div className="chat-container">
        <div className="header">
          <h2>Buddy Chat</h2>
          <a href="/">
            <i className="fa-solid fa-xmark" />
          </a>
        </div>
        <ReactScrollToBottom className="chat-box">
          {messages.map((item) => (
            <Message
              user={item.userid === userid ? "" : item.user}
              message={item.message}
              classs={item.userid === userid ? "right" : "left"}
            />
          ))}
        </ReactScrollToBottom>
        <div className="input-box">
          <input
            onKeyDown={(e) => (e.key === "Enter" ? send() : null)}
            type="text"
            id="chat-input"
          />
          <button className="send-btn" onClick={send}>
            <img src={sendbtn} alt="sendbutton" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
