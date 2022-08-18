import { Layout, Typography, Button, Card, Col, Row } from "antd";
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { PlusOutlined, SketchOutlined, UserOutlined } from "@ant-design/icons";

const socket = io("http://localhost:5000");

const RoomList = () => {
    const { Title } = Typography;
    const [rooms, setRooms] = useState([]);
    const navigator = useNavigate();
    const [joinedRoom, setJoinedRoom] = useState(false);
    const [room, setRoom] = useState("");
    const [socketId, setSocketId] = useState("");
    const [users, setUsers] = useState([]);
    const [normal, setNormal] = useState(true);
    let counts = 0;

    useEffect(() => {
        socket.on("me", (id) => {
            setSocketId(id);
            console.log("Your id is ", id);
        });

        socket.on("getAllUsers", (users) => {
            setUsers(users);
        });

        socket.on("updateUsers", (users) => {
            setUsers(users);
        });
        socket.on("getAllRooms", (rooms) => {
            setRooms(rooms);
        });

        socket.on("updateRooms", (rooms) => {
            setRooms(rooms);
        });

        if (joinedRoom === true) {
            console.log("you are in the room...");
        }

    }, [rooms]);

    const createRoom = () => {
        navigator("/create_room");
    };

    const joinRoom = (room) => {
        setNormal(false);
        setJoinedRoom(true);
        setRoom(room.id);
        console.log('user ', socketId, ' joined room: ', room.id, ' of ', room.roomName);
        console.log('maximum participants allowed are ', room.maxParticipantsAllowed);
        socket.on("full", async function (room) {
            // navigator("/rooms");
            window.location.href = "/rooms";
            alert("This Room has reached Maximum Limit!");
            console.log("this room ", room.id, "is full!");
            console.log("users has reached maximum limit!");
        });
    };

    const deleteRoom = (room) => {
        console.log('delete room id is', room.id);
        socket.emit("delete_room", room);
        return navigator("/rooms");
    }

    const leaveRoom = (room) => {
        console.log("user ", socketId, " leave from room ", room);
        // return navigator("/rooms");
        socket.emit("leave_room", room);
        // window.location.href = "/rooms";
    };

    return (
        <Layout className="room-list">
            {/* <Title className="title">Room List Component</Title> */}
            {normal && (
                <div
                    className="container"
                >
                    <div className="rooms-container">
                        <Button type="submit" htmlType="submit" onClick={createRoom} style={{ marginLeft: "20px", marginTop: "30px", backgroundColor: "#218838", borderRadius: "5px", width: "50px" }}>
                            <PlusOutlined style={{ color: "white" }} />
                        </Button>
                        {rooms.length === 0 ? (
                            <>
                                {/* <h3 className="no_rooms" style={{ textAlign: "center" }}>
                                    No Rooms! Create a room !
                                </h3> */}
                                <Title className="title">No Rooms! Create a room !</Title>
                            </>
                        ) : (
                            <>
                                {/* <h2 className="rooms_heading" style={{ textAlign: "center" }}>
                                    Available Rooms:
                                </h2> */}
                                <Title className="title">Available Rooms:</Title>
                                <Row gutter={16}>
                                    {rooms.map((room) => {
                                        // let connectedUsers = socket.sockets.clients(room);;
                                        // const numClients = connectedUsers.size;
                                        return (
                                            <Col className="gutter-row" span={6} key={room.id}>
                                                <Card title={room.roomName} className="card">
                                                    <div>
                                                        {/* <button onClick={() => joinRoom(room)}>
                                                            Join Room
                                                        </button> */}
                                                        {/* <p>{room.id}</p> */}
                                                        <Button type="primary" htmlType="submit" onClick={() => joinRoom(room)} className="btn btn-sm">
                                                            Join Room
                                                        </Button>
                                                        {/* <button onClick={() => deleteRoom(room)}>
                                                            Delete Room
                                                        </button> */}
                                                        <Button type="danger" htmlType="submit" onClick={() => deleteRoom(room)} className="btn btn-sm">
                                                            Delete Room
                                                        </Button>
                                                    </div>
                                                    <div style={{ marginTop: "5px" }}>
                                                        <UserOutlined /> 0
                                                    </div>
                                                </Card>
                                            </Col>
                                        );
                                    })}
                                </Row>
                            </>
                        )}
                    </div>
                </div>
            )}
            {joinedRoom && (
                <>
                    <div className="video-container"
                        style={{
                            marginTop: "50px",
                            // display: joinedRoom ? "block" : "none",
                        }}
                    >
                        <div>
                            <h1>Video Group Chat Will be here!</h1>
                        </div>
                        <div className="leave-room">
                            <button className="btn btn-primary" onClick={() => leaveRoom(room)}>
                                Leave Room
                            </button>
                        </div>
                    </div>
                </>
            )}
        </Layout>
    );
};

export default RoomList;
