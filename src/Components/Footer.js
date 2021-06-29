import React from "react";
import Camera from "./WebcamButton";
import Mic from "./MicButton";
import CutCall from "./CutCall";
import ScreenShare from "./ScreenShare";
import Participants from "./Participants";
import Chat from "./ChatWindow";
import Brand from "../Images/dizcus.png";

const Footer = (props) => {
  return (
    <footer className="Footer">
      <span
        className="Footer-elem"
        style={{ width: "10vw", paddingTop: "2vh" }}
      >
        <img src={Brand} width="100%" />
      </span>
      <span className="Footer-elem">
        <Camera Streaming={props.VideoStreaming} action={props.VideoAction} />
      </span>
      <span className="Footer-elem">
        <Mic Streaming={props.AudioStreaming} action={props.AudioAction} />
      </span>
      <span className="Footer-elem">
        <CutCall action={props.CutCallAction} />
      </span>
      <span className="Footer-elem">
        <ScreenShare
          Streaming={props.ScreenSharing}
          action={props.ScreenShareAction}
        />
      </span>
      <span className="Footer-elem">
        <Participants Count={props.Count} />
      </span>
      <span className="ChatWindow">
        <Chat />
      </span>
    </footer>
  );
};

export default Footer;
