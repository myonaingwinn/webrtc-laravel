import React from "react";
import { callToOtherUser } from "../../../utils/webRTC/webRTCHandler";
import { callStates } from "../../../store/actions/callActions";
import { Avatar } from "antd";

const ActiveUser = (props) => {
  const { activeUser, callState } = props;
  const colorList = [
    "#f56a00",
    "#7265e6",
    "#ffbf00",
    "#00a2ae",
    "#87d068",
    "#1890ff",
    "#fde3cf",
    "#8c8c8c",
    "#003a8c",
    "#eb2f96",
    "#73d13d",
    "#5cdbd3",
    "#002766",
  ];

  const getRandomColor = () => {
    const index = Math.floor(Math.random() * colorList.length);
    return colorList[index];
  };

  const handleListItemPressed = () => {
    if (callState === callStates.CALL_AVAILABLE) {
      callToOtherUser(activeUser);
    }
  };

  return (
    <div className="active_user_list_item" onClick={handleListItemPressed}>
      <div className="active_user_list_image_container">
        <Avatar size={"large"} style={{ backgroundColor: getRandomColor() }}>
          {activeUser.username[0]}
        </Avatar>
      </div>
      <span className="active_user_list_text">{activeUser.username}</span>
    </div>
  );
};

export default ActiveUser;
