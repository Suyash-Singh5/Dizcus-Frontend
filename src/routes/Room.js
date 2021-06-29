import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import Footer from "../Components/Footer";
import "../Room.css";
// import image from "../Images/dizcus.png";
import image from "../Images/logo.png";

// const Container = styled.div`
//   padding: 20px;
//   display: flex;
//   height: 100vh;
//   width: 90%;
//   margin: auto;
//   flex-wrap: wrap;
// `;

const VideoBox = styled.video`
  height: 45vh;
  width: 60vh;
  border: 1px solid blue;
  border-radius: 10px;
  margin-top: 0px;
  margin-bottom: 0px;
  // margin-right: 5vw;
  // margin-top: 2.5vh;
`;

const VideoPeer = (props) => {
  const ref = useRef();

  useEffect(() => {
    props.peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
  }, []);

  return <VideoBox playsInline autoPlay ref={ref} controls />;
};

// const videoConstraints = {
//   height: window.innerHeight / 2,
//   width: window.innerWidth / 2,
// };

const Room = (props) => {
  const [peers, setPeers] = useState([]);
  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);
  const roomID = props.match.params.roomID;
  const initstates = props.location.state;
  const [VideoStreaming, setVideoStreaming] = useState(false);
  const [AudioStreaming, setAudioStreaming] = useState(false);
  const [ScreenSharing, setScreenSharing] = useState(false);
  let username = "Anonymous User";

  useEffect(() => {
    socketRef.current = io.connect("/");
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        addNewUser(stream);
        // toggleVideo();
        removeUser();
      });
  }, []);

  const addNewUser = (stream) => {
    userVideo.current.srcObject = stream;
    let video = userVideo.current;
    let initstream = video.srcObject;
    const videotrack = initstream.getVideoTracks()[0];
    const audiotrack = initstream.getAudioTracks()[0];
    if (initstates) {
      videotrack.enabled = initstates.video;
      audiotrack.enabled = initstates.audio;
      setVideoStreaming(initstates.video);
      setAudioStreaming(initstates.audio);
      if (initstates.name) {
        username = initstates.name;
      }
    } else {
      videotrack.enabled = false;
      audiotrack.enabled = false;
    }
    socketRef.current.emit("join room", roomID, username);
    socketRef.current.on("all users", (users) => {
      const peers = [];
      users.forEach((userID) => {
        const peer = createPeer(userID, socketRef.current.id, stream);
        peersRef.current.push({
          peerID: userID,
          peer,
        });
        peers.push({
          peer,
          peerID: userID,
        });
      });
      setPeers(peers);
    });

    // Existing Users recieve signal
    socketRef.current.on("user joined", (payload) => {
      const peer = addPeer(payload.signal, payload.callerID, stream);
      peersRef.current.push({
        peerID: payload.callerID,
        peer,
      });
      const peerObj = {
        peer,
        peerID: payload.callerID,
      };
      setPeers((users) => [...users, peerObj]);
    });

    socketRef.current.on("receiving returned signal", (payload) => {
      const item = peersRef.current.find((p) => p.peerID === payload.id);
      item.peer.signal(payload.signal);
    });
  };

  const removeUser = () => {
    socketRef.current.on("user left", (id) => {
      const peerObj = peersRef.current.find((p) => p.peerID === id);
      if (peerObj) {
        peerObj.peer.destroy();
      }
      const peers = peersRef.current.filter((p) => p.peerID !== id);
      peersRef.current = peers;
      setPeers(peers);
    });
  };

  const createPeer = (userToSignal, callerID, stream) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("sending signal", {
        userToSignal,
        callerID,
        signal,
      });
    });

    return peer;
  };

  const addPeer = (incomingSignal, callerID, stream) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("returning signal", { signal, callerID });
    });

    peer.signal(incomingSignal);

    return peer;
  };

  let count = peersRef.current.length + 1;

  const toggleVideo = async () => {
    let video = userVideo.current;
    let stream = video.srcObject;
    const videotrack = stream.getVideoTracks()[0];
    videotrack.enabled = !videotrack.enabled;
    if (!VideoStreaming) {
      setVideoStreaming(true);
      // let video = userVideo.current;
      // let mainstream = video.srcObject;
      // let oldtrack = mainstream.getVideoTracks()[0];
      // navigator.mediaDevices
      //   .getUserMedia({ video: true, audio: AudioStreaming })
      //   .then((stream) => {
      //     const videoTrack = stream.getVideoTracks()[0];
      //     userVideo.current.srcObject = stream;
      //     if (peersRef.current) {
      //       peersRef.current.forEach((peer) => {
      //         peer.peer.replaceTrack(oldtrack, videoTrack, mainstream);
      //       });
      //       setPeers(peersRef.current);
      //     }
      //   });
    } else {
      setVideoStreaming(false);
      // let video = userVideo.current;
      // let videotrack = video.srcObject.getVideoTracks();
      // videotrack.stop();
      // let videoTrack = video.srcObject.getVideoTracks()[0];
      // videoTrack.stop();
      // await video.srcObject.getTracks()[l - 1].stop();
      // video.srcObject = null;
      // console.log(video.srcObject.getTracks());
    }
  };

  const toggleAudio = async () => {
    let video = userVideo.current;
    let stream = video.srcObject;
    const audiotrack = stream.getAudioTracks()[0];
    audiotrack.enabled = !audiotrack.enabled;
    if (!AudioStreaming) {
      setAudioStreaming(true);
    } else {
      setAudioStreaming(false);
    }
  };

  const toggleCutCall = () => {
    userVideo.current.srcObject.getVideoTracks()[0].stop();
    userVideo.current.srcObject.getAudioTracks()[0].stop();
    socketRef.current.emit("cut call");
    removeUser();
  };

  const toggleScreenShare = () => {
    if (!ScreenSharing) {
      setScreenSharing(true);
      navigator.mediaDevices
        .getDisplayMedia({ cursor: true })
        .then((stream) => {
          let screenShareTrack = stream.getVideoTracks()[0];
          userVideo.current.srcObject = stream;
          peerReplaceTrack(screenShareTrack);
          setPeers(peersRef.current);

          screenShareTrack.onended = () => {
            endScreenShare();
          };
        });
    } else {
      endScreenShare();
      setPeers(peersRef.current);
    }
  };

  const endScreenShare = () => {
    setScreenSharing(false);
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        let newvidTrack = stream.getVideoTracks()[0];
        peerReplaceTrack(newvidTrack);
        userVideo.current.srcObject = stream;
        userVideo.current.srcObject.getVideoTracks()[0].enabled =
          VideoStreaming;
        userVideo.current.srcObject.getAudioTracks()[0].enabled =
          AudioStreaming;
      });
  };

  // Special Function to Replace Tracks for every peer
  const peerReplaceTrack = (newTrack) => {
    if (peersRef.current) {
      peersRef.current.forEach((peer) => {
        let oldTrack = peer.peer.streams[0].getVideoTracks()[0];
        peer.peer.replaceTrack(oldTrack, newTrack, peer.peer.streams[0]);
      });
    }
  };

  return (
    <div className="bg">
      {/* <div
        style={{
          width: "8vw",
          height: "6vh",
          // backgroundColor: "rgba(0,0,0,0.7)",
          textAlign: "center",
        }}
      >
        <img
          src={image}
          alt="Dizcus"
          width="50%"
          style={{ marginTop: "0.5vh" }}
        />
      </div> */}
      <div>
        <div
          style={{
            marginLeft: "10vw",
            marginRight: "10vw",
            marginTop: "0px",
            marginBottom: "0px",
            padding: "0px",
          }}
        >
          <VideoBox ref={userVideo} autoPlay playsInline controls />
          {peers.map((peer) => {
            return <VideoPeer key={peer.peerID} peer={peer.peer} controls />;
          })}
        </div>
        <Footer
          VideoStreaming={VideoStreaming}
          AudioStreaming={AudioStreaming}
          ScreenSharing={ScreenSharing}
          VideoAction={toggleVideo}
          AudioAction={toggleAudio}
          CutCallAction={toggleCutCall}
          ScreenShareAction={toggleScreenShare}
          Count={count}
        />
      </div>
    </div>
  );
};

export default Room;
