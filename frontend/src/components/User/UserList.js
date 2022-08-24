import {
    Layout,
    Typography,
    Card,
    Col,
    Row,
    Avatar,
    Button,
    Modal,
    Space,
} from "antd";
import { PhoneOutlined, MessageOutlined } from "@ant-design/icons";
import React, { useEffect, useState, useRef } from "react";
import Peer from "simple-peer";
import { localStorageGet } from "../../helpers/Utilities";
import ControlButtons from "./ControlButtons";
import styled from "styled-components";
import { socket } from "../Login/Login";
const { Content } = Layout;

const StyledVideo = styled.video`
    width: 80%;
    position: static;
    border-radius: 10px;
    overflow: hidden;
    margin: 1px;
    border: 5px solid gray;
`;

const UserList = () => {
    const user = localStorageGet("user");
    const { Title } = Typography;
    const userName = user.name;
    const [callUI, setCallUI] = useState(false);
    const [userList, setUserList] = useState([]);
    const myVideo = useRef();
    const remoteVideo = useRef();
    const connectionRef = useRef();
    const control = { video: true, audio: true };
    const [receivingCall, setReceivingCall] = useState(false);
    const [callAccepted, setCallAccepted] = useState(false);
    const [reject, setReject] = useState(true);

    const me = user.me;
    const [caller, setCaller] = useState("");
    const [name, setName] = useState("");
    const [callerSignal, setCallerSignal] = useState();

    useEffect(() => {
        socket.on("updateAllUsers", (userList) => {
            setUserList(userList);
        });
        socket.on("getAllUsers", (userList) => {
            setUserList(userList);
        });
        socket.on("reject", (data) => {
            if (reject) {
                info();
            }
        });
        socket.on("callUser", (data) => {
            setReceivingCall(true);
            setCaller(data.from);
            setName(data.name);
            setCallerSignal(data.signal);
        });
    }, [reject]);

    const info = () => {
        setReject(false);
        setCallUI(false);
        Modal.info({
            content: "Rejected your call.",
            onOk: () => {
                if (myVideo.current.srcObject) {
                    myVideo.current.srcObject
                        .getTracks()
                        .forEach(function (track) {
                            if (track.kind === "video") {
                                if (track.enabled) {
                                    track.stop();
                                }
                            }
                            if (track.kind === "audio") {
                                if (track.enabled) {
                                    track.stop();
                                }
                            }
                        });
                }
            },
        });
    };
    const handleAudioControlClick = () => {
        if (myVideo.current.srcObject) {
            myVideo.current.srcObject.getTracks().forEach(function (track) {
                if (track.kind === "audio") {
                    if (track.enabled) {
                        socket.emit("updateMyMedia", {
                            type: "audio",
                            currentMediaStatus: false,
                        });
                        track.enabled = false;
                    } else {
                        socket.emit("updateMyMedia", {
                            type: "audio",
                            currentMediaStatus: true,
                        });
                        track.enabled = true;
                    }
                }
            });
        }
    };

    const handleVideoControlClick = () => {
        if (myVideo.current.srcObject) {
            myVideo.current.srcObject.getTracks().forEach(function (track) {
                if (track.kind === "video") {
                    if (track.enabled) {
                        socket.emit("updateMyMedia", {
                            type: "video",
                            currentMediaStatus: false,
                        });
                        track.enabled = false;
                    } else {
                        socket.emit("updateMyMedia", {
                            type: "video",
                            currentMediaStatus: true,
                        });
                        track.enabled = true;
                    }
                }
            });
        }
    };

    const leaveCall = () => {
        if (myVideo.current.srcObject) {
            myVideo.current.srcObject.getTracks().forEach(function (track) {
                if (track.kind === "video") {
                    if (track.enabled) {
                        track.stop();
                    }
                }
                if (track.kind === "audio") {
                    if (track.enabled) {
                        track.stop();
                    }
                }
            });
            socket.emit("updateMyMedia", {
                type: "end",
                currentMediaStatus: false,
            });
            setCallUI(false);
            // connectionRef.destory();
            // window.location.reload();
            connectionRef.current = null;
        }
    };

    const peerCall = async (cliName, id) => {
        const stream = await navigator.mediaDevices.getUserMedia(control);
        myVideo.current.srcObject = stream;
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream,
        });
        peer.on("signal", (data) => {
            console.log("Calling to other..... ");
            console.log("Id ", id);
            console.log("Me ", me);
            console.log("User Name ", userName);
            socket.emit("callUser", {
                userToCall: id,
                signalData: data,
                from: me,
                name: userName,
            });
        });
        peer.on("stream", (stream) => {
            if (remoteVideo.current) remoteVideo.current.srcObject = stream;
        });
        socket.on("callAccepted", (signal) => {
            setCallAccepted(true);
            peer.signal(signal);
        });
        connectionRef.current = peer;
        setCallUI(true);
    };

    const answerCall = async () => {
        const stream = await navigator.mediaDevices.getUserMedia(control);
        myVideo.current.srcObject = stream;
        setCallAccepted(true);
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
            if (remoteVideo.current) remoteVideo.current.srcObject = stream;
        });
        peer.signal(callerSignal);
        connectionRef.current = peer;
    };

    const rejectCall = () => {
        socket.emit("reject", { name: userName, id: caller });
        setReceivingCall(false);
        setCallUI(false);
    };

    return (
        <>
            <Modal
                closable={false}
                visible={receivingCall && !callAccepted}
                okText="Accept"
                cancelText="Reject"
                onOk={answerCall}
                onCancel={rejectCall}
            >
                <p>{name} is calling ...</p>
            </Modal>
            <Layout
                className="user-list"
                style={{ display: callUI ? "none" : "block" }}
            >
                <Title className="title">User List Component</Title>
                <Row
                    gutter={[40, 40]}
                    className="userRow"
                    style={{
                        marginLeft: "10px",
                        marginRight: "30px",
                    }}
                >
                    {userList.map((user) => (
                        <Col span={8} key={user.userId}>
                            <Card bordered={true} hoverable={true}>
                                <div>
                                    <Row>
                                        <Col>
                                            <div className="user-image">
                                                <Avatar
                                                    className="avatar"
                                                    size={50}
                                                    gap={4}
                                                >
                                                    <b>
                                                        {user.name
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </b>
                                                </Avatar>
                                            </div>
                                        </Col>
                                        <Col className="user-name">
                                            <span>{user.name}</span>
                                            <br></br>
                                            <small>Online</small>
                                        </Col>
                                        {user.userId === me ? (
                                            <h5 className="you">(You)</h5>
                                        ) : (
                                            <Col className="btn">
                                                <Button
                                                    type="link"
                                                    onClick={() => {
                                                        peerCall(
                                                            user.name,
                                                            user.userId
                                                        );
                                                    }}
                                                >
                                                    <PhoneOutlined
                                                        spin={false}
                                                        rotate={0}
                                                        className="phone"
                                                    />
                                                </Button>
                                                <Button
                                                    type="link"
                                                    onClick={() => {
                                                        alert(
                                                            "Hello from Message " +
                                                                user.name
                                                        );
                                                    }}
                                                >
                                                    <MessageOutlined
                                                        spin={false}
                                                        rotate={0}
                                                        className="phone"
                                                    />
                                                </Button>
                                            </Col>
                                        )}
                                    </Row>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Layout>
            <Layout style={{ display: callUI ? "block" : "none" }}>
                <Content>
                    <Space>
                        <StyledVideo muted ref={myVideo} autoPlay playsInline />

                        <StyledVideo
                            muted
                            ref={remoteVideo}
                            autoPlay
                            playsInline
                        />
                    </Space>
                    <ControlButtons
                        style={{ marginBottom: "3px" }}
                        handleVideoControlClick={handleVideoControlClick}
                        handleAudioControlClick={handleAudioControlClick}
                        leaveCall={leaveCall}
                    />
                </Content>
            </Layout>
        </>
    );
};

export default UserList;
