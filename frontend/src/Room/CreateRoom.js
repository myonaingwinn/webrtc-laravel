import { Button, Form, Input, Card, Col, Row } from "antd";
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import Image from "../Room/Image";
import styled from "styled-components";
import Picker from "emoji-picker-react";

const formItemLayout = {
  labelCol: {
    xs: {
      span: 8,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 24,
      offset: 8,
    },
  },
};

const Page = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  align-items: center;
  flex-direction: column;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 500px;
  max-height: 500px;
  overflow: auto;
  width: 400px;
  border: 1px solid black;
  border-radius: 10px;
  padding-bottom: 10px;
  margin-top: 25px;
`;

const TextArea = styled.textarea`
  width: 98%;
  height: 100px;
  border-radius: 10px;
  margin-top: 10px;
  padding-left: 10px;
  padding-top: 10px;
  font-size: 17px;
  background-color: transparent;
  border: 1px solid black;
  outline: none;
  color: black;
  letter-spacing: 1px;
  line-height: 20px;
  ::placeholder {
    color: lightgray;
  }
`;

const MyRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`;

const MyMessage = styled.div`
  width: 45%;
  background-color: pink;
  color: black;
  padding: 10px;
  margin-right: 5px;
  text-align: center;
  border-top-right-radius: 10%;
  border-bottom-right-radius: 10%;
`;

const PartnerRow = styled(MyRow)`
  justify-content: flex-start;
`;

const PartnerMessage = styled.div`
  width: 45%;
  background-color: transparent;
  color: black;
  border: 1px solid lightgray;
  padding: 10px;
  margin-left: 5px;
  text-align: center;
  border-top-left-radius: 10%;
  border-bottom-left-radius: 10%;
`;

const socket = io("http://localhost:5000");

const CreateRoom = () => {
  const [form] = Form.useForm();
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [room, setRoom] = useState("");
  const localVideo = useRef();
  const [display, setDisplay] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [joinedRoom, setJoinedRoom] = useState(false);
  const [normal, setNormal] = useState(true);
  const [stream, setStream] = useState();
  const [socketId, setSocketId] = useState("");
  const [users, setUsers] = useState([]);
  const [joinedList, setJoinedList] = useState([]);
  const [leftList, setLeftList] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [chat, setChat] = useState([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const [file, setFile] = useState();
  const chatContainer = useRef(null);

  const selectFile = (e) => {
    setMessage(e.target.files[0].name);
    setFile(e.target.files[0]);
  };

  const onEmojiClick = (event, emojiObject) => {
    setMessage(message + emojiObject.emoji);
  };

  useEffect(() => {
    socket.on("me", (id) => {
      setSocketId(id);
      console.log("Your id is ", id);
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

    socket.on("message", (messages) => {
      receivedMessage(messages);
    });

    if (showChat === true) {
      chatContainer.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }

    if (joinedRoom === true) {
      console.log("you are in the room...");
    }
  }, [messages, rooms]);

  const handleSubmit = async () => {
    setDisplay(false);
    if (!(roomName === "")) {
      setRoomName(roomName);
      form.resetFields();
      console.log("user id is ", socketId);
      console.log("room name is ", roomName);
      socket.emit("create_room", roomName);
      socket.on("get_room", (room) => {
        setRooms([...rooms, room]);
        console.log("room id is ", room.id);
      });
    }
    setNormal(true);
  };

  const createRoom = () => {
    setDisplay(true);
    setNormal(false);
  };

  const joinRoom = (room) => {
    setNormal(false);
    setJoinedRoom(true);
    socket.emit("join_room", room);
    setRoom(room.id);
    console.log('user ', socketId, ' joined room: ', room.id);
    console.log('maximum participants allowed are ', room.maxParticipantsAllowed);
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      setStream(stream)
      localVideo.current.srcObject = stream
    })

    socket.on("full", async function (room) {
      window.location.href = "/";
      alert("This Room has reached Maximum Limit!");
      console.log("this room ", room.id, "is full!");
      console.log("users has reached maximum limit!");
    });

    socket.on("updateUsers", (users) => {
      setUsers(users);
    });

  };

  const deleteRoom = (room) => {
    console.log('delete room id is', room.id);
    socket.emit("delete_room", room);
    window.location.href = "/";
  }

  function receivedMessage(message) {
    setMessages([...messages, message]);
  }

  const leaveRoom = (room) => {
    socket.emit("leave_room", room);
    console.log("user ", socketId, " leave from room ", room);
    window.location.href = "/";
  };

  const callUser = (user) => {
    console.log("you are calling ", user);
  };

  const sendMessage = () => {
    if (file) {
      const messageObject = {
        id: socketId,
        type: "file",
        body: file,
        mimeType: file.type,
        fileName: file.name,
      };
      setMessage("");
      setFile();
      socket.emit("send message", { ...messageObject });
      console.log(messageObject);
    } else {
      const messageObject = {
        body: message,
        id: socketId,
        type: "text",
      };
      setMessage("");
      setShowEmoji(false);
      socket.emit("send message", { ...messageObject });
      console.log(messageObject);
    }
  };

  const chatUser = () => {
    setShowChat(true);
    setNormal(false);
  };

  function renderMessages(message, index) {
    if (message.type === "file") {
      const blob = new Blob([message.body], { type: message.type });
      if (message.id === socketId) {
        return (
          <MyRow key={index}>
            <Image fileName={message.fileName} blob={blob} />
          </MyRow>
        );
      }
      return (
        <PartnerRow key={index}>
          <Image fileName={message.fileName} blob={blob} />
        </PartnerRow>
      );
    }
    if (message.id === socketId) {
      return (
        <MyRow key={index}>
          <MyMessage>{message.body}</MyMessage>
        </MyRow>
      );
    }
    return (
      <PartnerRow key={index}>
        <PartnerMessage>{message.body}</PartnerMessage>
      </PartnerRow>
    );
  }

  return (
    <>
      {normal && (
        <div
          className="container"
          style={{
            display: normal ? "block" : "none",
          }}
        >
          <div className="rooms-container">
            <h2 className="rooms_heading" style={{ textAlign: "center" }}>
              Available Rooms:
            </h2>
            <Button type="primary" htmlType="submit" onClick={createRoom}>
              Create Room
            </Button>
            {rooms.length === 0 ? (
              <h3 className="no_rooms" style={{ textAlign: "center" }}>
                No Rooms! Create a room !
              </h3>
            ) : (
              <Row gutter={16}>
                {rooms.map((room) => {
                  return (
                    <Col className="gutter-row" span={6} key={room.id}>
                      <Card size="small" title={room.roomName}>
                        <button onClick={() => joinRoom(room)}>
                          Join Room
                        </button>
                        <button onClick={() => deleteRoom(room)}>
                          Delete Room
                        </button>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            )}
          </div>
          <div className="users-container">
            <h2 className="users_heading" style={{ textAlign: "center" }}>
              Online Users:
            </h2>
            <Row gutter={16}>
              {users.map((user) =>
                user !== socketId ? (
                  <Col className="gutter-row" span={6} key={user}>
                    <Card size="small" title={user}>
                      <Button onClick={() => callUser(user)}>Call</Button>
                      <Button onClick={() => chatUser(user)}>Chat</Button>
                    </Card>
                  </Col>
                ) : null
              )}
            </Row>
          </div>
        </div>
      )}

      {joinedRoom && (
        <>
          <div className="video-container" style={{ marginTop: "50px" }}>
            {/* <video
              playsInline
              muted
              ref={localVideo}
              autoPlay
              style={{ width: "500px", marginLeft: "500px" }}
            /> */}
            <h1>Video Group Chat Will be here!</h1>
          </div>
          <div className="leave-room">
            <button className="btn btn-primary" onClick={() => leaveRoom(room)}>
              Leave Room
            </button>
          </div>
        </>
      )}

      {display && (
        <div
          className="site-card-wrapper"
          style={{
            display: display ? "block" : "none",
          }}
        >
          <Card
            title="Room Creation"
            style={{
              textAlign: "center",
              width: "800px",
              margin: "0 auto",
              marginTop: "80px",
            }}
          >
            <Form
              {...formItemLayout}
              form={form}
              name="room"
              style={{
                marginTop: "30px",
                marginRight: "200px",
              }}
              colon={false}
              requiredMark={false}
            >
              <Form.Item
                name="roomName"
                label="Room Name"
                id="name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                rules={[
                  {
                    required: true,
                    message: "Please input room name!",
                  },
                ]}
              >
                <Input placeholder="Enter room name" />
              </Form.Item>

              <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit" onClick={handleSubmit}>
                  Create
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      )}

      {showChat && (
        <div
          className="chat-container"
          style={{
            display: showChat ? "block" : "none",
          }}
        >
          <ul className="chat-list" id="chat-list" ref={chatContainer}>
            {chat.map((chat, idx) => (
              <li
                key={idx}
                className={chat.writer === socketId ? "chat-me" : "chat-user"}
              >
                {chat.writer === socketId
                  ? `${chat.message}: ME*`
                  : `User (${chat.writer.slice(0, 5)}): ${chat.message}`}
              </li>
            ))}
          </ul>

          <Page>
            <Container>{messages.map(renderMessages)}</Container>
            <Form onSubmit={(e) => e.preventDefault()}>
              <TextArea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Say something..."
              />
              <input onChange={selectFile} type="file" />
              <button
                className="emoji_btn"
                type="button"
                onClick={() => setShowEmoji(!showEmoji)}
              >
                Emoji
              </button>
              <Button onClick={sendMessage}>Send</Button>
            </Form>
            {showEmoji && (
              <Picker
                onEmojiClick={onEmojiClick}
                pickerStyle={{
                  width: "20%",
                  left: "0",
                  bottom: "270px",
                  backgroundColor: "#fff",
                }}
              />
            )}
          </Page>
        </div>
      )}
    </>
  );
};

export default CreateRoom;
