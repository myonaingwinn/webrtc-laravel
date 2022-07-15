import React, { useRef, useEffect } from "react";

const LocalVideoView = (props) => {
  const { localStream, inCall } = props;
  console.log("🚀 ~ file: LocalVideoView.js ~ line 21 ~ inCall", inCall);
  const localVideoRef = useRef();

  const styles = {
    videoContainer: {
      width: "150px",
      height: "114px",
      borderRadius: "4px",
      border: "3px solid gray",
      position: "absolute",
      top: "3%",
      right: inCall ? "2%" : "-30%",
    },
    videoElement: {
      width: "100%",
      height: "100%",
    },
  };

  useEffect(() => {
    if (localStream) {
      const localVideo = localVideoRef.current;
      localVideo.srcObject = localStream;

      localVideo.onloadedmetadata = () => {
        localVideo.play();
      };
    }
  }, [localStream]);

  return (
    <div style={styles.videoContainer} className="background_secondary_color">
      <video style={styles.videoElement} ref={localVideoRef} autoPlay muted />
    </div>
  );
};

export default LocalVideoView;
