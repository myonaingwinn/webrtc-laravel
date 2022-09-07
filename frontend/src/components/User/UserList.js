import { Layout, Row, Typography, Modal, Space } from "antd";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { connectWithServer, getOnlineUsers } from "../../helpers/SocketClient";
import { localStorageGet } from "../../helpers/Utilities";
import Empty from "../Error/Empty";
import Peer from "simple-peer";
import User from "./User";
import { socket } from "../../helpers/SocketClient";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import ControlButtons from "../Room/ControlButtons";

const StyledVideo = styled.video`
    width: 80%;
    position: static;
    border-radius: 10px;
    overflow: hidden;
    margin: 1px;
    border: 5px solid gray;
`;

const UserList = () => {
    const { Title } = Typography;
    const navigate = useNavigate();
    const users = useSelector((state) => state.onlineUserList.value);
    const { uuid } = localStorageGet("user") || {};
    const [showEmpty, setShowEmpty] = useState(true);
    const socketId = localStorageGet("socketId") || {};
    const myVideo = useRef();
    const remoteVideo = useRef();
    const connectionRef = useRef();
    const [receivingCall, setReceivingCall] = useState(false);
    const [callAccepted, setCallAccepted] = useState(false);
    const control = { video: true, audio: true };
    const [reject, setReject] = useState(true);
    const [caller, setCaller] = useState("");
    const [name, setName] = useState("");
    const [callerSignal, setCallerSignal] = useState();
    const [callUI, setCallUI] = useState(false);

    useEffect(() => {
        connectWithServer();
    }, []);

    const info = () => {
        setReject(false);
        Modal.info({
            content: "Call ended ",
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
        socket.on("endCall", (name) => {
            if (reject) {
                info();
            }
        });
    });

    useEffect(() => {
        socket.on("callUser", (data) => {
            setReceivingCall(true);
            setCaller(data.from);
            setName(data.name);
            setCallerSignal(data.signal);
        });

        document.title = "Online Users";

        getOnlineUsers();

        if (users && Object.keys(users).length > 1) setShowEmpty(false);
        else setShowEmpty(true);
    }, [users, reject]);

    const answerCall = async () => {
        const str = await navigator.mediaDevices.getUserMedia(control);
        myVideo.current.srcObject = str;
        setCallAccepted(true);
        setCallUI(true);
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: str,
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
        socket.emit("reject", { name: socketId.name, id: caller });
        setReceivingCall(false);
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
                id: caller,
                name: socketId.name,
            });
            setCallUI(false);
            connectionRef.current.destroy();
            navigate(0);
        }
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
            <Layout className="user-list common">
                <Title className="title">Online Users</Title>
                <Row
                    gutter={[16, 32]}
                    className="user-container"
                    justify="space-evenly"
                >
                    {!showEmpty ? (
                        users &&
                        Object.keys(users).map(
                            (userId) =>
                                uuid &&
                                uuid !== userId && (
                                    <User
                                        user={users[userId]}
                                        key={userId}
                                        socket={socket}
                                    />
                                )
                        )
                    ) : (
                        <Empty description="Nobody is Online, invite your friends!" />
                    )}
                </Row>
            </Layout>
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

export default UserList;
