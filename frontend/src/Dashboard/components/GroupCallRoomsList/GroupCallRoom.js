import React from "react";
import * as webRTCGroupCallHandler from "../../../utils/webRTC/webRTCGroupCallHandler";

const GroupCallRoom = ({ room }) => {
  const handleListItemPressed = () => {
    webRTCGroupCallHandler.joinGroupCall(room.socketId, room.roomId);
  };

  return (
    <div
      onClick={handleListItemPressed}
      className="group_calls_list_item background_main_color"
      style={{
        backgroundColor: "#bae7ff",
        width: "100%",
        height: "70px",
        borderRadius: "8px",
        cursor: "pointer",
      }}
    >
      <span>{room.hostName}</span>
    </div>
  );
};

export default GroupCallRoom;
