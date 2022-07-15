import React from "react";
import GroupCallRoom from "./GroupCallRoom";
import { connect } from "react-redux";
import "./GroupCallRoomsList.css";

const GroupCallRoomsList = (props) => {
  const { groupCallRooms } = props;
  return (
    <div style={{ padding: "10px" }}>
      {groupCallRooms.map((room) => (
        <GroupCallRoom key={room.roomId} room={room} />
      ))}
    </div>
  );
};

const mapStoreStateToProps = ({ dashboard }) => ({
  ...dashboard,
});

export default connect(mapStoreStateToProps)(GroupCallRoomsList);
