import { useNavigate } from "react-router-dom";
import {
    Layout,
    Typography,
    Card,
    Col,
    Row,
    Avatar,
    Button,
    Modal,
} from "antd";
import {
    PhoneOutlined,
    MessageOutlined,
    AudioOutlined,
    VideoCameraOutlined,
    AudioMutedOutlined,
} from "@ant-design/icons";
import { useEffect, useState, useRef } from "react";
import Peer from "simple-peer";
import VideoOff from "../../assets/styles/User/video-off.svg";
import { localStorageGet } from "../../helpers/Utilities";
import { socket } from "../Login/Login";
const { Content } = Layout;

const UserList = () => {
    const user = localStorageGet("user");
    const { Title } = Typography;
    const userName = user.name;
    const [callUI, setCallUI] = useState(false);
    const [userList, setUserList] = useState([]);
    const [clientId, setClientId] = useState([]);
    const myVideo = useRef();
    const remoteVideo = useRef();
    const connectionRef = useRef();
    const control = { video: true, audio: true };
    const [receivingCall, setReceivingCall] = useState(false);
    const [callAccepted, setCallAccepted] = useState(false);

    const me = user.me;
    const username = user.name;
    const [caller, setCaller] = useState("");
    const [callerSignal, setCallerSignal] = useState();

    const [mic, setMic] = useState(true);
    const [video, setVideo] = useState(true);

    const navigate = useNavigate();
    const [data, setData] = useState({
        name: "",
        room: "",
        reciever: "",
        allmsgg: [],
    });
    const [name, setName] = useState("");

    const [gotoprivate, setGotoprivate] = useState(false);

    useEffect(() => {
        console.log("Using use Effect");
        socket.on(
            "getAllUsers",
            (users) => {
                setUserList(users);
            },
            []
        );
        socket.on("updateAllUsers", (users) => {
            setUserList(users);
        });
        socket.on("callUser", (data) => {
            setReceivingCall(true);
            setCaller(data.from);
            setName(data.name);
            setClientId(data.from);
            setCallerSignal(data.signal);
        });
    }, []);

    const controlMic = () => {
        setMic(!mic);
    };

    const controlVideo = () => {
        setVideo(!video);
    };

    const peerCall = async (id) => {
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
            remoteVideo.current.srcObject = stream;
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
            remoteVideo.current.srcObject = stream;
        });
        peer.signal(callerSignal);
        connectionRef.current = peer;
    };

    const callEndAction = () => {
        connectionRef.current.destroy();
        socket.emit("endCall", { id: clientId });

        setCallUI(false);
    };

    const orderId = (id) => {
        if (me > id) {
            return me + "-" + id;
        } else {
            return id + "-" + me;
        }
    };

    const privatechat = (id, reciver) => {
        setGotoprivate(true);

        const room = orderId(id);

        setData({
            name: username,
            room: room,
            reciever: reciver,
        });

        console.log("UserListreciver name", reciver, id);
        console.log("UserListsender name", userName);
    };

    useEffect(() => {
        if (gotoprivate) navigate(`/chat/${data.room}`, { state: data });
    }, [gotoprivate, data, navigate]);

    return (
        <>
            <Modal
                title="Basic Modal"
                visible={receivingCall && !callAccepted}
                onOk={answerCall}
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
                                                    onClick={() =>
                                                        privatechat(
                                                            user.userId,
                                                            user.name
                                                        )
                                                    }
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
                    <video
                        className="localVideo"
                        ref={myVideo}
                        autoPlay
                    ></video>
                    <video
                        className="remoteVideo"
                        ref={remoteVideo}
                        autoPlay
                    ></video>
                    <div className="controlBtn">
                        <Button className="leaveBtn" onClick={callEndAction}>
                            Leave
                        </Button>
                        <Button type="text" onClick={controlVideo}>
                            {video ? <AudioOutlined /> : <AudioMutedOutlined />}
                        </Button>
                        <Button type="text" onClick={controlMic}>
                            {mic ? (
                                <VideoCameraOutlined />
                            ) : (
                                <img src={VideoOff} alt="video off icon" />
                            )}
                        </Button>
                    </div>
                </Content>
            </Layout>
        </>
    );
};

export default UserList;
