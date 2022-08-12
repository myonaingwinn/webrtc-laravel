import React, { useEffect, useState, useRef } from "react";
import { Button, Form, Input, Card, Col, Row, Modal } from "antd";
import Peer from "simple-peer";
import io from "socket.io-client";
import "./Peer.css";
import Image from "./Image";
import styled from "styled-components";
import Picker from "emoji-picker-react";

const socket = io.connect("http://localhost:5000");

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

const PeerOne = () => {
  const [form] = Form.useForm();
  const [userName, setUserName] = useState("");
  const [constraints, setConstraints] = useState(false);
  const [display, setDisplay] = useState(true);
  const [showUsers, setShowUsers] = useState(false);
  const [callUI, setCallUI] = useState(false);
  const [userList, setUserList] = useState([]);
  const [clientName, setClientName] = useState([]);
  const [clientId, setClientId] = useState([]);
  const [stream, setStream] = useState("");
  const myVideo = useRef();
  const remoteVideo = useRef();
  const connectionRef = useRef();
  const control = { video: true, audio: true };

  const [receivingCall, setReceivingCall] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);
  const [me, setMe] = useState("");
  const [caller, setCaller] = useState("");
  const [name, setName] = useState("");
  const [callerSignal, setCallerSignal] = useState();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [roomForm, setRoomForm] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [room, setRoom] = useState("");
  const localVideo = useRef();
  const [joinedRoom, setJoinedRoom] = useState(false);
  // const [users, setUsers] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [chat, setChat] = useState([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const [file, setFile] = useState();
  const chatContainer = useRef(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const selectFile = (e) => {
    setMessage(e.target.files[0].name);
    setFile(e.target.files[0]);
  };

  const onEmojiClick = (event, emojiObject) => {
    setMessage(message + emojiObject.emoji);
  };

  useEffect(() => {
    navigator.mediaDevices.getUserMedia(control).then((str) => {
      setStream(str);
      myVideo.current.srcObject = str;
    });

    // console.log("Using useEffect");
    socket.on("me", (id) => {
      setMe(id);
    });
    socket.on("disconnect", () => {
      socket.disconnect();
    });
    socket.on("getAllUsers", (users) => {
      setUserList(users);
    });
    socket.on("updateAllUsers", (users) => {
      setUserList(users);
    });
    socket.on("getAllRooms", (rooms) => {
      setRooms(rooms);
    });
    // Real time
    socket.on("updateRooms", (rooms) => {
      setRooms(rooms);
    });
    socket.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });
    if (joinedRoom === true) {
      console.log("you are in the room...");
    }
    socket.on("message", (messages) => {
      receivedMessage(messages);
    });

    if (showChat === true) {
      chatContainer.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [userList, rooms, messages]);

  const handleSubmit = async () => {
    if (!(userName === '' || email === '' || password === '')) {
      setUserName(userName);
      var data = { name: userName, userId: me };
      socket.emit("setSocketId", data);
      await fetch("http://127.0.0.1:8000/api/v1/login", {
        method: "POST",
        body: JSON.stringify({
          email: email,
          password: password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          res.json();
          setDisplay(false);
          console.log(res);
          setJoinedRoom(false);
          setShowUsers(true);
        })
        .catch((err) => {
          console.log(err);
          window.location.href = '/';
        });
      // if (!(userName === "")) {
      //   setUserName(userName);
      //   var data = { name: userName, userId: me };
      //   socket.emit("setSocketId", data);
      // }
    }
  };

  const handleRegisterSubmit = (event) => {
    window.location.href = '/register';
  }

  const handleChange = (event) => {
    setUserName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const peerCall = (cliName, id) => {
    setClientName(cliName);
    setClientId(id);

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
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
    setShowUsers(false);
    setCallUI(true);
  };

  const answerCall = () => {
    setConstraints(true);
    setCallAccepted(true);
    // setUserMedia();
    setCallUI(true);
    setShowUsers(false);
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

  const endCall = () => {
    console.log('ending call....');
    socket.emit("endCall");
    setCallUI(false);
    setShowUsers(true);
    setJoinedRoom(false);
  }

  const createRoom = () => {
    setRoomForm(true);
    setShowUsers(false);
    setJoinedRoom(false);
  };

  const roomCreation = async () => {
    setRoomForm(false);
    setJoinedRoom(false);
    if (!(roomName === "")) {
      setRoomName(roomName);
      form.resetFields();
      console.log("user id is ", me);
      console.log("room name is ", roomName);
      socket.emit("create_room", roomName);
      socket.on("get_room", (room) => {
        setRooms([...rooms, room]);
        console.log("room id is ", room.id);
      });
    }
    setShowUsers(true);
  };

  const joinRoom = (room) => {
    setJoinedRoom(true);
    setShowUsers(false);
    setDisplay(false);
    socket.emit("join_room", room);
    setRoom(room.id);
    console.log('user ', me, ' joined room: ', room.id);
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
    socket.on("updateAllUsers", (users) => {
      setUserList(users);
    });
  };

  function receivedMessage(message) {
    setMessages([...messages, message]);
  }

  const sendMessage = () => {
    if (file) {
      const messageObject = {
        id: me,
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
        id: me,
        type: "text",
      };
      setMessage("");
      setShowEmoji(false);
      socket.emit("send message", { ...messageObject });
      console.log(messageObject);
    }
  };

  function renderMessages(message, index) {
    if (message.type === "file") {
      const blob = new Blob([message.body], { type: message.type });
      if (message.id === me) {
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
    if (message.id === me) {
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

  const chatUser = () => {
    setShowChat(true);
    setCallUI(false);
    setDisplay(false);
    setShowUsers(false);
  };

  const leaveRoom = (room) => {
    socket.emit("leave_room", room);
    console.log("user ", me, " leave from room ", room);
    setDisplay(false);
    setJoinedRoom(false);
    setShowUsers(true);
  };

  const deleteRoom = (room) => {
    console.log('delete room id is', room.id);
    socket.emit("delete_room", room);
    // socket.on("updateRooms", rooms);
    rooms.splice(room.id, 1);
    // setDisplay(false);
    // window.location.reload(false);
    // setJoinedRoom(false);
    // setUsers(true);
    // window.location.href = '/';
  }

  return (
    <>
      <Modal
        title="Basic Modal"
        visible={receivingCall && !callAccepted}
        onOk={answerCall}
      >
        <p>{name} is calling ...</p>
      </Modal>
      <div
        className="site-card-wrapper"
        style={{
          display: display ? "block" : "none",
        }}
      >
        <Card
          title="User Login"
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
              name="userName"
              label="Name"
              id="name"
              value={userName}
              onChange={handleChange}
              rules={[
                {
                  required: true,
                  message: "Please input your name!",
                },
              ]}
            >
              <Input placeholder="Enter your name" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              rules={[
                {
                  type: 'email',
                  message: 'The input is not valid email!',
                },
                {
                  required: true,
                  message: "Please input your email!",
                },
              ]}
            >
              <Input placeholder="Enter your name" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              rules={[
                {
                  type: 'string',
                  min: 8,
                  message: 'Password must have at least 8 characters!',
                },
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input placeholder="Enter your name" />
            </Form.Item>

            <Form.Item {...tailFormItemLayout}>
              <div>
                <Button type="primary" htmlType="submit" onClick={handleSubmit}>
                  Enter
                </Button>
              </div>
              <div style={{ marginTop: "20px", display: "flex" }}>
                <p style={{ marginLeft: "200px", color: "red" }}>No Account?</p>
                <Button type="primary" htmlType="submit" onClick={handleRegisterSubmit} style={{ marginLeft: "auto" }}>
                  Register
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </div>

      <div
        className="container"
        style={{
          display: showUsers ? "block" : "none",
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
                      {/* <button onClick={() => deleteRoom(room)}>
                        Delete Room
                      </button> */}
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
            {userList.length > 0
              ? userList.map((ulist) => {
                return (
                  <Col className="gutter-row" span={6} key={ulist.userId}>
                    <Card size="small" title={ulist.name}>
                      {ulist.userId === me ? (
                        <h4>(You)</h4>
                      ) : (
                        <>
                          <button
                            onClick={() => peerCall(ulist.name, ulist.userId)}
                          >
                            Call
                          </button>
                          <button
                            onClick={() => chatUser(ulist.userId)}
                          >
                            Chat
                          </button>
                        </>
                      )}
                    </Card>
                  </Col>
                );
              })
              : null}
          </Row>
        </div>
      </div>

      {/* Join Room */}
      {joinedRoom && (
        <>
          <div className="video-container" style={{ marginTop: "50px" }}>
            <h1>Group Video Chat will be here!</h1>
          </div>
          <div className="leave-room">
            <button className="btn btn-primary" onClick={() => leaveRoom(room)}>
              Leave Room
            </button>
          </div>
        </>
      )}


      {/* Create Room */}
      {roomForm && (
        <div
          className="site-card-wrapper"
          style={{
            display: roomForm ? "block" : "none",
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
                <Button type="primary" htmlType="submit" onClick={roomCreation}>
                  Create
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      )}


      {/* Video Call UI */}

      <div style={{ display: callUI ? "block" : "none" }}>
        <div id="video-chat-container" className="video-position">
          <video id="local-video" autoPlay ref={myVideo}></video>
          <video id="remote-video" autoPlay ref={remoteVideo}></video>
        </div>
        <div>
          <button className='btn btn-danger' onClick={() => endCall()}>End Call</button>
        </div>
      </div>

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
                className={chat.writer === me ? "chat-me" : "chat-user"}
              >
                {chat.writer === me
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

export default PeerOne;
