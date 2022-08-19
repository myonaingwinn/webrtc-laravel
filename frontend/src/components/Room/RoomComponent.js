import { Button, Col, Card, Row } from "antd";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import React, { useState, useEffect } from "react";
import { UserOutlined } from "@ant-design/icons";

const socket = io("http://localhost:5000");

const RoomComponent = () => {
    const [roomList, setRoomList] = useState({});
    const navigator = useNavigate();

    useEffect(() => {
        socket.on("rooms", (rooms) => {
            setRoomList(rooms);
            console.log("🚀 ~ file: Home.js ~ rooms", rooms);
            console.log("🚀 ~ file: Home.js ~ roomList", roomList);
        });
        socket.on("updateRooms", (roomList) => {
            setRoomList(roomList);
        });
        socket.on("getAllRooms", (roomList) => {
            setRoomList(roomList);
        });
    }, [roomList]);

    const handleJoinRoom = (id) => {
        console.log("🚀 ~ file: Home.js ~ line 33 ~ handleJoinRoom ~ id", id)
        navigator(`/rooms/${id}`);
    };

    const deleteRoom = (key) => {
        console.log('delete room id is', key);
        socket.emit("delete_room", key);
        return navigator("/rooms");
    }
    return (
        <Row gutter={16}>
            {roomList &&
                Object.keys(roomList).map((key) => {
                    return (
                        <Col className="gutter-row" span={5.5} key={key}>
                            <Card title={roomList[key].name} className="card">
                                <div>
                                    <Button type="primary" htmlType="submit" onClick={() => handleJoinRoom(key)} className="btn btn-sm">
                                        Join Room
                                    </Button>
                                    <Button type="danger" htmlType="submit" onClick={() => deleteRoom(key)} className="btn btn-sm">
                                        Delete Room
                                    </Button>
                                </div>
                                <div style={{ marginTop: "5px" }}>
                                    <UserOutlined /> {roomList[key].usersInRoom.length}
                                </div>
                            </Card>
                        </Col>
                    );
                })}
        </Row>
    )

};
export default RoomComponent;