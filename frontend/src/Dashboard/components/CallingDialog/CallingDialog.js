import React from "react";
import "./CallingDialog.css";
import { hangUp } from "../../../utils/webRTC/webRTCHandler";
import { MdCallEnd } from "react-icons/md";
import { Row } from "antd";

const styles = {
  buttonContainer: {
    marginTop: "20px",
    width: "40px",
    height: "40px",
    borderRadius: "40px",
    // border: "2px solid #e6e5e8",
    backgroundColor: "red",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  centered: {
    marginTop: "35%",
    marginLeft: "20%",
    // margin: "auto",
    // width: "50%",
    // border: "3px solid green",
    color: "white",
    padding: "10px",
    backgroundColor: "#282c34",
  },
};

const CallingDialog = () => {
  const handleHangUpButtonPressed = () => {
    hangUp();
  };

  return (
    <Row>
      <div
        className="direct_calling_dialog background_secondary_color"
        style={styles.centered}
      >
        <span>Calling...</span>
        <div style={styles.buttonContainer} onClick={handleHangUpButtonPressed}>
          <MdCallEnd
            style={{ width: "20px", height: "20px", fill: "#e6e5e8" }}
          />
        </div>
      </div>
    </Row>
  );
};

export default CallingDialog;
