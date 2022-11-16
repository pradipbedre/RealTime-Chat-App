import React, { useEffect, useState } from "react";
import { user } from "../Join/Join.js";
import socketIO from "socket.io-client";
import sendbtn from "../../images/sendbtn.png";
import "./chat.css";
import Message from "../messages/Message";
import ReactScrollToBottom from "react-scroll-to-bottom";

const ENDPOINT = "http://localhost:2000/";
let socket;

const Chat = () => {
  const [userid, setId] = useState("");
  const [messages, setMessage] = useState([]);

  // send message to to server when button is clicked
  const send = () => {
    const message = document.getElementById("chat-input").value;
    socket.emit("message", { message, userid });
    document.getElementById("chat-input").value = null;
  };
  /*  console.log(messages);
  console.log(userid); */

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
      setMessage([...messages, data]);
      console.log(data.user, data.message);
    });

    // when user join
    socket.on("userjoined", (data) => {
      setMessage([...messages, data]);
      console.log(data.user, data.message);
    });

    // when user leave
    socket.on("leave", (data) => {
      setMessage([...messages, data]);
      console.log(data.user, data.message);
    });

    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, []);

  useEffect(() => {
    socket.on("sendMsg", (data) => {
      setMessage([...messages, data]);
      console.log(data.user, data.message, data.userid);
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
          <a href="/"> <i class="fa-solid fa-xmark"/></a>
         
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
          <input type="text" id="chat-input" />
          <button className="send-btn" onClick={send}>
            <img src={sendbtn} alt="sendbutton" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
