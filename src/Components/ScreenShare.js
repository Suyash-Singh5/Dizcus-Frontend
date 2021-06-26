import React, { Component } from "react";
import ButtonLogo from "../Images/ss2.png";
import "../Room.css";
import { Link } from "react-router-dom";
import "styled-components";

const ScreenShare = (props) => {
  let style = {};
  if (props.Streaming) {
    style = {
      backgroundColor: "blue",
      border: "0px",
    };
  }
  let ButtonText = <p className="buttonText">Screen Share</p>;
  return (
    <div>
      <div className="button-container">
        {ButtonText}
        <button onClick={props.action} className="Button Present" style={style}>
          <img
            className=""
            src={ButtonLogo}
            alt="Present Screen"
            style={{ borderRadius: "10px" }}
            width="45px"
            height="30px"
          ></img>
        </button>
      </div>
    </div>
  );
};

export default ScreenShare;
