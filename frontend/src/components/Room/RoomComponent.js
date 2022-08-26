import { Button, Col, Card, Row, notification, Space } from "antd";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import React, { useState, useEffect } from "react";
import { UserOutlined } from "@ant-design/icons";
import { signalServerUrl, localStorageGet } from "../../helpers/Utilities";

const socket = io(signalServerUrl);

const RoomComponent = () => {
    const [roomList, setRoomList] = useState({});
    const navigator = useNavigate();
    const { id } = localStorageGet("user");

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
        console.log("🚀 ~ file: Home.js ~ line 33 ~ handleJoinRoom ~ id", id);
        navigator(`/rooms/${id}`);
    };

    const deleteRoom = (key) => {
        console.log("room id is ", key);
        console.log("room created user id is ", roomList[key].createdBy);
        console.log("login user id is ", id);
        socket.emit("delete_room", key);
        notification.open({
            type: "success",
            message: "Room Delete Success!",
        });
        return navigator("/rooms");
    };
    return (
        <Row gutter={16} className="room-component">
            {roomList &&
                Object.keys(roomList).map((key) => {
                    return (
                        <Col className="gutter-row" span={5.5} key={key}>
                            <Card title={roomList[key].name} className="card">
                                <Space>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        onClick={() => handleJoinRoom(key)}
                                        className="btn btn-sm"
                                    >
                                        Join Room
                                    </Button>
                                    {id === roomList[key].createdBy && (
                                        <Button
                                            type="danger"
                                            htmlType="submit"
                                            onClick={() => deleteRoom(key)}
                                            className="btn btn-sm"
                                        >
                                            Delete Room
                                        </Button>
                                    )}
                                </Space>
                                <div className="user-count">
                                    <UserOutlined />{" "}
                                    {roomList[key].usersInRoom.length}
                                </div>
                            </Card>
                        </Col>
                    );
                })}
        </Row>
    );
};
export default RoomComponent;
