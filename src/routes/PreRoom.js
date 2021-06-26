import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import MicButton from "../Components/MicButton";
import WebcamButton from "../Components/WebcamButton";
import { Link } from "react-router-dom";
const VideoBox = styled.video`
  height: 45vh;
  width: 60vh;
  border: 1px solid blue;
  border-radius: 10px;
  margin-top: 0px;
  margin-bottom: 0px;
  margin-left: 20vw;
  margin-top: 20vh;
`;

const micstyle = {
  position: "absolute",
  left: "60vw",
  top: "45vh",
  color: "white",
};

const camstyle = {
  position: "absolute",
  left: "70vw",
  top: "45vh",
  color: "white",
};

const joinstyle = {
  position: "absolute",
  left: "65vw",
  top: "55vh",
  color: "white",
  backgroundColor: "green",
  width: "6vw",
  height: "3vw",
  fontSize: "3vh",
  borderRadius: "1vh",
};

const PreRoom = () => {
  const userVid = useRef();

  useEffect(() => {
    dispVideoBox();
  }, []);

  const dispVideoBox = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        userVid.current.srcObject = stream;
      });
  };

  return (
    <div className="bg">
      <VideoBox ref={userVid} autoPlay playsInline />
      <button style={micstyle} className="Button">
        Mic
      </button>
      <button style={camstyle} className="Button">
        Camera
      </button>
      <Link to="./join">
        <button style={joinstyle}>Join</button>
      </Link>
    </div>
  );
};

export default PreRoom;
