import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import {
    getNanoId,
    localStorageGet,
    signalServerUrl,
} from "../../helpers/Utilities";
import { Button, Form, Input } from "antd";

const socket = io(signalServerUrl);

const GroupChat = (props) => {
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);
    const { uuid, name } = localStorageGet("user");

    // scroll
    const chatContainer = useRef(null);

    useEffect(() => {
        // Rooms
        socket.on("chat", (payload) => {
            setChat(payload.chat);
        });
    }, [chat]);

    const sendMessage = async (e) => {
        const payload = {
            message,
            room: props.roomId,
            userId: uuid,
            userName: name,
        };
        socket.emit("message", payload);
        setMessage("");
        socket.on("chat", (payloadd) => {
            setChat(payloadd.chat);
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
                            className={`chat-blk ${chat.senderId === uuid ? "chat-me" : ""
                                }`}
                        >
                            {chat.senderId === uuid
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
