import React from "react";
import { connect } from "react-redux";
import LocalVideoView from "../LocalVideoView/LocalVideoView";
import RemoteVideoView from "../RemoteVideoView/RemoteVideoView";
import CallRejectedDialog from "../CallRejectedDialog/CallRejectedDialog";
import IncomingCallDialog from "../IncomingCallDialog/IncomingCallDialog";
import CallingDialog from "../CallingDialog/CallingDialog";
import {
  callStates,
  setCallRejected,
  setLocalCameraEnabled,
  setLocalMicrophoneEnabled,
  setMessage,
} from "../../../store/actions/callActions";
import ConversationButtons from "../ConversationButtons/ConversationButtons";
import Messenger from "../Messenger/Messenger";
import { Col, Row } from "antd";

const DirectCall = (props) => {
  const {
    localStream,
    remoteStream,
    callState,
    callerUsername,
    callingDialogVisible,
    callRejected,
    hideCallRejectedDialog,
    setDirectCallMessage,
    message,
  } = props;

  return (
    <Row
      style={{
        width: "100%",
      }}
    >
      <Col span={1}></Col>
      <Col span={16} style={{ marginTop: "20px" }}>
        <LocalVideoView
          localStream={localStream}
          inCall={callState === callStates.CALL_IN_PROGRESS}
        />
        {remoteStream && callState === callStates.CALL_IN_PROGRESS && (
          <RemoteVideoView remoteStream={remoteStream} />
        )}
        {callRejected.rejected && (
          <CallRejectedDialog
            reason={callRejected.reason}
            hideCallRejectedDialog={hideCallRejectedDialog}
          />
        )}
        {callState === callStates.CALL_REQUESTED && (
          <IncomingCallDialog callerUsername={callerUsername} />
        )}
        {callingDialogVisible && <CallingDialog />}
        {remoteStream && callState === callStates.CALL_IN_PROGRESS && (
          <ConversationButtons {...props} />
        )}
      </Col>
      <Col span={3}>
        {remoteStream && callState === callStates.CALL_IN_PROGRESS && (
          <Messenger
            message={message}
            setDirectCallMessage={setDirectCallMessage}
          />
        )}
      </Col>
    </Row>
  );
};

function mapStoreStateToProps({ call }) {
  return {
    ...call,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hideCallRejectedDialog: (callRejectedDetails) =>
      dispatch(setCallRejected(callRejectedDetails)),
    setCameraEnabled: (enabled) => dispatch(setLocalCameraEnabled(enabled)),
    setMicrophoneEnabled: (enabled) =>
      dispatch(setLocalMicrophoneEnabled(enabled)),
    setDirectCallMessage: (received, content) =>
      dispatch(setMessage(received, content)),
  };
}

export default connect(mapStoreStateToProps, mapDispatchToProps)(DirectCall);
