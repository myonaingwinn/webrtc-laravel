import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { getNanoId, localStorageGet } from "../../helpers/Utilities";
import { Button, Form, Input, Space } from "antd";

const socket = io("http://localhost:5000");

const GroupChat = (props) => {
    const [socketId, setSocketId] = useState("");
    const [message, setMessage] = useState("");
    const [users, setUsers] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [joinedRoom, setJoinedRoom] = useState(false);
    const [chat, setChat] = useState([]);
    const { id, name } = localStorageGet("user");

    // scroll
    const chatContainer = useRef(null);

    useEffect(() => {
        socket.on("me", (id) => {
            setSocketId(id);
        });

        socket.on("disconnect", () => {
            socket.disconnect();
        });

        // Rooms
        socket.on("chat", (payload) => {
            setChat(payload.chat);
        });

        if (joinedRoom === true) {
            chatContainer.current.scrollIntoView({
                behavior: "smooth",
                block: "end",
            });
        }
    }, [chat, rooms]);

    const sendMessage = async (e) => {
        const payload = {
            message,
            room: props.roomId,
            userId: id,
            userName: name,
        };
        socket.emit("message", payload);
        setMessage("");
        socket.on("chat", (payloadd) => {
            setChat(payloadd.chat);
            console.log(payloadd.chat);
            console.log(payloadd);
        });
        chatContainer.current.scrollIntoView({
            behavior: "smooth",
            block: "end",
        });
    };

    return (
        <div className="group-chat">
            <div className="chat-container">
                <div
                    className="chat-content"
                    id="chat-list"
                    ref={chatContainer}
                >
                    {chat.map((chat, idx) => (
                        <div
                            key={getNanoId()}
                            className={`chat-blk ${
                                chat.senderId === id ? "chat-me" : ""
                            }`}
                        >
                            {chat.senderId === id
                                ? `${chat.message} : ME`
                                : `${chat.senderName} : ${chat.message}`}
                        </div>
                    ))}
                </div>
            </div>

            <Form className="chat-form" onSubmit={(e) => e.preventDefault()}>
                <Input
                    type="text"
                    placeholder="Your message ..."
                    autoFocus
                    onChange={(e) => {
                        setMessage(e.target.value);
                    }}
                    value={message}
                />
                <Button
                    type="primary"
                    htmlType="submit"
                    onClick={() => sendMessage()}
                >
                    Send
                </Button>
            </Form>
        </div>
    );
};

export default GroupChat;
