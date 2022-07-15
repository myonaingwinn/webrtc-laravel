import React from "react";
import ActiveUser from "./ActiveUser";
import { connect } from "react-redux";

import "./ActiveUsersList.css";

const ActiveUsersList = ({ activeUsers, callState }) => {
  return (
    <div className="active_user_list_container">
      {activeUsers.map((activeUser) => (
        <ActiveUser
          key={activeUser.socketId}
          activeUser={activeUser}
          callState={callState}
        />
      ))}
    </div>
  );
};

const mapStateToProps = ({ dashboard, call }) => ({
  ...dashboard,
  ...call,
});

export default connect(mapStateToProps)(ActiveUsersList);
