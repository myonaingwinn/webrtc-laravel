import { Col, Layout, Row, Typography } from "antd";
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { signalServerUrl } from "../../helpers/Utilities";
import ControlButtons from "./ControlButtons";
import VideoControl from "./components/VideoControl";
import AudioControl from "./components/AudioControl";
import GroupChat from "../Chat/GroupChat";

const socket = io(signalServerUrl);

const ControlSmall = styled.div`
    margin: 3px;
    padding: 5px;
    height: 16px;
    width: 98%;
    margin-top: -6vh;
    filter: brightness(1);
    z-index: 1;
    border-radius: 6px;
    display: flex;
    justify-content: center;
    gap: 10px;
`;

const StyledVideo = styled.video`
    width: 100%;
    position: static;
    border-radius: 10px;
    overflow: hidden;
    margin: 1px;
    border: 5px solid gray;
`;

const Video = (props) => {
    const ref = useRef();

    useEffect(() => {
        props.peer.on("stream", (stream) => {
            ref.current.srcObject = stream;
        });
    }, [props]);

    return <StyledVideo playsInline autoPlay ref={ref} />;
};

const Room = () => {
    const { Title } = Typography;

    const [peers, setPeers] = useState([]);
    const [audioFlag, setAudioFlag] = useState(true);
    const [videoFlag, setVideoFlag] = useState(true);
    const [userUpdate, setUserUpdate] = useState([]);
    const userVideo = useRef();
    const peersRef = useRef([]);
    const room = useParams();
    const [span, setSpan] = useState();
    const [roomName, setRoomName] = useState();
    const navigate = useNavigate();
    const videoConstraints = {
        minAspectRatio: 1.333,
        minFrameRate: 60,
        height: window.innerHeight / 1.8,
        width: window.innerWidth / 2,
    };

    useEffect(() => {
        createStream();

        socket.on("room_name", (room_name) => {
            setRoomName(room_name);
            document.title = `Room : ${room_name}`;
        });
        
        // eslint-disable-next-line
    }, []);

    const calcVideoConstraints = (arr) => {
        let span = 6;
        if (arr.length < 2) {
            span = 12;
        } else if (arr.length < 3) {
            span = 8;
        }
        setSpan(span);
    };

    function createStream() {
        navigator.mediaDevices
            .getUserMedia({ video: videoConstraints, audio: true })
            .then((stream) => {
                userVideo.current.srcObject = stream;
                socket.emit("join room", room.id);
                socket.on("all users in a room", (users) => {
                    calcVideoConstraints(users);
                    const peers = [];
                    users.forEach((userID) => {
                        const peer = createPeer(userID, socket.id, stream);
                        peersRef.current.push({
                            peerID: userID,
                            peer,
                        });
                        peers.push({
                            peerID: userID,
                            peer,
                        });
                    });
                    setPeers(peers);
                });

                socket.on("user joined", (payload) => {
                    const peer = addPeer(
                        payload.signal,
                        payload.callerID,
                        stream
                    );
                    peersRef.current.push({
                        peerID: payload.callerID,
                        peer,
                    });
                    const peerObj = {
                        peer,
                        peerID: payload.callerID,
                    };
                    setPeers((users) => [...users, peerObj]);
                });

                socket.on("user left", (id) => {
                    const peerObj = peersRef.current.find(
                        (p) => p.peerID === id
                    );
                    if (peerObj) {
                        peerObj.peer.destroy();
                    }
                    const peers = peersRef.current.filter(
                        (p) => p.peerID !== id
                    );
                    peersRef.current = peers;
                    setPeers(peers);
                });

                socket.on("receiving returned signal", (payload) => {
                    const item = peersRef.current.find(
                        (p) => p.peerID === payload.id
                    );
                    item.peer.signal(payload.signal);
                });

                socket.on("change", (payload) => {
                    setUserUpdate(payload);
                });
            });
    }

    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", (signal) => {
            socket.emit("sending signal", {
                userToSignal,
                callerID,
                signal,
            });
        });

        return peer;
    }

    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        });

        peer.on("signal", (signal) => {
            socket.emit("returning signal", { signal, callerID });
        });

        peer.signal(incomingSignal);

        return peer;
    }

    const handleLeaveCall = () => {
        navigate("/rooms");
        navigate(0);
    };

    const handleVideoControlClick = () => {
        if (userVideo.current.srcObject) {
            userVideo.current.srcObject.getTracks().forEach(function (track) {
                if (track.kind === "video") {
                    if (track.enabled) {
                        socket.emit("change", [
                            ...userUpdate,
                            {
                                id: socket.id,
                                videoFlag: false,
                                audioFlag,
                            },
                        ]);
                        track.enabled = false;
                        setVideoFlag(false);
                    } else {
                        socket.emit("change", [
                            ...userUpdate,
                            {
                                id: socket.id,
                                videoFlag: true,
                                audioFlag,
                            },
                        ]);
                        track.enabled = true;
                        setVideoFlag(true);
                    }
                }
            });
        }
    };

    const handleAudioControlClick = () => {
        if (userVideo.current.srcObject) {
            userVideo.current.srcObject.getTracks().forEach(function (track) {
                if (track.kind === "audio") {
                    if (track.enabled) {
                        socket.emit("change", [
                            ...userUpdate,
                            {
                                id: socket.id,
                                videoFlag,
                                audioFlag: false,
                            },
                        ]);
                        track.enabled = false;
                        setAudioFlag(false);
                    } else {
                        socket.emit("change", [
                            ...userUpdate,
                            {
                                id: socket.id,
                                videoFlag,
                                audioFlag: true,
                            },
                        ]);
                        track.enabled = true;
                        setAudioFlag(true);
                    }
                }
            });
        }
    };

    return (
        <Layout className="room common">
            <Title className="title">{roomName}</Title>
            <Row>
                <Col span={17}>
                    <Row gutter={[16, 16]} className="video-container">
                        <Col span={span}>
                            <StyledVideo
                                muted
                                ref={userVideo}
                                autoPlay
                                playsInline
                            />
                        </Col>

                        {peers.map((peer, index) => {
                            let audioFlagTemp = true;
                            let videoFlagTemp = true;
                            if (userUpdate) {
                                userUpdate.forEach((entry) => {
                                    if (
                                        peer &&
                                        peer.peerID &&
                                        peer.peerID === entry.id
                                    ) {
                                        audioFlagTemp = entry.audioFlag;
                                        videoFlagTemp = entry.videoFlag;
                                    }
                                });
                            }
                            return (
                                <Col span={span} key={peer.peerID}>
                                    <Video peer={peer.peer} />
                                    <ControlSmall>
                                        <VideoControl
                                            videoFlag={videoFlagTemp}
                                            small
                                        />
                                        <AudioControl
                                            audioFlag={audioFlagTemp}
                                            small
                                        />
                                    </ControlSmall>
                                </Col>
                            );
                        })}
                    </Row>
                </Col>
                <Col span={7}>
                    <GroupChat roomId={room.id} />
                </Col>
            </Row>
            <ControlButtons
                leaveCall={handleLeaveCall}
                handleVideoControlClick={handleVideoControlClick}
                handleAudioControlClick={handleAudioControlClick}
            />
        </Layout>
    );
};

export default Room;
