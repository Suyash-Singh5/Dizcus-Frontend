import React from "react";
import "../Room.css";
export const ChatWindow = () => {
  return (
    <div className="main__message_container">
      <input
        id="chat_message"
        type="text"
        autoComplete="off"
        placeholder="Chat with others ..."
      />
    </div>
  );
};
export default ChatWindow;
