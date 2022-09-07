import { Avatar, Col, Row, Space, Typography, Modal } from "antd";
import { useState, useRef, useEffect } from "react";
import { mdiMessageText, mdiPhone } from "@mdi/js";
import Icon from "@mdi/react";
import Peer from "simple-peer";
import { localStorageGet } from "../../helpers/Utilities";
import { getColor } from "../../helpers/Utilities";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import ControlButtons from "../Room/ControlButtons";

const { Title } = Typography;

const StyledVideo = styled.video`
    width: 80%;
    position: static;
    border-radius: 10px;
    overflow: hidden;
    margin: 1px;
    border: 5px solid gray;
`;

const User = ({ user, socket }) => {
    const navigate = useNavigate();
    const ellipsis = true;
    const socketId = localStorageGet("socketId") || {};
    const clientId = user.socketId;
    const [reject, setReject] = useState(true);
    const myVideo = useRef();
    const remoteVideo = useRef();
    const connectionRef = useRef();
    const [callUI, setCallUI] = useState(false);
    const control = { video: true, audio: true };
    const endMsg = "Call ended";
    const rejectMsg = "Rejected your call";

    const info = (msg) => {
        setReject(false);
        Modal.info({
            content: msg,
            onOk: () => {
                Modal.destroyAll();
                if (myVideo.current.srcObject) {
                    myVideo.current.srcObject
                        .getTracks()
                        .forEach(function (track) {
                            track.stop();
                        });
                }
            },
        });
        setCallUI(false);
        navigate(0);
    };

    useEffect(() => {
        socket.on("reject", (data) => {
            if (reject) {
                info(rejectMsg);
            }
        });
        socket.on("endCall", (name) => {
            if (reject) {
                info(endMsg);
            }
        });
    });

    const handleCall = async () => {
        const str = await navigator.mediaDevices.getUserMedia(control);
        myVideo.current.srcObject = str;
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: str,
        });
        peer.on("signal", (data) => {
            socket.emit("callUser", {
                userToCall: clientId,
                signalData: data,
                from: socketId.socketId,
                name: socketId.name,
            });
        });
        peer.on("stream", (stream) => {
            if (remoteVideo.current) remoteVideo.current.srcObject = stream;
        });
        socket.on("callAccepted", (signal) => {
            peer.signal(signal);
        });
        connectionRef.current = peer;
        setCallUI(true);
    };

    const handleMessage = () => {
        console.log("handleMessage");
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
                track.stop();
            });
            socket.emit("endCall", {
                id: clientId,
                name: socketId.name,
            });
            setCallUI(false);
            connectionRef.current.destroy();
            navigate(0);
        }
    };

    return (
        <>
            <Col span={5} className="user-card">
                <Row>
                    <Col span={8}>
                        <Avatar
                            style={{
                                backgroundColor: getColor(user.name),
                            }}
                            size={{
                                md: 40,
                                lg: 45,
                                xl: 50,
                                xxl: 70,
                            }}
                            className="user-avatar"
                            shape="square"
                        >
                            {user.name && user.name.charAt(0).toUpperCase()}
                        </Avatar>
                    </Col>
                    <Col span={16}>
                        <Title
                            level={4}
                            ellipsis={ellipsis ? { tooltip: user.name } : false}
                        >
                            {user.name}
                        </Title>
                        <Space size="middle" className="user-controls">
                            <Icon
                                path={mdiPhone}
                                title="Video call"
                                size={1.2}
                                onClick={handleCall}
                            />
                            <Icon
                                path={mdiMessageText}
                                title="Send message"
                                size={1.2}
                                onClick={handleMessage}
                            />
                        </Space>
                    </Col>
                </Row>
            </Col>
            <div style={{ display: callUI ? "block" : "none" }}>
                <Space>
                    <StyledVideo muted ref={myVideo} autoPlay playsInline />

                    <StyledVideo muted ref={remoteVideo} autoPlay playsInline />
                </Space>
                <ControlButtons
                    style={{ marginBottom: "3px" }}
                    handleVideoControlClick={handleVideoControlClick}
                    handleAudioControlClick={handleAudioControlClick}
                    leaveCall={leaveCall}
                />
            </div>
        </>
    );
};

export default User;
