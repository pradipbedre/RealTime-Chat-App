import React, { useState } from "react";
import logo from "../../images/logo.png";
import "./join.css";
import { Link } from "react-router-dom";

let user;
const sendUser = () => {
  user = document.getElementById("join-input").value;
  document.getElementById("join-input").value = "";
  // console.log(user)
};
const Join = () => {
  const [name, setName] = useState("");
  return (
    <div className="join-page">
      <div className="join-container">
        <img src={logo} alt="" />
        <input
          onChange={(e) => {
            setName(e.target.value);
          }}
          placeholder="Enter Your Name"
          type="text"
          id="join-input"
        />
        <Link onClick={(e) => (!name ? e.preventDefault() : null)} to="/chat">
          <button onClick={sendUser} className="join-btn">
            Login
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Join;
export { user };
