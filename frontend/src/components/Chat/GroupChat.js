import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import Picker from "emoji-picker-react";
import { localStorageGet } from "../../helpers/Utilities";

const socket = io("http://localhost:5000");

const GroupChat = (props) => {
    const [socketId, setSocketId] = useState("");
    const [message, setMessage] = useState("");
    const [users, setUsers] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [joinedRoom, setJoinedRoom] = useState(false);
    const [room, setRoom] = useState("");
    const [chat, setChat] = useState([]);
    const [showEmoji, setShowEmoji] = useState(false);
    const [value, setValue] = useState("");
    const { chatId, creds } = props;
    const socketRef = useRef();
    const { id } = localStorageGet("user");

    const handleSubmit = (event) => {
        event.preventDefault();

        const text = value.trim();

        if (text.length > 0) {
            sendMessage(creds, chatId, {
                text: "",
            });
        }

        setValue("");
    };

    //Emoji

    const onEmojiClick = (event, emojiObject) => {
        setMessage(message + emojiObject.emoji);
    };
    // scroll
    const chatContainer = useRef(null);

    useEffect(() => {
        socket.on("me", (id) => {
            setSocketId(id);
        });

        socket.on("disconnect", () => {
            socket.disconnect();
        });

        socket.on("getAllUsers", (users) => {
            setUsers(users);
        });
        // Real time
        socket.on("updateUsers", (users) => {
            setUsers(users);
        });

        socket.on("getAllRooms", (rooms) => {
            setRooms(rooms);
        });

        // Real time
        socket.on("updateRooms", (rooms) => {
            setRooms(rooms);
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
        const payload = { message, room: props.roomId, userId: id };
        socket.emit("message", payload);

        setMessage("");
        setFile();
        socket.on("chat", (payloadd) => {
            setChat(payloadd.chat);
            console.log(payloadd.chat);
            console.log(payloadd);
        });
        chatContainer.current.scrollIntoView({
            behavior: "smooth",
            block: "end",
        });
        setShowEmoji(false);
    };

    return (
        <>
            <h1 className="main_heading">Chat App</h1>
            <h1 className="my_socket">Me: {socket.id}</h1>

            <div className="chat-container">
                <ul className="chat-list" id="chat-list" ref={chatContainer}>
                    {chat.map((chat, idx) => (
                        <li>
                            {chat.writer === socket.id
                                ? `${chat.message}: ME*`
                                : `User (${chat.writer}): ${chat.message}`}
                        </li>
                    ))}
                </ul>
            </div>

            <form className="chat-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Your message ..."
                    autoFocus
                    onChange={(e) => {
                        setMessage(e.target.value);
                    }}
                    value={message}
                />

                <button
                    className="emoji_btn"
                    type="button"
                    onClick={() => setShowEmoji(!showEmoji)}
                >
                    Emoji
                </button>
                <button
                    className="send_btn"
                    type="submit"
                    onClick={() => sendMessage()}
                >
                    Send
                </button>
            </form>
            {showEmoji && (
                <Picker
                    onEmojiClick={onEmojiClick}
                    pickerStyle={{
                        width: "20%",
                        display: "absolute",
                        left: "0",
                        bottom: "270px",
                        backgroundColor: "#fff",
                    }}
                />
            )}
        </>
    );
};

export default GroupChat;
