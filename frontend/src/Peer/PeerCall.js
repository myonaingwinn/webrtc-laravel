import React, { useEffect, useState, useRef } from "react";
import { Button, Form, Input, Card, Col, Row, Modal } from "antd";
import Peer from "simple-peer";
import io from "socket.io-client";
import "./Peer.css";

const socket = io.connect("http://localhost:5000");

const formItemLayout = {
  labelCol: {
    xs: {
      span: 8,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 24,
      offset: 8,
    },
  },
};

const PeerOne = () => {
  const [form] = Form.useForm();
  const [userName, setUserName] = useState("");
  const [constraints, setConstraints] = useState(false);
  const [display, setDisplay] = useState(true);
  const [showUsers, setShowUsers] = useState(false);
  const [callUI, setCallUI] = useState(false);
  const [userList, setUserList] = useState([]);
  const [clientName, setClientName] = useState([]);
  const [clientId, setClientId] = useState([]);
  const [stream, setStream] = useState("");
  const myVideo = useRef();
  const remoteVideo = useRef();
  const connectionRef = useRef();
  const control = { video: true, audio: true };

  const [receivingCall, setReceivingCall] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);
  const [me, setMe] = useState("");
  const [caller, setCaller] = useState("");
  const [name, setName] = useState("");
  const [callerSignal, setCallerSignal] = useState();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia(control).then((str) => {
      setStream(str);
      myVideo.current.srcObject = str;
    });

    console.log("Using useEffect");
    socket.on("me", (id) => {
      setMe(id);
    });
    socket.on("getAllUsers", (users) => {
      setUserList(users);
    });
    socket.on("updateAllUsers", (users) => {
      setUserList(users);
    });

    socket.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });
  }, [userList]);

  const handleSubmit = async () => {
    if (!(userName === "")) {
      setUserName(userName);
      var data = { name: userName, userId: me };
      socket.emit("setSocketId", data);
    }
    setDisplay(false);
    setShowUsers(true);
  };

  const handleChange = (event) => {
    setUserName(event.target.value);
  };

  const peerCall = (cliName, id) => {
    setClientName(cliName);
    setClientId(id);

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name: userName,
      });
    });
    peer.on("stream", (stream) => {
      remoteVideo.current.srcObject = stream;
    });
    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });
    connectionRef.current = peer;
    setShowUsers(false);
    setCallUI(true);
  };

  const answerCall = () => {
    setConstraints(true);
    setCallAccepted(true);
    // setUserMedia();
    setCallUI(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller });
    });
    peer.on("stream", (stream) => {
      remoteVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  return (
    <>
      <Modal
        title="Basic Modal"
        visible={receivingCall && !callAccepted}
        onOk={answerCall}
      >
        <p>{name} is calling ...</p>
      </Modal>
      <div
        className="site-card-wrapper"
        style={{
          display: display ? "block" : "none",
        }}
      >
        <Card
          title="User Register"
          style={{
            textAlign: "center",
            width: "800px",
            margin: "0 auto",
            marginTop: "80px",
          }}
        >
          <Form
            {...formItemLayout}
            form={form}
            name="room"
            style={{
              marginTop: "30px",
              marginRight: "200px",
            }}
            colon={false}
            requiredMark={false}
          >
            <Form.Item
              name="userName"
              label="Name"
              id="name"
              value={userName}
              onChange={handleChange}
              rules={[
                {
                  required: true,
                  message: "Please input your name!",
                },
              ]}
            >
              <Input placeholder="Enter your name" />
            </Form.Item>

            <Form.Item {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit" onClick={handleSubmit}>
                Enter
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>

      <div
        style={{
          display: showUsers ? "block" : "none",
        }}
      >
        <Row gutter={16}>
          {userList.length > 0
            ? userList.map((ulist) => {
                return (
                  <Col className="gutter-row" span={6} key={ulist.userId}>
                    <Card size="small" title={ulist.name}>
                      {ulist.userId === me ? (
                        <h4>(You)</h4>
                      ) : (
                        <button
                          onClick={() => peerCall(ulist.name, ulist.userId)}
                        >
                          Call
                        </button>
                      )}
                    </Card>
                  </Col>
                );
              })
            : "No room available!"}
        </Row>
      </div>

      {/* Video Call UI */}

      <div style={{ display: callUI ? "block" : "none" }}>
        <div id="video-chat-container" className="video-position">
          <video id="local-video" autoPlay ref={myVideo}></video>
          <video id="remote-video" autoPlay ref={remoteVideo}></video>
        </div>
      </div>
    </>
  );
};

export default PeerOne;
