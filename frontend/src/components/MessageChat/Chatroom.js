import { Layout, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Moment from "react-moment";
import { io } from "socket.io-client";
import { AiOutlineStepBackward } from "react-icons/ai";
import { BiDownload } from "react-icons/bi";
import send from "./send.png";

import { SendOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { ImAttachment, ImHome3 } from "react-icons/im";

const Chatroom = () => {
    const { Title } = Typography;
    const location = useLocation();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [reciever, setNotificationReciever] = useState("");
    const [data, setData] = useState({});
    const [media, setMedia] = useState({
        image: false,
        content: null,
        name: "",
        type: "",
        size: null,
    });
    const [msg, setMsg] = useState("");
    const [allmsg, setallMsg] = useState([]);
    const [nmsg, setNmsg] = useState();
    const [users, setUsers] = useState({});
    const [joined, setJoined] = useState(false);
    const [previewclose, setPreviewclose] = useState(false);
    const [socket, setSocket] = useState();
    const [typing, setTyping] = useState(false);
    const [isTyping, setIstyping] = useState(false);
    const [newreciever, setNewreciever] = useState("");
    const [newname, setNewname] = useState("");
    useEffect(() => {
        const socket = io("https://tempchatbackendsuvro.herokuapp.com/");

        setSocket(socket);

        socket.on("all_users", (users) => {
            setUsers(users);
        });

        socket.on("connect", () => {
            socket.emit("joinroom", location.state.room);
            setJoined(true);
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
    }, []);

    useEffect(() => {
        data.allmsgg &&
            data.allmsgg.map((m) => {
                if (m.name === data.reciever) allmsg.push(m);
            });
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
    }, [nmsg]);

    useEffect(() => {
        setData(location.state);
        setName(location.state.name);
    }, [location]);

    const uploadFile = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            if (file.size <= 600000) {
                setMedia({
                    ...media,
                    image: true,
                    content: reader.result,
                    name: file.name,
                    type: file.type,
                    size: file.size,
                });
            } else {
                alert("File size should be less than 550kb");
            }
        };
        reader.onerror = function (err) {
            console.log(err);
        };
        setPreviewclose(false);
    };

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
            const newmsg = { time: new Date(), msg: msg, name: data.name };
            socket.emit("newmsg", { newmsg, room: data.room });
            setMedia({ image: false });
            socket.emit("stop typing", data.room, reciever, name);
        }
        if (media.image === true && previewclose === false) {
            const newmsg = { time: new Date(), msg: media, name: data.name };
            socket.emit("newmsg", { newmsg, room: data.room });
            setMedia({ image: false });
        }
    };

    return (
        <Layout className="user-list common">
            <Title className="title">Chat Design</Title>
            <div className="chatdesign ">
                <div className="chat-container">
                    <div className="msgarea">
                        {allmsg &&
                            allmsg.map((newmsg, index) => {
                                return data.name === newmsg.name ? (
                                    <div
                                        className="row justify-content-end"
                                        key={index}
                                    >
                                        <div className="mymsgbox">
                                            <div>
                                                <strong className="m-1">
                                                    You
                                                </strong>
                                                <small className="text-muted">
                                                    <Moment fromNow>
                                                        {newmsg.time}
                                                    </Moment>
                                                </small>
                                            </div>
                                            {(!newmsg.msg.image ? (
                                                <h4 className="mymsg">
                                                    {newmsg.msg}
                                                </h4>
                                            ) : null) ||
                                                (newmsg.msg.image &&
                                                    (newmsg.msg.type ===
                                                        "video/mp4" ||
                                                        newmsg.msg.type ===
                                                            "video/mov" ||
                                                        newmsg.msg.type ===
                                                            "video/webm" ||
                                                        newmsg.msg.type ===
                                                            "video/ogv") && (
                                                        <h4 className="mymsg">
                                                            <div>
                                                                <video
                                                                    src={
                                                                        newmsg
                                                                            .msg
                                                                            .content
                                                                    }
                                                                    alt={
                                                                        newmsg.name
                                                                    }
                                                                    className="media"
                                                                    controls
                                                                ></video>
                                                                <div>
                                                                    <a
                                                                        href={
                                                                            newmsg
                                                                                .msg
                                                                                .content
                                                                        }
                                                                        download
                                                                        className="mydownload"
                                                                    >
                                                                        {
                                                                            newmsg
                                                                                .msg
                                                                                .name
                                                                        }
                                                                        <span className="downloadicon">
                                                                            <BiDownload />
                                                                        </span>
                                                                    </a>
                                                                </div>
                                                            </div>{" "}
                                                        </h4>
                                                    )) ||
                                                (newmsg.msg.image &&
                                                    newmsg.msg.type ===
                                                        "application/pdf" && (
                                                        <h4 className="mymsg">
                                                            {" "}
                                                            <div>
                                                                <object
                                                                    data={
                                                                        newmsg
                                                                            .msg
                                                                            .content
                                                                    }
                                                                    alt={
                                                                        newmsg.name
                                                                    }
                                                                    className="pdfbox"
                                                                />
                                                                <div>
                                                                    <a
                                                                        href={
                                                                            newmsg
                                                                                .msg
                                                                                .content
                                                                        }
                                                                        download
                                                                        className="mydownload"
                                                                    >
                                                                        {
                                                                            newmsg
                                                                                .msg
                                                                                .name
                                                                        }
                                                                        <span className="downloadicon">
                                                                            <BiDownload />
                                                                        </span>
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </h4>
                                                    )) ||
                                                (newmsg.msg.image &&
                                                    (newmsg.msg.type ===
                                                        "image/jpg" ||
                                                        newmsg.msg.type ===
                                                            "image/jpeg" ||
                                                        newmsg.msg.type ===
                                                            "image/png" ||
                                                        newmsg.msg.type ===
                                                            "image/jfif" ||
                                                        newmsg.msg.type ===
                                                            "image/webp" ||
                                                        newmsg.msg.type ===
                                                            "image/gif" ||
                                                        newmsg.msg.type ===
                                                            "image/tiff") && (
                                                        <h4 className="mymsg">
                                                            {
                                                                <div>
                                                                    <img
                                                                        src={
                                                                            newmsg
                                                                                .msg
                                                                                .content
                                                                        }
                                                                        alt={
                                                                            newmsg
                                                                                .msg
                                                                                .name
                                                                        }
                                                                        className="media"
                                                                    />
                                                                    <div>
                                                                        <a
                                                                            href={
                                                                                newmsg
                                                                                    .msg
                                                                                    .content
                                                                            }
                                                                            download
                                                                            className="mydownload"
                                                                        >
                                                                            {
                                                                                newmsg
                                                                                    .msg
                                                                                    .name
                                                                            }
                                                                            <span className="downloadicon">
                                                                                <BiDownload />
                                                                            </span>
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            }
                                                        </h4>
                                                    )) ||
                                                (newmsg.msg.image &&
                                                    (newmsg.msg.type ===
                                                        "audio/mpeg" ||
                                                        newmsg.msg.type ===
                                                            "audio/ogg" ||
                                                        newmsg.msg.type ===
                                                            "audio/wav" ||
                                                        newmsg.msg.type ===
                                                            "audio/mp3") && (
                                                        <h4 className="mymsg">
                                                            {" "}
                                                            <div>
                                                                <audio
                                                                    src={
                                                                        newmsg
                                                                            .msg
                                                                            .content
                                                                    }
                                                                    alt={
                                                                        newmsg.name
                                                                    }
                                                                    className="media"
                                                                    controls
                                                                ></audio>
                                                                <div>
                                                                    <a
                                                                        href={
                                                                            newmsg
                                                                                .msg
                                                                                .content
                                                                        }
                                                                        download
                                                                        className="mydownload"
                                                                    >
                                                                        {
                                                                            newmsg
                                                                                .msg
                                                                                .name
                                                                        }
                                                                        <span className="downloadicon">
                                                                            <BiDownload />
                                                                        </span>
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </h4>
                                                    )) ||
                                                (newmsg.msg.image && (
                                                    <h4 className="mymsg">
                                                        {" "}
                                                        <div>
                                                            <h5>
                                                                Sorry No Preview
                                                                Available
                                                            </h5>
                                                            <div>
                                                                <a
                                                                    href={
                                                                        newmsg
                                                                            .msg
                                                                            .content
                                                                    }
                                                                    download
                                                                    className="mydownload"
                                                                >
                                                                    {
                                                                        newmsg
                                                                            .msg
                                                                            .name
                                                                    }
                                                                    <span className="downloadicon">
                                                                        <BiDownload />
                                                                    </span>
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </h4>
                                                ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="row justify-content-start">
                                        <div className="othermsgbox">
                                            <div>
                                                <strong className="m-1">
                                                    {newmsg.name}
                                                </strong>
                                                <small className="text-muted">
                                                    <Moment fromNow>
                                                        {newmsg.time}
                                                    </Moment>
                                                </small>
                                            </div>
                                            {(!newmsg.msg.image ? (
                                                <h4 className="othermsg">
                                                    {newmsg.msg}
                                                </h4>
                                            ) : null) ||
                                                (newmsg.msg.image === true &&
                                                    (newmsg.msg.type ===
                                                        "video/mp4" ||
                                                        newmsg.msg.type ===
                                                            "video/mov" ||
                                                        newmsg.msg.type ===
                                                            "video/webm" ||
                                                        newmsg.msg.type ===
                                                            "video/ogv") && (
                                                        <h4 className="othermsg">
                                                            <div>
                                                                <video
                                                                    src={
                                                                        newmsg
                                                                            .msg
                                                                            .content
                                                                    }
                                                                    alt={
                                                                        newmsg.name
                                                                    }
                                                                    className="media"
                                                                    controls
                                                                ></video>
                                                                <div>
                                                                    <a
                                                                        href={
                                                                            newmsg
                                                                                .msg
                                                                                .content
                                                                        }
                                                                        download
                                                                        className="otherdownload"
                                                                    >
                                                                        {
                                                                            newmsg
                                                                                .msg
                                                                                .name
                                                                        }
                                                                        <span className="downloadicon">
                                                                            <BiDownload />
                                                                        </span>
                                                                    </a>
                                                                </div>
                                                            </div>{" "}
                                                        </h4>
                                                    )) ||
                                                (newmsg.msg.image === true &&
                                                    newmsg.msg.type ===
                                                        "application/pdf" && (
                                                        <h4 className="othermsg">
                                                            {" "}
                                                            <div>
                                                                <iframe
                                                                    src={
                                                                        newmsg
                                                                            .msg
                                                                            .content
                                                                    }
                                                                    alt={
                                                                        newmsg.name
                                                                    }
                                                                    className="pdfbox"
                                                                />
                                                                <div>
                                                                    <a
                                                                        href={
                                                                            newmsg
                                                                                .msg
                                                                                .content
                                                                        }
                                                                        download
                                                                        className="otherdownload"
                                                                    >
                                                                        {
                                                                            newmsg
                                                                                .msg
                                                                                .name
                                                                        }
                                                                        <span className="downloadicon">
                                                                            <BiDownload />
                                                                        </span>
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </h4>
                                                    )) ||
                                                (newmsg.msg.image === true &&
                                                    (newmsg.msg.type ===
                                                        "image/jpg" ||
                                                        newmsg.msg.type ===
                                                            "image/jpeg" ||
                                                        newmsg.msg.type ===
                                                            "image/png" ||
                                                        newmsg.msg.type ===
                                                            "image/jfif" ||
                                                        newmsg.msg.type ===
                                                            "image/webp" ||
                                                        newmsg.msg.type ===
                                                            "image/gif" ||
                                                        newmsg.msg.type ===
                                                            "image/tiff") && (
                                                        <h4 className="othermsg">
                                                            {
                                                                <div>
                                                                    <img
                                                                        src={
                                                                            newmsg
                                                                                .msg
                                                                                .content
                                                                        }
                                                                        alt={
                                                                            newmsg
                                                                                .msg
                                                                                .name
                                                                        }
                                                                        className="media"
                                                                    />
                                                                    <div>
                                                                        <a
                                                                            href={
                                                                                newmsg
                                                                                    .msg
                                                                                    .content
                                                                            }
                                                                            download
                                                                            className="otherdownload"
                                                                        >
                                                                            {
                                                                                newmsg
                                                                                    .msg
                                                                                    .name
                                                                            }
                                                                            <span className="downloadicon">
                                                                                <BiDownload />
                                                                            </span>
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            }
                                                        </h4>
                                                    )) ||
                                                (newmsg.msg.image === true &&
                                                    (newmsg.msg.type ===
                                                        "audio/mpeg" ||
                                                        newmsg.msg.type ===
                                                            "audio/ogg" ||
                                                        newmsg.msg.type ===
                                                            "audio/wav" ||
                                                        newmsg.msg.type ===
                                                            "audio/mp3") && (
                                                        <h4 className="othermsg">
                                                            {" "}
                                                            <div>
                                                                <audio
                                                                    src={
                                                                        newmsg
                                                                            .msg
                                                                            .content
                                                                    }
                                                                    alt={
                                                                        newmsg.name
                                                                    }
                                                                    className="media"
                                                                    controls
                                                                ></audio>
                                                                <div>
                                                                    <a
                                                                        href={
                                                                            newmsg
                                                                                .msg
                                                                                .content
                                                                        }
                                                                        download
                                                                        className="otherdownload"
                                                                    >
                                                                        {
                                                                            newmsg
                                                                                .msg
                                                                                .name
                                                                        }
                                                                        <span className="downloadicon">
                                                                            <BiDownload />
                                                                        </span>
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </h4>
                                                    )) ||
                                                (newmsg.msg.image === true && (
                                                    <h4 className="othermsg">
                                                        {" "}
                                                        <div>
                                                            <h5>
                                                                Sorry No Preview
                                                                Available
                                                            </h5>
                                                            <div>
                                                                <a
                                                                    href={
                                                                        newmsg
                                                                            .msg
                                                                            .content
                                                                    }
                                                                    download
                                                                    className="otherdownload"
                                                                >
                                                                    {
                                                                        newmsg
                                                                            .msg
                                                                            .name
                                                                    }
                                                                    <span className="downloadicon">
                                                                        <BiDownload />
                                                                    </span>
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </h4>
                                                ))}
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
                    <div>
                        {media.image === true && previewclose === false ? (
                            <span className="previewmediabox">
                                <span className="previewmedianame">
                                    {media.name}
                                </span>
                                <span
                                    className="previewmediaclose"
                                    onClick={() => {
                                        setPreviewclose(true);
                                    }}
                                >
                                    +
                                </span>
                            </span>
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
                        <input
                            type="file"
                            id="files"
                            hidden
                            onChange={uploadFile}
                        />
                        <label htmlFor="files" className="attachment-btn">
                            <ImAttachment />
                        </label>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Chatroom;
