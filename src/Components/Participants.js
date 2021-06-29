import React from "react";
import ButtonLogo from "../Images/people.png";

const Participants = (props) => {
  let ButtonText = null;
  ButtonText = <p className="buttonText">Participants</p>;
  return (
    <div>
      <div className="button-container">
        {ButtonText}
        <button
          onClick={props.action}
          className="Button"
          style={{ color: "white", fontSize: "1vw" }}
        >
          <img
            className=""
            src={ButtonLogo}
            alt="Present Screen"
            style={{ borderRadius: "10px" }}
            width="70%"
          ></img>
          {props.Count}
        </button>
      </div>
    </div>
  );
};

export default Participants;
