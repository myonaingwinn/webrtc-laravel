import { Input, Layout, Typography, Button } from "antd";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Moment from "react-moment";
import { SendOutlined } from "@ant-design/icons";
import { getNanoId } from "../../helpers/Utilities";
import { socket } from "../../helpers/SocketClient";

const PrivateChat = () => {
    const { Title } = Typography;
    const location = useLocation();
    const [name, setName] = useState("");
    const [data, setData] = useState({});
    const [msg, setMsg] = useState("");
    const [allmsg, setallMsg] = useState([]);
    const [nmsg, setNmsg] = useState();
    const [typing, setTyping] = useState(false);
    const [isTyping, setIstyping] = useState(false);
    const [newreciever, setNewreciever] = useState("");
    const [newname, setNewname] = useState("");

    useEffect(() => {
        socket.emit("joinroom", location.state.room);
        socket.on("typing", (reciever, name) => {
            setIstyping(true);
            setNewreciever(reciever);
            setNewname(name);
        });

        socket.on("stop typing", (reciever, name) => {
            setIstyping(false);
            setNewreciever(reciever);
            setNewname(name);
        });
    }, [location.state.room]);

    useEffect(() => {
        data.allmsgg &&
            data.allmsgg.forEach((m) => {
                if (m.name === data.reciever) allmsg.push(m);
            });

        // eslint-disable-next-line
    }, [data.allmsgg, location]);

    useEffect(() => {
        if (socket) {
            socket.on("getnewmsg", (newmsg) => {
                setallMsg([...allmsg, newmsg]);
                setNmsg(newmsg);
            });
        }
    }, [allmsg]);

    useEffect(() => {
        if (socket) {
            socket.emit(
                "notification",
                data.name,
                data.reciever,
                nmsg,
                data.room
            );
            if (data.name !== data.reciever) setMsg("");
        }

        // eslint-disable-next-line
    }, [nmsg]);

    useEffect(() => {
        setData(location.state);
        setName(location.state.name);
    }, [location]);

    const inputHandler = (e) => {
        setMsg(e.target.value);
        if (!socket) return;
        if (!typing) {
            setTyping(true);
            socket.emit("typing", data.room, data.reciever, name);
        }

        let lasttypingtime = new Date().getTime();
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timediff = timeNow - lasttypingtime;
            if (timediff >= 3000 && typing) {
                socket.emit("stop typing", data.room, data.reciever, name);
                setTyping(false);
            }
        }, 3000);
    };
    const forentersent = (e) => (e.keyCode === 13 ? submitHandler() : "");

    const submitHandler = (e) => {
        if (msg) {
            const newmsg = {
                time: new Date(),
                msg: msg,
                name: data.name,
                reciever: data.reciever,
            };

            socket.emit("newmsg", { newmsg, room: data.room });

            socket.emit("stop typing", data.room, data.reciever, name);
        }
    };

    return (
        <Layout className="private-chat common">
            <Title className="title">
                Chat with <em>{data.reciever}</em>
            </Title>
            <div className="chat-container">
                <div className="msgarea">
                    {allmsg &&
                        allmsg.map((newmsg) => {
                            return data.name === newmsg.name ? (
                                <div
                                    className="row justify-content-end msgbox"
                                    key={getNanoId()}
                                >
                                    <div className="mine">
                                        <strong className="m-1">
                                            You&nbsp;
                                        </strong>
                                        <small className="text-muted">
                                            <Moment fromNow>
                                                {newmsg.time}
                                            </Moment>
                                        </small>

                                        <h4 className="mymsg">{newmsg.msg}</h4>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className="row justify-content-start msgbox"
                                    key={getNanoId()}
                                >
                                    <div className="other">
                                        <div>
                                            <strong className="m-1">
                                                {newmsg.name}&nbsp;
                                            </strong>
                                            <small className="text-muted">
                                                <Moment fromNow>
                                                    {newmsg.time}
                                                </Moment>
                                            </small>
                                        </div>

                                        <h4 className="othermsg">
                                            {newmsg.msg}
                                        </h4>
                                    </div>
                                </div>
                            );
                        })}
                    {(isTyping && name === newreciever) ||
                    (isTyping && data.room.length < 15 && name !== newname) ? (
                        <div className="typing">
                            <strong style={{ textTransform: "capitalize" }}>
                                {newname}
                            </strong>
                            <div style={{ color: "rgb(120, 2, 255)" }}>
                                Typing...
                            </div>
                        </div>
                    ) : null}
                </div>

                <div className="typing-area">
                    <Input.Group
                        size="large"
                        style={{ width: "calc(100% + 30px)", height: "30px" }}
                    >
                        <Input
                            style={{
                                width: "calc(100% - 50px)",
                                height: "4.5vh",
                                borderRadius: "12px",
                                marginRight: "10px",
                            }}
                            placeholder="Type your message here......"
                            value={msg}
                            onChange={inputHandler}
                            onKeyDown={forentersent}
                            autoComplete="off"
                        />
                        <Button
                            type="primary"
                            size="large"
                            icon={<SendOutlined />}
                            shape="circle"
                            onClick={submitHandler}
                        ></Button>
                    </Input.Group>
                </div>
            </div>
        </Layout>
    );
};

export default PrivateChat;
