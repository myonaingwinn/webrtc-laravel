import { Layout, Row, Typography, Modal, Col } from "antd";
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
    width: 95%;
    border-radius: 10px;
    overflow: hidden;
    margin: 2.5%;
    border: 5px solid gray;
`;

const UserList = () => {
    const { Title } = Typography;
    const navigate = useNavigate();
    const users = useSelector((state) => state.onlineUserList.value);
    const { uuid } = localStorageGet("user") || {};
    const [showEmpty, setShowEmpty] = useState(true);
    const socketId = localStorageGet("socketId") || {};
    const [clientId, setClientId] = useState("");
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
    document.title = "Online Users";
    const endMsg = "Call ended";
    const rejectMsg = "Rejected your call";
    useEffect(() => {
        connectWithServer();
    }, []);

    const info = (msg) => {
        setReject(false);
        Modal.info({
            content: msg,
            onOk: () => {
                document.title = "In a call";
                Modal.destroyAll();
                if (myVideo.current.srcObject) {
                    myVideo.current.srcObject
                        .getTracks()
                        .forEach(function (track) {
                            track.stop();
                        });
                }
                navigate(0);
            },
        });
    };

    useEffect(() => {
        socket.on("reject", () => {
            info(rejectMsg);
        });
        socket.on("endCall", () => {
            info(endMsg);
        });

        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        socket.on("callUser", (data) => {
            setReceivingCall(true);
            setCaller(data.from);
            setName(data.name);
            setCallerSignal(data.signal);
        });
        getOnlineUsers();
        if (users && Object.keys(users).length > 1) setShowEmpty(false);
        else setShowEmpty(true);
    }, [users, reject]);

    const handleCall = async (clientId) => {
        document.title = "In a call";
        setClientId(clientId);
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

    const answerCall = async () => {
        document.title = "In a call";
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
        socket.emit("reject", { id: caller });
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
        let endId = receivingCall ? caller : clientId;

        if (myVideo.current.srcObject) {
            myVideo.current.srcObject.getTracks().forEach(function (track) {
                track.stop();
            });
            socket.emit("endCall", {
                id: endId,
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
            <Layout
                className="user-list common"
                style={{ display: callUI ? "none" : "" }}
            >
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
                                        handleCall={handleCall}
                                    />
                                )
                        )
                    ) : (
                        <Empty description="Nobody is Online, invite your friends!" />
                    )}
                </Row>
            </Layout>
            {/* For UI Display */}
            <Layout
                className="common"
                style={{ display: callUI ? "" : "none" }}
            >
                <Row gutter={[16, 16]}>
                    <Col span="12">
                        <StyledVideo muted ref={myVideo} autoPlay playsInline />
                    </Col>
                    <Col span="12">
                        <StyledVideo
                            muted
                            ref={remoteVideo}
                            autoPlay
                            playsInline
                        />
                    </Col>
                </Row>
                <ControlButtons
                    handleVideoControlClick={handleVideoControlClick}
                    handleAudioControlClick={handleAudioControlClick}
                    leaveCall={leaveCall}
                />
            </Layout>
        </>
    );
};

export default UserList;
