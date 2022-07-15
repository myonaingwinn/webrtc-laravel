import React, { useEffect } from "react";
import ActiveUsersList from "./components/ActiveUsersList/ActiveUsersList";
import * as webRTCHandler from "../utils/webRTC/webRTCHandler";
import * as webRTCGroupHandler from "../utils/webRTC/webRTCGroupCallHandler";
import DirectCall from "./components/DirectCall/DirectCall";
import { connect } from "react-redux";
import DashboardInformation from "./components/Dashboardinformation/Dashboardinformation";
import { callStates } from "../store/actions/callActions";
import GroupCallRoomsList from "./components/GroupCallRoomsList/GroupCallRoomsList";
import GroupCall from "./components/GroupCall/GroupCall";
import { Col, Row } from "antd";

const Dashboard = ({ username, callState }) => {
  useEffect(() => {
    webRTCHandler.getLocalStream();
    webRTCGroupHandler.connectWithMyPeer();
  }, []);

  return (
    <Row style={{ width: "100vw", height: "100vh", display: "flex" }}>
      {callState !== callStates.CALL_IN_PROGRESS && (
        <Col
          span={4}
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <GroupCallRoomsList />
        </Col>
      )}
      <Col span={callState !== callStates.CALL_IN_PROGRESS ? 16 : 23}>
        <Row>
          <DirectCall />
          <GroupCall />
          {callState !== callStates.CALL_IN_PROGRESS && (
            <DashboardInformation username={username} />
          )}
        </Row>
      </Col>
      {callState !== callStates.CALL_IN_PROGRESS && (
        <Col
          span={4}
          style={{
            height: "100%",
          }}
        >
          {callState !== callStates.CALL_IN_PROGRESS && <ActiveUsersList />}
        </Col>
      )}
    </Row>
  );
};

const mapStateToProps = ({ call, dashboard }) => ({
  ...call,
  ...dashboard,
});

export default connect(mapStateToProps)(Dashboard);
