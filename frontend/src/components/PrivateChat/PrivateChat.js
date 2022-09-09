import { Layout, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Moment from "react-moment";
import { io } from "socket.io-client";
import { SendOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { getNanoId } from "../../helpers/Utilities";

const PrivateChat = () => {
    const { Title } = Typography;
    const location = useLocation();
    const [name, setName] = useState("");
    const [data, setData] = useState({});
    const [msg, setMsg] = useState("");
    const [allmsg, setallMsg] = useState([]);
    const [nmsg, setNmsg] = useState();
    const [socket, setSocket] = useState();
    const [typing, setTyping] = useState(false);
    const [isTyping, setIstyping] = useState(false);
    const [newreciever, setNewreciever] = useState("");
    const [newname, setNewname] = useState("");
    useEffect(() => {
        const socket = io("http://localhost:5000");

        setSocket(socket);

        socket.on("connect", () => {
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
    }, [socket, allmsg]);

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
        <Layout className="private-chat">
            <Title className="title">
                Chat with <em>{data.reciever}</em>
            </Title>
            <div className="chatdesign ">
                <div className="chat-container">
                    <div className="msgarea">
                        {allmsg &&
                            allmsg.map((newmsg, index) => {
                                return data.name === newmsg.name ? (
                                    <div
                                        className="row justify-content-end"
                                        key={getNanoId()}
                                    >
                                        <div className="mymsgbox">
                                            <strong className="m-1">
                                                You&nbsp;
                                            </strong>
                                            <small className="text-muted">
                                                <Moment fromNow>
                                                    {newmsg.time}
                                                </Moment>
                                            </small>

                                            <h4 className="mymsg">
                                                {newmsg.msg}
                                            </h4>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className="row justify-content-start"
                                        key={getNanoId()}
                                    >
                                        <div className="othermsgbox">
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
                            (isTyping &&
                                data.room.length < 15 &&
                                name !== newname) ? (
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
                        <input
                            type="text"
                            className="typing-input"
                            name="message"
                            placeholder="Type your message here......"
                            value={msg}
                            onChange={inputHandler}
                            onKeyDown={forentersent}
                            autoComplete="off"
                        />
                        <Button
                            onClick={submitHandler}
                            icon={<SendOutlined />}
                            className="send-button"
                        ></Button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default PrivateChat;
