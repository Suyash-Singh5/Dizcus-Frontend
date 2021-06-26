import React from "react";
import "../Room.css";
import CamOn from "../Images/CamOn.png";
import CamOff from "../Images/CamOff.png";
export const WebcamButton = (props) => {
  let ButtonLogo = null;
  let ButtonText = null;
  if (!props.Streaming) {
    ButtonLogo = <img src={CamOff} alt="" width="40px" height="45px" />;
    ButtonText = <p className="buttonText">Camera On</p>;
  } else {
    ButtonLogo = <img src={CamOn} alt="On" width="35px" height="40px" />;
    ButtonText = <p className="buttonText">Camera Off</p>;
  }

  return (
    <div style={{ marginLeft: "15vw" }}>
      <div className="button-container">
        {ButtonText}
        <button
          // style={{ marginLeft: "25vw" }}
          id="webcamButton"
          onClick={props.action}
          className="Button"
        >
          {ButtonLogo}
        </button>
      </div>
    </div>
  );
};

export default WebcamButton;
